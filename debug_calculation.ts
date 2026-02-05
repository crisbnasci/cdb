import { calculateInvestmentEvolution } from './services/investmentCalculator';
import { countBusinessDays } from './services/b3Calendar';
import { Investment } from './types';

const testInvestment: Investment = {
    id: 'test-001',
    name: 'CDB C6 Pós-fixado (Debug)',
    initialValue: 55000.00,
    startDate: '2026-01-05',
    cdiPercentage: 102,
    liquidity: 'diaria',
    fgcGuarantee: true,
    notes: '',
    status: 'active',
    taxBrackets: [
        { id: '1', label: 'Até 180 dias', minDays: 0, maxDays: 180, rate: 22.5 },
    ],
    monthlyRecords: [
        {
            id: 'rec-001',
            monthYear: '2026-02',
            cdiRate: 14.2369,
            withdrawalDate: '2026-02-05'
        }
    ],
    withdrawals: []
};

console.log('=== DEBUG: VERIFICANDO CÁLCULO DO PERÍODO ===\n');

const startDate = new Date('2026-01-05T00:00:00');
const endDate = new Date('2026-02-05T00:00:00');

console.log('Data início:', startDate.toISOString().split('T')[0]);
console.log('Data fim:', endDate.toISOString().split('T')[0]);

const businessDays = countBusinessDays(startDate, endDate);
console.log('Dias úteis (manual):', businessDays);
console.log('');

// Calcular manualmente
const BUSINESS_DAYS_PER_YEAR = 252;
const cdiAnnual = 0.142369;
const cdiDaily = Math.pow(1 + cdiAnnual, 1 / BUSINESS_DAYS_PER_YEAR) - 1;
const effectiveDaily = cdiDaily * 1.02; // 102% do CDI

console.log('Taxa CDI anual: 14.2369%');
console.log('Taxa CDI diária (100%):', (cdiDaily * 100).toFixed(8) + '%');
console.log('Taxa efetiva diária (102%):', (effectiveDaily * 100).toFixed(8) + '%');
console.log('');

const manualResult = 55000 * Math.pow(1 + effectiveDaily, businessDays);
const manualGross = manualResult - 55000;

console.log('Cálculo manual:');
console.log('  Montante final: R$', manualResult.toFixed(2));
console.log('  Rendimento bruto: R$', manualGross.toFixed(2));
console.log('');

// Agora testar com a função
const evolution = calculateInvestmentEvolution(testInvestment);

if (evolution.length > 0) {
    const result = evolution[0];
    console.log('Cálculo pela função:');
    console.log('  Dias úteis:', result.businessDays);
    console.log('  Rendimento bruto: R$', result.grossReturn.toFixed(2));
    console.log('');

    console.log('Diferença:', (result.grossReturn - manualGross).toFixed(2));
}
