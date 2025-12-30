
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Investment, MonthlyRecord, Withdrawal } from './types';
import { INITIAL_DATA } from './constants';
import { getLastBusinessDayOfMonth } from './services/b3Calendar';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InvestmentDetail from './components/InvestmentDetail';
import Settings from './components/Settings';
import Auth from './components/Auth';
import { supabase } from './services/supabase';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchInvestments();
    }
  }, [session]);

  const fetchInvestments = async () => {
    const { data, error } = await supabase
      .from('investments')
      .select(`
        *,
        monthly_records (*),
        withdrawals (*),
        tax_brackets (*)
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching investments:', error);
    } else {
      const mapped: Investment[] = (data as any[]).map(inv => ({
        id: inv.id,
        name: inv.name,
        initialValue: Number(inv.initial_value),
        startDate: inv.start_date,
        cdiPercentage: Number(inv.cdi_percentage),
        liquidity: inv.liquidity,
        fgcGuarantee: inv.fgc_guarantee,
        notes: inv.notes || '',
        status: inv.status,
        monthlyRecords: (inv.monthly_records || []).map((r: any) => ({
          id: r.id,
          monthYear: r.month_year,
          cdiRate: Number(r.cdi_rate),
          withdrawalDate: r.withdrawal_date
        })).sort((a: any, b: any) => a.monthYear.localeCompare(b.monthYear)),
        withdrawals: (inv.withdrawals || []).map((w: any) => ({
          id: w.id,
          date: w.date,
          amount: Number(w.amount),
          notes: w.notes || ''
        })),
        taxBrackets: (inv.tax_brackets || []).map((b: any) => ({
          id: b.id,
          label: b.label,
          minDays: b.min_days,
          maxDays: b.max_days,
          rate: Number(b.rate)
        })).sort((a: any, b: any) => a.minDays - b.minDays)
      }));
      setInvestments(mapped);
    }
  };

  const handleAddInvestment = async () => {
    if (!session) return;
    const newInv: Omit<Investment, 'id' | 'monthlyRecords' | 'withdrawals' | 'taxBrackets'> = {
      name: 'Novo CDB Pós-fixado',
      initialValue: 0,
      startDate: new Date().toISOString().split('T')[0],
      cdiPercentage: 100,
      liquidity: 'diaria',
      fgcGuarantee: true,
      notes: '',
      status: 'active',
    };

    const { data: invData, error: invError } = await supabase
      .from('investments')
      .insert([{
        name: newInv.name,
        initial_value: newInv.initialValue,
        start_date: newInv.startDate,
        cdi_percentage: newInv.cdiPercentage,
        liquidity: newInv.liquidity,
        fgc_guarantee: newInv.fgcGuarantee,
        notes: newInv.notes,
        status: newInv.status,
        user_id: session.user.id
      }])
      .select()
      .single();

    if (invError) {
      console.error('Error adding investment:', invError);
    } else {
      const defaultBrackets = [
        { label: 'Até 180 dias', min_days: 0, max_days: 180, rate: 22.5 },
        { label: '181 a 360 dias', min_days: 181, max_days: 360, rate: 20.0 },
        { label: '361 a 720 dias', min_days: 361, max_days: 720, rate: 17.5 },
        { label: 'Acima de 720 dias', min_days: 721, max_days: null, rate: 15.0 },
      ].map(b => ({ ...b, investment_id: invData.id }));

      const { data: bracketData } = await supabase.from('tax_brackets').insert(defaultBrackets).select();

      const mappedInv: Investment = {
        id: invData.id,
        name: invData.name,
        initialValue: Number(invData.initial_value),
        startDate: invData.start_date,
        cdiPercentage: Number(invData.cdi_percentage),
        liquidity: invData.liquidity,
        fgcGuarantee: invData.fgc_guarantee,
        notes: invData.notes || '',
        status: invData.status,
        monthlyRecords: [],
        withdrawals: [],
        taxBrackets: (bracketData || []).map((b: any) => ({
          id: b.id,
          label: b.label,
          minDays: b.min_days,
          maxDays: b.max_days,
          rate: Number(b.rate)
        }))
      };

      setInvestments([...investments, mappedInv]);
    }
  };

  const handleUpdateInvestment = async (updatedInv: Investment) => {
    const { error } = await supabase
      .from('investments')
      .update({
        name: updatedInv.name,
        initial_value: updatedInv.initialValue,
        start_date: updatedInv.startDate,
        cdi_percentage: updatedInv.cdiPercentage,
        liquidity: updatedInv.liquidity,
        fgc_guarantee: updatedInv.fgcGuarantee,
        notes: updatedInv.notes,
        status: updatedInv.status
      })
      .eq('id', updatedInv.id);

    if (error) {
      console.error('Error updating investment:', error);
    } else {
      // Update tax brackets as well
      for (const bracket of updatedInv.taxBrackets) {
        await supabase.from('tax_brackets')
          .update({
            label: bracket.label,
            rate: bracket.rate,
            min_days: bracket.minDays,
            max_days: bracket.maxDays
          })
          .eq('id', bracket.id);
      }
      setInvestments(investments.map(inv => inv.id === updatedInv.id ? updatedInv : inv));
    }
  };

  const handleDeleteInvestment = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este investimento? Todos os dados mensais serão perdidos.')) {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting investment:', error);
      } else {
        setInvestments(investments.filter(inv => inv.id !== id));
      }
    }
  };

  const handleAddMonth = async (investmentId: string) => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment) return;

    const lastRecord = investment.monthlyRecords[investment.monthlyRecords.length - 1];
    let nextMonth: string;
    let nextWithdrawal: string;

    if (lastRecord) {
      const [year, month] = lastRecord.monthYear.split('-').map(Number);
      // month is 1-12 from the string, but Date uses 0-11
      const nextDate = new Date(year, month, 1); // month (1-12) becomes next month in 0-indexed
      nextMonth = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;

      const lastDay = getLastBusinessDayOfMonth(nextDate.getFullYear(), nextDate.getMonth());
      nextWithdrawal = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;
    } else {
      const d = new Date(investment.startDate + 'T00:00:00');
      nextMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const lastDay = getLastBusinessDayOfMonth(d.getFullYear(), d.getMonth());
      nextWithdrawal = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;
    }

    const newRecord: Omit<MonthlyRecord, 'id'> = {
      monthYear: nextMonth,
      cdiRate: lastRecord ? lastRecord.cdiRate : 11.25,
      withdrawalDate: nextWithdrawal
    };

    const { data: recordData, error } = await supabase
      .from('monthly_records')
      .insert([{
        month_year: newRecord.monthYear,
        cdi_rate: newRecord.cdiRate,
        withdrawal_date: newRecord.withdrawalDate,
        investment_id: investmentId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding month:', error);
    } else {
      const mappedRecord: MonthlyRecord = {
        id: recordData.id,
        monthYear: recordData.month_year,
        cdiRate: Number(recordData.cdi_rate),
        withdrawalDate: recordData.withdrawal_date
      };
      setInvestments(investments.map(inv =>
        inv.id === investmentId
          ? { ...inv, monthlyRecords: [...inv.monthlyRecords, mappedRecord] }
          : inv
      ));
    }
  };

  const handleUpdateMonth = async (investmentId: string, recordId: string, updates: Partial<MonthlyRecord>) => {
    const dbUpdates: any = {};
    if (updates.monthYear !== undefined) dbUpdates.month_year = updates.monthYear;
    if (updates.cdiRate !== undefined) dbUpdates.cdi_rate = updates.cdiRate;
    if (updates.withdrawalDate !== undefined) dbUpdates.withdrawal_date = updates.withdrawalDate;

    const { error } = await supabase
      .from('monthly_records')
      .update(dbUpdates)
      .eq('id', recordId);

    if (error) {
      console.error('Error updating month:', error);
    } else {
      setInvestments(investments.map(inv =>
        inv.id === investmentId
          ? { ...inv, monthlyRecords: inv.monthlyRecords.map(r => r.id === recordId ? { ...r, ...updates } : r) }
          : inv
      ));
    }
  };

  const handleDeleteMonth = async (investmentId: string, recordId: string) => {
    if (!window.confirm('Excluir este mês e seus dados?')) return;

    const { error } = await supabase
      .from('monthly_records')
      .delete()
      .eq('id', recordId);

    if (error) {
      console.error('Error deleting month:', error);
    } else {
      setInvestments(investments.map(inv =>
        inv.id === investmentId
          ? { ...inv, monthlyRecords: inv.monthlyRecords.filter(r => r.id !== recordId) }
          : inv
      ));
    }
  };

  const handleAddWithdrawal = async (investmentId: string, withdrawal: Omit<Withdrawal, 'id'>) => {
    const { data: withdrawalData, error } = await supabase
      .from('withdrawals')
      .insert([{
        date: withdrawal.date,
        amount: withdrawal.amount,
        notes: withdrawal.notes,
        investment_id: investmentId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding withdrawal:', error);
    } else {
      const mappedWithdrawal: Withdrawal = {
        id: withdrawalData.id,
        date: withdrawalData.date,
        amount: Number(withdrawalData.amount),
        notes: withdrawalData.notes || ''
      };
      setInvestments(investments.map(inv =>
        inv.id === investmentId
          ? { ...inv, withdrawals: [...inv.withdrawals, mappedWithdrawal] }
          : inv
      ));
    }
  };

  const handleDeleteWithdrawal = async (investmentId: string, withdrawalId: string) => {
    if (!window.confirm('Excluir este registro de saque?')) return;

    const { error } = await supabase
      .from('withdrawals')
      .delete()
      .eq('id', withdrawalId);

    if (error) {
      console.error('Error deleting withdrawal:', error);
    } else {
      setInvestments(investments.map(inv =>
        inv.id === investmentId
          ? { ...inv, withdrawals: inv.withdrawals.filter(w => w.id !== withdrawalId) }
          : inv
      ));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth onSessionChange={setSession} />;
  }

  return (
    <Router>
      <Layout onLogout={() => supabase.auth.signOut()}>
        <Routes>
          <Route path="/" element={<Dashboard investments={investments} onAddInvestment={handleAddInvestment} onDeleteInvestment={handleDeleteInvestment} />} />
          <Route
            path="/investment/:id"
            element={
              <InvestmentDetail
                investments={investments}
                onAddMonth={handleAddMonth}
                onUpdateMonth={handleUpdateMonth}
                onDeleteMonth={handleDeleteMonth}
                onAddWithdrawal={handleAddWithdrawal}
                onDeleteWithdrawal={handleDeleteWithdrawal}
              />
            }
          />
          <Route
            path="/settings/:id"
            element={<Settings investments={investments} onSave={handleUpdateInvestment} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
