import { INITIAL_DATA } from './constants';
import { calculateInvestmentEvolution, formatCurrency } from './services/investmentCalculator';

console.log('═══════════════════════════════════════════════════════════════');
console.log('  VERIFICAÇÃO FINAL - PLANILHA vs C6 BANK');
console.log('═══════════════════════════════════════════════════════════════\n');

const investment = INITIAL_DATA[0];

console.log('📊 DADOS DO INVESTIMENTO\n');
console.log('Nome:', investment.name);
console.log('Valor inicial:', formatCurrency(investment.initialValue));
console.log('Data de início:', investment.startDate);
console.log('Rentabilidade:', investment.cdiPercentage + '% do CDI');
console.log('Taxa CDI configurada:', investment.monthlyRecords[0].cdiRate + '% a.a.');
console.log('Data de saque:', investment.monthlyRecords[0].withdrawalDate);
console.log('');

console.log('─────────────────────────────────────────────────────────────────\n');

const evolution = calculateInvestmentEvolution(investment);
const result = evolution[0];

console.log('💰 VALORES CALCULADOS PELA PLANILHA\n');
console.log('Dias úteis:', result.businessDays);
console.log('Dias corridos:', result.daysInvested);
console.log('Rendimento bruto:', formatCurrency(result.grossReturn));
console.log('IR (22,5%):', formatCurrency(result.irValue));
console.log('Rendimento líquido:', formatCurrency(result.netReturn));
console.log('Saldo bruto total:', formatCurrency(result.totalBalance));
console.log('Saldo líquido (resgate):', formatCurrency(result.netBalance));
console.log('');

console.log('─────────────────────────────────────────────────────────────────\n');

console.log('🏦 VALORES DO EXTRATO C6 BANK\n');
const c6Values = {
    gross: 715.77,
    ir: 161.04,
    net: 554.73,
    total: 55554.73
};

console.log('Rendimento bruto:', formatCurrency(c6Values.gross));
console.log('IR (22,5%):', formatCurrency(c6Values.ir));
console.log('Rendimento líquido:', formatCurrency(c6Values.net));
console.log('Total para resgate:', formatCurrency(c6Values.total));
console.log('');

console.log('─────────────────────────────────────────────────────────────────\n');

console.log('✅ COMPARAÇÃO (Diferenças)\n');

const diffGross = result.grossReturn - c6Values.gross;
const diffIR = result.irValue - c6Values.ir;
const diffNet = result.netReturn - c6Values.net;
const diffTotal = result.netBalance - c6Values.total;

const checkMark = (diff: number) => Math.abs(diff) < 0.02 ? '✅' : '❌';

console.log(`Bruto:   ${formatCurrency(diffGross)} ${checkMark(diffGross)}`);
console.log(`IR:      ${formatCurrency(diffIR)} ${checkMark(diffIR)}`);
console.log(`Líquido: ${formatCurrency(diffNet)} ${checkMark(diffNet)}`);
console.log(`Total:   ${formatCurrency(diffTotal)} ${checkMark(diffTotal)}`);
console.log('');

const allMatch = Math.abs(diffGross) < 0.02 &&
    Math.abs(diffIR) < 0.02 &&
    Math.abs(diffNet) < 0.02 &&
    Math.abs(diffTotal) < 0.02;

console.log('═══════════════════════════════════════════════════════════════\n');

if (allMatch) {
    console.log('🎉 SUCESSO! A PLANILHA ESTÁ CORRETA!');
    console.log('');
    console.log('✓ Todos os valores batem com o extrato do C6 Bank');
    console.log('✓ As diferenças de R$ 0,01 são normais (arredondamento)');
    console.log('✓ A planilha está pronta para uso!');
} else {
    console.log('❌ ATENÇÃO! Há divergências significativas.');
    console.log('');
    console.log('Por favor, verifique:');
    console.log('1. Taxa CDI está correta? (deve ser 14,2369%)');
    console.log('2. Data de início está correta? (05/01/2026)');
    console.log('3. Data de saque está correta? (05/02/2026)');
    console.log('4. Valor inicial está correto? (R$ 55.000,00)');
}

console.log('');
console.log('═══════════════════════════════════════════════════════════════\n');
