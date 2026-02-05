
import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Investment, CalculatedRow, Withdrawal } from '../types';
import { calculateInvestmentEvolution, formatCurrency, formatPercent, formatDateBR, formatMonthYear } from '../services/investmentCalculator';
import CalendarModal from './CalendarModal';

interface InvestmentDetailProps {
  investments: Investment[];
  onAddMonth: (id: string) => void;
  onUpdateMonth: (id: string, recordId: string, updates: any) => void;
  onDeleteMonth: (investmentId: string, recordId: string) => void;
  onAddWithdrawal: (investmentId: string, withdrawal: Omit<Withdrawal, 'id'>) => void;
  onDeleteWithdrawal: (investmentId: string, withdrawalId: string) => void;
}

const InvestmentDetail: React.FC<InvestmentDetailProps> = ({
  investments,
  onAddMonth,
  onUpdateMonth,
  onDeleteMonth,
  onAddWithdrawal,
  onDeleteWithdrawal
}) => {
  const { id } = useParams();
  const investment = investments.find(inv => inv.id === id);
  const [filter, setFilter] = useState('');
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDate, setWithdrawDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState<string | null>(null);

  const evolution = useMemo(() => investment ? calculateInvestmentEvolution(investment) : [], [investment]);
  const current = evolution.length > 0 ? evolution[evolution.length - 1] : null;
  const totalNetReturn = current ? current.totalBalance - investment!.initialValue + investment!.withdrawals.reduce((a, b) => a + b.amount, 0) : 0;
  const currentMonthReturn = current ? current.netReturn : 0;

  const filteredEvolution = evolution.filter(row =>
    row.monthYear.toLowerCase().includes(filter.toLowerCase())
  );

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investment || !withdrawAmount) return;
    onAddWithdrawal(investment.id, {
      amount: parseFloat(withdrawAmount),
      date: withdrawDate,
      notes: 'Saque manual'
    });
    setWithdrawAmount('');
    setShowWithdrawForm(false);
  };

  if (!investment) return <div className="p-8 text-center">Investimento não encontrado.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-800">{investment.name}</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 text-xs font-bold uppercase rounded-full">Ativo</span>
          </div>
          <p className="text-text-muted text-base max-w-2xl">
            Acompanhamento de renda fixa com cálculo regressivo de IR e liquidez diária.
          </p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Link to={`/settings/${id}`} className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-10 px-5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-lg transition-all">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Configurar
          </Link>
          <button
            onClick={() => setShowWithdrawForm(!showWithdrawForm)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-10 px-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-orange-900/10 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">payments</span>
            Fazer Saque
          </button>
          <button
            onClick={() => onAddMonth(investment.id)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg shadow-lg shadow-green-900/10 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Adicionar Mês
          </button>
        </div>
      </div>

      {investment.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-700 border border-amber-200">
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Lembrete</span>
            <p className="text-gray-800 font-medium mt-1">{investment.notes}</p>
          </div>
        </div>
      )}

      {showWithdrawForm && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-md animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 mb-4 text-orange-800">
            <span className="material-symbols-outlined">payments</span>
            <h3 className="font-bold text-lg">Registrar Novo Saque</h3>
          </div>
          <form onSubmit={handleWithdraw} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-bold text-orange-800 uppercase">Valor do Saque (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full h-11 px-4 bg-white border border-orange-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                placeholder="0,00"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-orange-800 uppercase">Data do Saque</label>
              <input
                type="date"
                required
                value={withdrawDate}
                onChange={(e) => setWithdrawDate(e.target.value)}
                className="w-full h-11 px-4 bg-white border border-orange-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-sm"
              >
                Confirmar Saque
              </button>
              <button
                type="button"
                onClick={() => setShowWithdrawForm(false)}
                className="px-4 h-11 bg-white border border-orange-300 text-orange-700 font-bold rounded-lg hover:bg-orange-100 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
          <p className="text-xs text-orange-700 mt-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">info</span>
            O valor retirado será abatido do saldo total acumulado na evolução mensal.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Highlight Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute right-0 top-0 p-8 opacity-5">
            <span className="material-symbols-outlined text-9xl text-green-600">payments</span>
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">DESTAQUE MENSAL</span>
                <span className="text-green-800 text-xs font-semibold bg-green-100 px-2 py-1 rounded border border-green-200">
                  {current ? formatMonthYear(current.monthYear) : 'N/A'}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                Quanto posso sacar neste mês sem comprometer o principal?
              </h3>
              <p className="text-sm text-gray-600 mt-2 max-w-xl">
                Este valor abaixo representa o <strong>Rendimento Líquido Mensal</strong> calculado. O investimento principal permanece seguro e investido.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-end gap-6 border-t border-green-100 pt-6 mt-auto">
              <div className="flex-1 w-full sm:w-auto">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Disponível para saque (Líquido)
                </p>
                <div className="text-5xl md:text-6xl font-black text-green-600 tracking-tighter tabular-nums drop-shadow-sm">
                  {formatCurrency(currentMonthReturn)}
                </div>
              </div>
              <div className="h-16 w-px bg-green-200 hidden sm:block mx-2 self-center"></div>
              <div className="w-full sm:w-auto bg-white/80 p-4 rounded-lg border border-green-100 backdrop-blur-sm shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Saldo Principal (Intocável)</p>
                <div className="text-2xl font-bold text-gray-700 tracking-tight tabular-nums">
                  {formatCurrency(investment.initialValue)}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  Manter investido
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reminders Card */}
        <div className="lg:col-span-1 bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-amber-800 mb-1">
            <span className="material-symbols-outlined">warning</span>
            <h3 className="font-bold text-sm uppercase tracking-wide">Lembretes Importantes</h3>
          </div>
          <ul className="space-y-3">
            {[
              { icon: 'do_not_disturb_on', color: 'text-red-500', text: <span><strong className="text-gray-900">Não resgatar tudo e reaplicar</strong> — isso reinicia o prazo do IR.</span> },
              { icon: 'do_not_disturb_on', color: 'text-red-500', text: 'Não sacar antes do fim do mês sem necessidade.' },
              { icon: 'calendar_clock', color: 'text-amber-600', text: <span>Abrir o app <strong className="text-gray-900">C6 Bank</strong> no último dia útil do mês.</span> },
              { icon: 'visibility', color: 'text-amber-600', text: 'Ver o rendimento acumulado.' },
              { icon: 'check_circle', color: 'text-green-600', text: <span>Resgatar somente o valor do <strong className="text-gray-900">rendimento</strong>.</span> },
              { icon: 'price_check', color: 'text-green-600', text: <span>Conferir se o saldo aplicado voltou para <strong className="text-gray-900">{formatCurrency(investment.initialValue)}</strong>.</span> },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                <span className={`material-symbols-outlined text-[16px] ${item.color} mt-0.5 shrink-0`}>{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-3 border-t border-amber-200/60">
            <a className="flex items-center justify-between text-xs font-semibold text-primary hover:text-primary-dark transition-colors group" href="https://www.meelion.com/indicadores-financeiros/di/?utm_source=chatgpt.com" target="_blank" rel="noreferrer">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                MEELION (taxa CDI hoje)
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-amber-200 text-[10px] text-gray-500 group-hover:border-primary group-hover:text-primary transition-colors">Ver Site</span>
            </a>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-white border-2 border-primary/20 rounded-xl p-5 flex flex-col gap-1 relative overflow-hidden group shadow-md">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl text-primary">account_balance_wallet</span>
          </div>
          <p className="text-primary font-bold text-sm uppercase tracking-wide">Investimento Inicial</p>
          <p className="text-2xl lg:text-3xl font-black text-gray-800">{formatCurrency(investment.initialValue)}</p>
          <div className="mt-3 text-xs text-gray-600 flex items-center gap-2 bg-primary/5 w-fit px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px] text-primary">calendar_today</span>
            <span className="font-medium">Início:</span>
            <span className="font-semibold text-gray-800">{formatDateBR(investment.startDate)}</span>
          </div>
        </div>

        <div className="bg-surface-white border border-border-light rounded-xl p-5 shadow-sm">
          <p className="text-text-muted text-sm font-medium">Total Disponível (Líquido)</p>
          <div className="flex items-baseline gap-2">
            <p className="text-gray-900 text-2xl font-bold tracking-tight tabular-nums">{formatCurrency(current?.totalBalance || investment.initialValue)}</p>
            <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center border border-emerald-100">
              <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span>
              {investment.initialValue > 0 ? ((totalNetReturn / investment.initialValue) * 100).toFixed(2) : '0.00'}%
            </span>
          </div>
          <p className="mt-2 text-xs text-text-muted">Saldo após todos os saques</p>
        </div>

        <div className="bg-surface-white border border-border-light rounded-xl p-5 shadow-sm">
          <p className="text-text-muted text-sm font-medium">Retorno Líquido Histórico</p>
          <p className="text-primary text-2xl font-bold tracking-tight tabular-nums">+{formatCurrency(totalNetReturn)}</p>
          <p className="mt-2 text-xs text-text-muted">Rendimento total gerado</p>
        </div>

        <div className="bg-surface-white border border-border-light rounded-xl p-5 shadow-sm">
          <p className="text-text-muted text-sm font-medium">Total Sacado</p>
          <p className="text-orange-600 text-2xl font-bold tracking-tight tabular-nums">
            {formatCurrency(investment.withdrawals.reduce((acc, curr) => acc + curr.amount, 0))}
          </p>
          <div className="mt-3 text-xs text-text-muted flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-orange-500">history</span>
            <span>{investment.withdrawals.length} saques realizados</span>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Evolution Table */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-800 text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">table_chart</span>
              Evolução Mensal & Histórico CDI
            </h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-8 pl-8 pr-3 rounded bg-white border border-gray-300 text-gray-900 text-xs placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary w-32 md:w-48"
                placeholder="Filtrar..."
                type="text"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col shadow-lg">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="sticky left-0 z-10 bg-gray-100 p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] border-r border-gray-300">Mês</th>
                    <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] text-center border-r border-gray-300">Data Saque</th>
                    <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[60px] text-center border-r border-gray-300" title="Dias úteis no período">D.U.</th>
                    <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px] text-right border-r border-gray-300">CDI</th>
                    <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] text-right border-r border-gray-300">Bruto</th>
                    <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[60px] text-center border-r border-gray-300" title="Alíquota IR (dias corridos)">IR</th>
                    <th className="p-3 text-xs font-semibold text-primary uppercase tracking-wider min-w-[100px] text-right bg-green-50/50 border-r border-gray-300">Líquido</th>
                    <th className="p-3 text-xs font-semibold text-orange-600 uppercase tracking-wider min-w-[80px] text-right border-r border-gray-300">Saques</th>
                    <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] text-right border-r border-gray-300" title="Saldo bruto acumulado">Saldo</th>
                    <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[60px] text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm tabular-nums text-gray-800">
                  {filteredEvolution.map((row) => (
                    <tr key={row.monthYear} className={`${row.isCurrent ? 'bg-green-50 font-bold' : 'hover:bg-gray-50'} transition-colors group`}>
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 p-3 border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${row.isCurrent ? 'bg-primary animate-pulse' : 'bg-gray-300'}`}></span>
                          <span>{formatMonthYear(row.monthYear)}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center border-r border-gray-200 text-xs text-gray-600">
                        {formatDateBR(row.withdrawalDate)}
                      </td>
                      <td className="p-3 text-center border-r border-gray-200">
                        <button
                          onClick={() => setSelectedCalendarMonth(row.monthYear)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                          title="Ver calendário de dias úteis"
                        >
                          {row.businessDays}
                          <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                        </button>
                      </td>
                      <td className="p-3 text-right border-r border-gray-200">
                        <input
                          type="number"
                          step="0.01"
                          value={row.cdiRate}
                          onChange={(e) => {
                            const record = investment.monthlyRecords.find(r => r.monthYear === row.monthYear);
                            if (record) onUpdateMonth(investment.id, record.id, { cdiRate: parseFloat(e.target.value) });
                          }}
                          className="w-16 text-right bg-transparent border-none p-0 focus:ring-0 text-sm font-mono"
                        />%
                      </td>
                      <td className="p-3 text-green-600 font-medium text-right border-r border-gray-200">+{formatCurrency(row.grossReturn)}</td>
                      <td className="p-3 text-center border-r border-gray-200" title={`${row.daysInvested} dias corridos`}>
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100 font-bold text-xs">{row.irRate}%</span>
                      </td>
                      <td className="p-3 text-primary font-bold text-right bg-green-50/30 border-r border-gray-200">{formatCurrency(row.netReturn)}</td>
                      <td className="p-3 text-orange-600 text-right border-r border-gray-200 font-bold">
                        {row.withdrawalAmount > 0 ? `-${formatCurrency(row.withdrawalAmount)}` : '--'}
                      </td>
                      <td className="p-3 font-semibold text-right text-gray-900 border-r border-gray-200" title={`Líquido: ${formatCurrency(row.netBalance)}`}>{formatCurrency(row.totalBalance)}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            const record = investment.monthlyRecords.find(r => r.monthYear === row.monthYear);
                            if (record) onDeleteMonth(investment.id, record.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Excluir Mês"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Withdrawals History */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <h3 className="text-gray-800 text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">history</span>
            Histórico de Saques
          </h3>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-full flex flex-col min-h-[400px]">
            {investment.withdrawals.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">payments</span>
                <p className="text-sm">Nenhum saque registrado ainda.</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[600px] flex-1">
                <div className="divide-y divide-gray-100">
                  {investment.withdrawals.sort((a, b) => b.date.localeCompare(a.date)).map((w) => (
                    <div key={w.id} className="p-4 hover:bg-gray-50 transition-colors group">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(w.amount)}</span>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                            {formatDateBR(w.date)}
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteWithdrawal(investment.id, w.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 italic">Saque manual realizado</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total em saques: {formatCurrency(investment.withdrawals.reduce((a, b) => a + b.amount, 0))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo Acumulado (Reposicionado e Estilizado) */}
      <div className="flex flex-col gap-4 mt-6">
        <h3 className="text-gray-800 text-lg font-bold flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-green-600">savings</span>
          Resumo Consolidado do Investimento
        </h3>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white max-w-2xl mx-auto w-full">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-green-50/50">
                <td className="p-4 font-bold text-gray-700">Valor Líquido para Resgate</td>
                <td className="p-4 text-right font-black text-xl text-green-700">
                  {formatCurrency(current ? current.netBalance : investment.initialValue)}
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600">Total Investido (Principal)</td>
                <td className="p-4 text-right font-bold text-gray-800">
                  {formatCurrency(investment.initialValue)}
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600">Rendimento Bruto Acumulado</td>
                <td className="p-4 text-right font-bold text-green-600">
                  +{formatCurrency(current ? current.accumulatedGross : 0)}
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600">IOF</td>
                <td className="p-4 text-right font-medium text-gray-500">
                  R$ 0,00
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600">Imposto de Renda (Estimado)</td>
                <td className="p-4 text-right font-bold text-red-500">
                  -{formatCurrency(current ? (current.accumulatedGross * (current.irRate / 100)) : 0)}
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600 flex items-center gap-1">
                  Valor Bloqueado
                  <span className="material-symbols-outlined text-[16px] text-gray-400" title="Valores em processamento ou bloqueados">info</span>
                </td>
                <td className="p-4 text-right font-medium text-gray-400">
                  R$ 0,00
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>




      {selectedCalendarMonth && (
        <CalendarModal
          monthYear={selectedCalendarMonth}
          onClose={() => setSelectedCalendarMonth(null)}
        />
      )}
    </div>
  );
};

export default InvestmentDetail;
