
import { Investment, CalculatedRow, TaxBracket } from '../types';
import { countBusinessDays, countCalendarDays } from './b3Calendar';

/**
 * Constantes para cálculo oficial B3
 */
const BUSINESS_DAYS_PER_YEAR = 252; // Dias úteis no ano (convenção B3)

/**
 * Calcula a taxa diária do CDI a partir da taxa anual
 * Fórmula oficial: taxa_diaria = (1 + CDI_anual)^(1/252) - 1
 * @param annualRate Taxa CDI anual em decimal (ex: 0.1125 para 11.25%)
 * @returns Taxa diária em decimal
 */
export function calculateDailyRate(annualRate: number): number {
  return Math.pow(1 + annualRate, 1 / BUSINESS_DAYS_PER_YEAR) - 1;
}

/**
 * Calcula o rendimento com capitalização diária
 * Fórmula: Montante = Principal × (1 + taxa_diaria)^dias_uteis
 * @param principal Valor inicial
 * @param dailyRate Taxa diária em decimal
 * @param businessDays Número de dias úteis
 * @returns Montante final
 */
export function calculateCompoundReturn(
  principal: number,
  dailyRate: number,
  businessDays: number
): number {
  return principal * Math.pow(1 + dailyRate, businessDays);
}

/**
 * Calcula a evolução mensal do investimento usando metodologia B3
 * - CDI diário: (1 + CDI_anual)^(1/252) - 1
 * - Capitalização diária real
 * - IR apenas no resgate (dias corridos)
 */
export function calculateInvestmentEvolution(investment: Investment): CalculatedRow[] {
  const rows: CalculatedRow[] = [];
  let currentBalance = investment.initialValue;
  let accumulatedGrossYield = 0;
  const startDate = new Date(investment.startDate + 'T00:00:00');

  // Ordenar registros por data
  const sortedRecords = [...investment.monthlyRecords].sort((a, b) =>
    a.monthYear.localeCompare(b.monthYear)
  );

  sortedRecords.forEach((record, index) => {
    // Determinar período do mês
    const [year, month] = record.monthYear.split('-').map(Number);

    // Data de início do período
    let periodStart: Date;
    if (index === 0) {
      // Primeiro mês: usa data de início do investimento
      periodStart = new Date(startDate);
    } else {
      // Meses seguintes: início do mês
      periodStart = new Date(year, month - 1, 1);
    }

    // Data final do período (data de saque/fechamento do mês)
    const periodEnd = new Date(record.withdrawalDate + 'T00:00:00');

    // Calcular dias úteis no período
    const businessDays = countBusinessDays(periodStart, periodEnd);

    // Calcular dias corridos desde o início (para IR)
    const calendarDaysFromStart = countCalendarDays(startDate, periodEnd);

    // Calcular taxa diária ajustada pelo % do CDI
    const adjustedAnnualRate = (record.cdiRate / 100) * (investment.cdiPercentage / 100);
    const dailyRate = calculateDailyRate(adjustedAnnualRate);

    // Calcular rendimento bruto com capitalização diária
    // Fórmula: Rendimento = Saldo × ((1 + taxa_diaria)^dias_uteis - 1)
    const grossReturn = currentBalance * (Math.pow(1 + dailyRate, businessDays) - 1);

    // Acumular rendimento bruto total
    accumulatedGrossYield += grossReturn;

    // Determinar alíquota de IR (baseada em dias corridos desde o início)
    const irRate = findTaxRate(calendarDaysFromStart, investment.taxBrackets);

    // Calcular IR sobre o rendimento do período
    // NOTA: Na prática, o IR só é cobrado no resgate, mas mostramos a estimativa
    const irValue = grossReturn * (irRate / 100);
    const netReturn = grossReturn - irValue;

    // Atualizar saldo (para o próximo período)
    currentBalance += grossReturn;

    // Aplicar saques do mês
    const monthlyWithdrawals = investment.withdrawals
      .filter(w => {
        const wDate = new Date(w.date);
        return wDate.toISOString().substring(0, 7) === record.monthYear;
      })
      .reduce((acc, curr) => acc + curr.amount, 0);

    currentBalance -= monthlyWithdrawals;

    // Saldo líquido após IR estimado
    const netBalance = investment.initialValue + accumulatedGrossYield -
      (accumulatedGrossYield * irRate / 100) -
      investment.withdrawals
        .filter(w => new Date(w.date) <= periodEnd)
        .reduce((a, b) => a + b.amount, 0);

    rows.push({
      monthYear: record.monthYear,
      withdrawalDate: record.withdrawalDate,
      daysInvested: calendarDaysFromStart,
      businessDays,
      cdiRate: record.cdiRate,
      grossReturn,
      accumulatedGross: accumulatedGrossYield,
      irRate,
      irValue,
      netReturn,
      withdrawalAmount: monthlyWithdrawals,
      totalBalance: currentBalance, // Saldo bruto (sem descontar IR)
      netBalance, // Saldo líquido estimado
      isCurrent: index === sortedRecords.length - 1
    });
  });

  return rows;
}

/**
 * Encontra a alíquota de IR baseada nos dias corridos
 * Tabela regressiva de IR para renda fixa:
 * - Até 180 dias: 22,5%
 * - 181 a 360 dias: 20%
 * - 361 a 720 dias: 17,5%
 * - Acima de 720 dias: 15%
 */
function findTaxRate(days: number, brackets: TaxBracket[]): number {
  const bracket = brackets.find(b => {
    if (b.maxDays === null) return days >= b.minDays;
    return days >= b.minDays && days <= b.maxDays;
  });
  return bracket ? bracket.rate : 22.5;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '--';
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
}

export function formatPercent(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
}

export function formatMonthYear(monthYear: string): string {
  if (!monthYear) return '--';
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const [year, month] = monthYear.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  const shortYear = year.slice(-2);
  return `${months[monthIndex]}/${shortYear}`;
}

/**
 * Calcula o rendimento disponível para saque (líquido de IR)
 * O IR só incide no momento do resgate
 */
export function calculateAvailableForWithdrawal(
  grossYield: number,
  daysFromStart: number,
  brackets: TaxBracket[]
): { net: number; tax: number; rate: number } {
  const rate = findTaxRate(daysFromStart, brackets);
  const tax = grossYield * (rate / 100);
  const net = grossYield - tax;
  return { net, tax, rate };
}
