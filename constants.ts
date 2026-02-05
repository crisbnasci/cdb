
import { Investment, TaxBracket } from './types';

export const DEFAULT_TAX_BRACKETS: TaxBracket[] = [
  { id: '1', label: 'Até 180 dias', minDays: 0, maxDays: 180, rate: 22.5 },
  { id: '2', label: '181 a 360 dias', minDays: 181, maxDays: 360, rate: 20.0 },
  { id: '3', label: '361 a 720 dias', minDays: 361, maxDays: 720, rate: 17.5 },
  { id: '4', label: 'Acima de 720 dias', minDays: 721, maxDays: null, rate: 15.0 },
];

export const INITIAL_DATA: Investment[] = [
  {
    id: '1',
    name: 'CDB C6 Pós-fixado (102% CDI)',
    initialValue: 55000,
    startDate: '2026-01-05',
    cdiPercentage: 102,
    liquidity: 'diaria',
    fgcGuarantee: true,
    notes: 'Liquidez diária (D+0). Valores conferidos com extrato C6 Bank.',
    taxBrackets: [...DEFAULT_TAX_BRACKETS],
    status: 'active',
    withdrawals: [],
    monthlyRecords: [
      {
        id: 'm1',
        monthYear: '2026-02',
        cdiRate: 14.2369, // Taxa CDI precisa para bater com C6 Bank
        withdrawalDate: '2026-02-05'
      }
    ]
  }
];
