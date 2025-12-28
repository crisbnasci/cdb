
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
    name: 'CDB C6 Pós-fixado',
    initialValue: 51000,
    startDate: '2024-01-01',
    cdiPercentage: 102,
    liquidity: 'diaria',
    fgcGuarantee: true,
    notes: '',
    taxBrackets: [...DEFAULT_TAX_BRACKETS],
    status: 'active',
    withdrawals: [],
    monthlyRecords: [
      { id: 'm1', monthYear: '2024-01', cdiRate: 11.25, withdrawalDate: '2024-01-31' },
      { id: 'm2', monthYear: '2024-02', cdiRate: 11.15, withdrawalDate: '2024-02-29' },
      { id: 'm3', monthYear: '2024-03', cdiRate: 11.00, withdrawalDate: '2024-03-29' },
      { id: 'm4', monthYear: '2024-04', cdiRate: 10.90, withdrawalDate: '2024-04-30' },
      { id: 'm5', monthYear: '2024-05', cdiRate: 10.75, withdrawalDate: '2024-05-31' },
    ]
  },
  {
    id: '2',
    name: 'Reserva de Emergência',
    initialValue: 10000,
    startDate: '2024-02-15',
    cdiPercentage: 100,
    liquidity: 'diaria',
    fgcGuarantee: true,
    notes: '',
    taxBrackets: [...DEFAULT_TAX_BRACKETS],
    status: 'active',
    withdrawals: [],
    monthlyRecords: [
      { id: 'r1', monthYear: '2024-02', cdiRate: 11.15, withdrawalDate: '2024-02-29' },
      { id: 'r2', monthYear: '2024-03', cdiRate: 11.00, withdrawalDate: '2024-03-29' },
    ]
  },
  {
    id: '3',
    name: 'CDB Nubank Caixinha',
    initialValue: 5000,
    startDate: '2024-03-10',
    cdiPercentage: 100,
    liquidity: 'diaria',
    fgcGuarantee: true,
    notes: '',
    taxBrackets: [...DEFAULT_TAX_BRACKETS],
    status: 'active',
    withdrawals: [],
    monthlyRecords: [
      { id: 'n1', monthYear: '2024-03', cdiRate: 11.00, withdrawalDate: '2024-03-31' },
    ]
  }
];
