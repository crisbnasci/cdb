
import { Investment, CalculatedRow, TaxBracket } from '../types';

/**
 * Calculates the monthly return and cumulative values for an investment.
 * Formula for monthly interest: (1 + CDI_Rate)^(1/12) - 1, then adjusted by % of CDI.
 */
export function calculateInvestmentEvolution(investment: Investment): CalculatedRow[] {
  const rows: CalculatedRow[] = [];
  let currentBalance = investment.initialValue;
  const startDate = new Date(investment.startDate);

  investment.monthlyRecords.sort((a, b) => a.monthYear.localeCompare(b.monthYear)).forEach((record, index) => {
    const withdrawalDate = new Date(record.withdrawalDate);
    const diffTime = Math.abs(withdrawalDate.getTime() - startDate.getTime());
    const daysInvested = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const adjustedAnnualRate = (record.cdiRate / 100) * (investment.cdiPercentage / 100);
    const monthlyRate = Math.pow(1 + adjustedAnnualRate, 1 / 12) - 1;

    const grossReturn = currentBalance * monthlyRate;

    // IR Calculation
    const irRate = findTaxRate(daysInvested, investment.taxBrackets);
    const irValue = grossReturn * (irRate / 100);
    const netReturn = grossReturn - irValue;

    currentBalance += netReturn;

    // Apply withdrawals that happened in this month
    const monthlyWithdrawals = investment.withdrawals
      .filter(w => {
        const wDate = new Date(w.date);
        return wDate.toISOString().substring(0, 7) === record.monthYear;
      })
      .reduce((acc, curr) => acc + curr.amount, 0);

    currentBalance -= monthlyWithdrawals;

    rows.push({
      monthYear: record.monthYear,
      withdrawalDate: record.withdrawalDate,
      daysInvested,
      cdiRate: record.cdiRate,
      grossReturn,
      irRate,
      irValue,
      netReturn,
      withdrawalAmount: monthlyWithdrawals,
      totalBalance: currentBalance,
      isCurrent: index === investment.monthlyRecords.length - 1
    });
  });

  return rows;
}

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
