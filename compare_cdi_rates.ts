import { calculateInvestmentEvolution } from './services/investmentCalculator';
import { Investment } from './types';

/**
 * Script para testar e validar os cálculos com diferentes taxas CDI
 */

// Configuração do investimento
const baseInvestment: Omit<Investment, 'monthlyRecords'> = {
    id: 'cdb-c6',
    name: 'CDB C6 Pós-fixado',
    initialValue: 55000.00,
    startDate: '2026-01-05',
    cdiPercentage: 102,
    liquidity: 'diaria',
    fgcGuarantee: true,
    notes: '',
    status: 'active',
    taxBrackets: [
        { id: '1', label: 'Até 180 dias', minDays: 0, maxDays: 180, rate: 22.5 },
        { id: '2', label: '181 a 360 dias', minDays: 181, maxDays: 360, rate: 20.0 },
        { id: '3', label: '361 a 720 dias', minDays: 361, maxDays: 720, rate: 17.5 },
        { id: '4', label: 'Acima de 720 dias', minDays: 721, maxDays: null, rate: 15.0 },
    ],
    withdrawals: []
};

console.log('═══════════════════════════════════════════════════════════════');
console.log('  COMPARAÇÃO DE TAXAS CDI - CDB C6 PÓS-FIXADO (102% CDI)');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Investimento: R$ 55.000,00');
console.log('Período: 05/01/2026 a 05/02/2026');
console.log('Rentabilidade: 102% do CDI');
console.log('Dias úteis: 24 | Dias corridos: 31\n');

// Teste 1: Taxa CDI que bate com C6 Bank
console.log('─────────────────────────────────────────────────────────────────');
console.log('OPÇÃO 1: CDI 14,2369% (BATE COM EXTRATO C6 BANK)');
console.log('─────────────────────────────────────────────────────────────────\n');

const investment1: Investment = {
    ...baseInvestment,
    monthlyRecords: [{
        id: 'rec-1',
        monthYear: '2026-02',
        cdiRate: 14.2369,
        withdrawalDate: '2026-02-05'
    }]
};

const result1 = calculateInvestmentEvolution(investment1)[0];

console.log('Taxa CDI: 14,2369% a.a.');
console.log('Rendimento bruto: R$', result1.grossReturn.toFixed(2));
console.log('IR (22,5%): R$', result1.irValue.toFixed(2));
console.log('Rendimento líquido: R$', result1.netReturn.toFixed(2));
console.log('Total para resgate: R$', result1.netBalance.toFixed(2));
console.log('\n✓ Comparação com C6 Bank:');
console.log('  Bruto esperado: R$ 715,77 | Calculado: R$', result1.grossReturn.toFixed(2), result1.grossReturn === 715.77 ? '✓' : '(diferença: R$' + (result1.grossReturn - 715.77).toFixed(2) + ')');
console.log('  Líquido esperado: R$ 554,73 | Calculado: R$', result1.netReturn.toFixed(2), Math.abs(result1.netReturn - 554.73) < 0.02 ? '✓' : '(diferença: R$' + (result1.netReturn - 554.73).toFixed(2) + ')');
console.log('  Total esperado: R$ 55.554,73 | Calculado: R$', result1.netBalance.toFixed(2), Math.abs(result1.netBalance - 55554.73) < 0.02 ? '✓' : '(diferença: R$' + (result1.netBalance - 55554.73).toFixed(2) + ')');

// Teste 2: Taxa CDI atual (Meelion)
console.log('\n─────────────────────────────────────────────────────────────────');
console.log('OPÇÃO 2: CDI 14,90% (TAXA ATUAL - MEELION)');
console.log('─────────────────────────────────────────────────────────────────\n');

const investment2: Investment = {
    ...baseInvestment,
    monthlyRecords: [{
        id: 'rec-2',
        monthYear: '2026-02',
        cdiRate: 14.90,
        withdrawalDate: '2026-02-05'
    }]
};

const result2 = calculateInvestmentEvolution(investment2)[0];

console.log('Taxa CDI: 14,90% a.a.');
console.log('Rendimento bruto: R$', result2.grossReturn.toFixed(2));
console.log('IR (22,5%): R$', result2.irValue.toFixed(2));
console.log('Rendimento líquido: R$', result2.netReturn.toFixed(2));
console.log('Total para resgate: R$', result2.netBalance.toFixed(2));
console.log('\n✓ Diferença em relação ao C6 Bank:');
console.log('  Bruto: +R$', (result2.grossReturn - 715.77).toFixed(2));
console.log('  Líquido: +R$', (result2.netReturn - 554.73).toFixed(2));
console.log('  Total: +R$', (result2.netBalance - 55554.73).toFixed(2));

// Resumo
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  RESUMO E RECOMENDAÇÃO');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('┌─────────────────────────────────────────────────────────────┐');
console.log('│ OPÇÃO 1: Use CDI 14,2369% se você quer que a planilha      │');
console.log('│          bata EXATAMENTE com o extrato do C6 Bank           │');
console.log('│          (valores de 05/02/2026)                            │');
console.log('└─────────────────────────────────────────────────────────────┘\n');

console.log('┌─────────────────────────────────────────────────────────────┐');
console.log('│ OPÇÃO 2: Use CDI 14,90% se você quer usar a taxa mais      │');
console.log('│          recente (atualizada hoje pelo Meelion)             │');
console.log('│          Os valores serão ligeiramente maiores              │');
console.log('└─────────────────────────────────────────────────────────────┘\n');

console.log('IMPORTANTE: A diferença entre as duas opções é de aproximadamente');
console.log('R$', (result2.netReturn - result1.netReturn).toFixed(2), 'no rendimento líquido.\n');

console.log('═══════════════════════════════════════════════════════════════\n');
