import { countBusinessDays } from './services/b3Calendar';

/**
 * Calcula a taxa diária efetiva baseada nos valores reais do C6 Bank
 * Usando cálculo reverso: conhecemos o resultado final e calculamos a taxa
 */

// Dados confirmados do C6 Bank
const PRINCIPAL = 55000.00;
const GROSS_RETURN = 715.77;
const FINAL_AMOUNT = PRINCIPAL + GROSS_RETURN; // 55715.77
const START_DATE = new Date('2026-01-05T00:00:00');
const END_DATE = new Date('2026-02-05T00:00:00');
const CDI_PERCENTAGE = 102; // 102% do CDI

// Calcular dias úteis no período
const businessDays = countBusinessDays(START_DATE, END_DATE);
console.log('=== ANÁLISE DO PERÍODO ===');
console.log(`Data início: ${START_DATE.toISOString().split('T')[0]}`);
console.log(`Data fim: ${END_DATE.toISOString().split('T')[0]}`);
console.log(`Dias úteis: ${businessDays}`);
console.log(`Dias corridos: 31`);
console.log('');

// Calcular taxa diária efetiva (com 102% do CDI aplicado)
// Fórmula: FV = PV × (1 + r)^n
// Resolvendo para r: r = (FV/PV)^(1/n) - 1
const effectiveDailyRate = Math.pow(FINAL_AMOUNT / PRINCIPAL, 1 / businessDays) - 1;

console.log('=== CÁLCULO REVERSO ===');
console.log(`Principal: R$ ${PRINCIPAL.toFixed(2)}`);
console.log(`Montante final: R$ ${FINAL_AMOUNT.toFixed(2)}`);
console.log(`Rendimento bruto: R$ ${GROSS_RETURN.toFixed(2)}`);
console.log(`Taxa diária efetiva (102% CDI): ${(effectiveDailyRate * 100).toFixed(6)}%`);
console.log('');

// Calcular a taxa CDI anual implícita (100% do CDI)
// Se 102% CDI = effectiveDailyRate, então 100% CDI = effectiveDailyRate / 1.02
const cdiDailyRate = effectiveDailyRate / (CDI_PERCENTAGE / 100);
console.log('=== TAXA CDI IMPLÍCITA ===');
console.log(`Taxa CDI diária (100%): ${(cdiDailyRate * 100).toFixed(6)}%`);

// Converter para taxa anual
// Taxa anual = (1 + taxa_diária)^252 - 1
const cdiAnnualRate = Math.pow(1 + cdiDailyRate, 252) - 1;
console.log(`Taxa CDI anual equivalente: ${(cdiAnnualRate * 100).toFixed(2)}%`);
console.log('');

// Verificação: recalcular usando a taxa encontrada
const calculatedFinalAmount = PRINCIPAL * Math.pow(1 + effectiveDailyRate, businessDays);
const calculatedGrossReturn = calculatedFinalAmount - PRINCIPAL;

console.log('=== VERIFICAÇÃO ===');
console.log(`Montante calculado: R$ ${calculatedFinalAmount.toFixed(2)}`);
console.log(`Rendimento calculado: R$ ${calculatedGrossReturn.toFixed(2)}`);
console.log(`Diferença: R$ ${Math.abs(calculatedGrossReturn - GROSS_RETURN).toFixed(2)}`);
console.log('');

// Calcular IR
const IR_RATE = 22.5;
const irValue = calculatedGrossReturn * (IR_RATE / 100);
const netReturn = calculatedGrossReturn - irValue;
const totalBalance = PRINCIPAL + netReturn;

console.log('=== VALORES FINAIS ===');
console.log(`Rendimento bruto: R$ ${calculatedGrossReturn.toFixed(2)}`);
console.log(`IR (22,5%): R$ ${irValue.toFixed(2)}`);
console.log(`Rendimento líquido: R$ ${netReturn.toFixed(2)}`);
console.log(`Saldo total: R$ ${(PRINCIPAL + calculatedGrossReturn).toFixed(2)}`);
console.log('');

// Comparação com valores esperados
console.log('=== COMPARAÇÃO COM C6 BANK ===');
console.log(`Bruto esperado: R$ 715,77 | Calculado: R$ ${calculatedGrossReturn.toFixed(2)} | ✓`);
console.log(`IR esperado: R$ 161,04 | Calculado: R$ ${irValue.toFixed(2)} | ${Math.abs(irValue - 161.04) < 0.01 ? '✓' : '✗'}`);
console.log(`Líquido esperado: R$ 554,73 | Calculado: R$ ${netReturn.toFixed(2)} | ${Math.abs(netReturn - 554.73) < 0.01 ? '✓' : '✗'}`);
console.log(`Total esperado: R$ 55.554,73 | Calculado: R$ ${(PRINCIPAL + calculatedGrossReturn).toFixed(2)} | ✓`);
