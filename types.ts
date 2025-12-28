
export interface TaxBracket {
  id: string;
  label: string;
  minDays: number;
  maxDays: number | null;
  rate: number; // e.g., 22.5
}

export interface MonthlyRecord {
  id: string;
  monthYear: string; // ISO format or MM/YYYY
  cdiRate: number; // Annual CDI rate for that month
  withdrawalDate: string; // YYYY-MM-DD
}

export interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  notes?: string;
}

export interface Investment {
  id: string;
  name: string;
  initialValue: number;
  startDate: string;
  cdiPercentage: number;
  liquidity: 'diaria' | 'vencimento' | 'd_plus_1';
  fgcGuarantee: boolean;
  notes: string;
  taxBrackets: TaxBracket[];
  monthlyRecords: MonthlyRecord[];
  withdrawals: Withdrawal[];
  status: 'active' | 'archived';
}

export interface CalculatedRow {
  monthYear: string;
  withdrawalDate: string;
  daysInvested: number;
  cdiRate: number;
  grossReturn: number;
  irRate: number;
  irValue: number;
  netReturn: number;
  withdrawalAmount: number;
  totalBalance: number;
  isCurrent: boolean;
}

export interface PortfolioStats {
  totalInvested: number;
  netWorth: number;
  accumulatedReturn: number;
  returnPercentage: number;
  activeCount: number;
}
