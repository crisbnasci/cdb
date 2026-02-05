/**
 * Cálculo preciso para verificar a taxa CDI necessária
 */

const PRINCIPAL = 55000.00;
const EXPECTED_GROSS = 715.77;
const BUSINESS_DAYS = 24;
const CDI_PERCENTAGE = 102 / 100; // 102% do CDI

// Calcular a taxa diária efetiva necessária para obter R$ 715.77
// FV = PV × (1 + r)^n
// 55715.77 = 55000 × (1 + r)^24
// (1 + r)^24 = 55715.77 / 55000
// r = (55715.77 / 55000)^(1/24) - 1

const finalAmount = PRINCIPAL + EXPECTED_GROSS;
const effectiveDailyRate = Math.pow(finalAmount / PRINCIPAL, 1 / BUSINESS_DAYS) - 1;

console.log('=== CÁLCULO REVERSO PRECISO ===');
console.log(`Principal: R$ ${PRINCIPAL.toFixed(2)}`);
console.log(`Rendimento bruto esperado: R$ ${EXPECTED_GROSS.toFixed(2)}`);
console.log(`Montante final: R$ ${finalAmount.toFixed(2)}`);
console.log(`Dias úteis: ${BUSINESS_DAYS}`);
console.log('');

console.log('Taxa diária efetiva (102% CDI): ' + (effectiveDailyRate * 100).toFixed(8) + '%');

// Calcular a taxa CDI pura (100%)
const cdiDailyRate = effectiveDailyRate / CDI_PERCENTAGE;
console.log('Taxa CDI diária (100%): ' + (cdiDailyRate * 100).toFixed(8) + '%');

// Converter para taxa anual
const cdiAnnualRate = Math.pow(1 + cdiDailyRate, 252) - 1;
console.log('Taxa CDI anual equivalente: ' + (cdiAnnualRate * 100).toFixed(4) + '%');
console.log('');

// Verificar com a taxa encontrada
const calculated = PRINCIPAL * Math.pow(1 + effectiveDailyRate, BUSINESS_DAYS);
const calculatedGross = calculated - PRINCIPAL;

console.log('=== VERIFICAÇÃO ===');
console.log(`Montante calculado: R$ ${calculated.toFixed(2)}`);
console.log(`Rendimento bruto calculado: R$ ${calculatedGross.toFixed(2)}`);
console.log(`Diferença: R$ ${Math.abs(calculatedGross - EXPECTED_GROSS).toFixed(4)}`);
console.log('');

// Agora testar com a taxa CDI de 14.24% que estamos usando
console.log('=== TESTE COM CDI 14.24% ===');
const testCDIAnnual = 0.1424;
const testDailyRate = Math.pow(1 + testCDIAnnual, 1 / 252) - 1;
const testEffectiveDaily = testDailyRate * CDI_PERCENTAGE;

console.log('Taxa CDI anual: 14.24%');
console.log('Taxa CDI diária (100%): ' + (testDailyRate * 100).toFixed(8) + '%');
console.log('Taxa efetiva diária (102%): ' + (testEffectiveDaily * 100).toFixed(8) + '%');

const testResult = PRINCIPAL * Math.pow(1 + testEffectiveDaily, BUSINESS_DAYS);
const testGross = testResult - PRINCIPAL;

console.log(`Rendimento bruto com CDI 14.24%: R$ ${testGross.toFixed(2)}`);
console.log(`Diferença do esperado: R$ ${(testGross - EXPECTED_GROSS).toFixed(2)}`);
