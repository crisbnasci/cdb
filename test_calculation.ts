import { calculateInvestmentEvolution } from './services/investmentCalculator';
import { Investment } from './types';

/**
 * Teste com dados reais do C6 Bank
 * Período: 05/01/2026 a 05/02/2026
 */

const testInvestment: Investment = {
    id: 'test-001',
    name: 'CDB C6 Pós-fixado (Teste)',
    initialValue: 55000.00,
    startDate: '2026-01-05',
    cdiPercentage: 102,
    liquidity: 'diaria',
    fgcGuarantee: true,
    notes: 'Teste de validação com dados reais do C6 Bank',
    status: 'active',
    taxBrackets: [
        { id: '1', label: 'Até 180 dias', minDays: 0, maxDays: 180, rate: 22.5 },
        { id: '2', label: '181 a 360 dias', minDays: 181, maxDays: 360, rate: 20.0 },
        { id: '3', label: '361 a 720 dias', minDays: 361, maxDays: 720, rate: 17.5 },
        { id: '4', label: 'Acima de 720 dias', minDays: 721, maxDays: null, rate: 15.0 },
    ],
    monthlyRecords: [
        {
            id: 'rec-001',
            monthYear: '2026-02',
            cdiRate: 14.2369, // Taxa CDI anual precisa para bater com C6 Bank
            withdrawalDate: '2026-02-05'
        }
    ],
    withdrawals: []
};

console.log('=== TESTE COM DADOS C6 BANK ===\n');
console.log('Investimento:', testInvestment.name);
console.log('Valor inicial: R$', testInvestment.initialValue.toFixed(2));
console.log('Período: 05/01/2026 a 05/02/2026');
console.log('Rentabilidade:', testInvestment.cdiPercentage + '% do CDI');
console.log('Taxa CDI anual: 14.2369%');
console.log('');

const evolution = calculateInvestmentEvolution(testInvestment);

if (evolution.length > 0) {
    const result = evolution[0];

    console.log('=== RESULTADOS CALCULADOS ===\n');
    console.log('Dias úteis:', result.businessDays);
    console.log('Dias corridos:', result.daysInvested);
    console.log('Rendimento bruto: R$', result.grossReturn.toFixed(2));
    console.log('IR (22,5%): R$', result.irValue.toFixed(2));
    console.log('Rendimento líquido: R$', result.netReturn.toFixed(2));
    console.log('Saldo bruto total: R$', result.totalBalance.toFixed(2));
    console.log('Saldo líquido (para resgate): R$', result.netBalance.toFixed(2));
    console.log('');

    console.log('=== COMPARAÇÃO COM C6 BANK ===\n');

    const expectedGross = 715.77;
    const expectedIR = 161.04;
    const expectedNet = 554.73;
    const expectedNetTotal = 55554.73; // Valor líquido para resgate (principal + net)

    const grossMatch = Math.abs(result.grossReturn - expectedGross) < 0.10;
    const irMatch = Math.abs(result.irValue - expectedIR) < 0.10;
    const netMatch = Math.abs(result.netReturn - expectedNet) < 0.10;
    const netTotalMatch = Math.abs(result.netBalance - expectedNetTotal) < 0.10;

    console.log(`Bruto:   Esperado R$ ${expectedGross.toFixed(2)} | Calculado R$ ${result.grossReturn.toFixed(2)} | ${grossMatch ? '✓ OK' : '✗ ERRO'}`);
    console.log(`IR:      Esperado R$ ${expectedIR.toFixed(2)} | Calculado R$ ${result.irValue.toFixed(2)} | ${irMatch ? '✓ OK' : '✗ ERRO'}`);
    console.log(`Líquido: Esperado R$ ${expectedNet.toFixed(2)} | Calculado R$ ${result.netReturn.toFixed(2)} | ${netMatch ? '✓ OK' : '✗ ERRO'}`);
    console.log(`Total líquido (resgate): Esperado R$ ${expectedNetTotal.toFixed(2)} | Calculado R$ ${result.netBalance.toFixed(2)} | ${netTotalMatch ? '✓ OK' : '✗ ERRO'}`);
    console.log('');

    if (grossMatch && irMatch && netMatch && netTotalMatch) {
        console.log('🎉 SUCESSO! Todos os valores estão corretos!');
    } else {
        console.log('❌ ERRO! Há divergências nos valores.');
        console.log('');
        console.log('Diferenças:');
        console.log(`  Bruto: R$ ${(result.grossReturn - expectedGross).toFixed(2)}`);
        console.log(`  IR: R$ ${(result.irValue - expectedIR).toFixed(2)}`);
        console.log(`  Líquido: R$ ${(result.netReturn - expectedNet).toFixed(2)}`);
        console.log(`  Total líquido: R$ ${(result.netBalance - expectedNetTotal).toFixed(2)}`);
    }
} else {
    console.log('❌ ERRO: Nenhum resultado calculado!');
}
