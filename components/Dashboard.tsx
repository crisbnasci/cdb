
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Investment, PortfolioStats } from '../types';
import { calculateInvestmentEvolution, formatCurrency } from '../services/investmentCalculator';

interface DashboardProps {
  investments: Investment[];
  onAddInvestment: () => void;
  onDeleteInvestment: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ investments, onAddInvestment, onDeleteInvestment }) => {
  const stats: PortfolioStats = useMemo(() => {
    let totalInvested = 0;
    let netWorth = 0;
    
    investments.forEach(inv => {
      totalInvested += inv.initialValue;
      const evolution = calculateInvestmentEvolution(inv);
      if (evolution.length > 0) {
        netWorth += evolution[evolution.length - 1].totalBalance;
      } else {
        netWorth += inv.initialValue;
      }
    });

    const accumulatedReturn = netWorth - totalInvested;
    const returnPercentage = totalInvested > 0 ? (accumulatedReturn / totalInvested) * 100 : 0;

    return {
      totalInvested,
      netWorth,
      accumulatedReturn,
      returnPercentage,
      activeCount: investments.length
    };
  }, [investments]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-800">Visão Geral</h2>
          <p className="text-text-muted mt-1 text-base">Gerencie seus ativos de renda fixa e acompanhe a rentabilidade da sua carteira.</p>
        </div>
        <button 
          onClick={onAddInvestment}
          className="flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg shadow-lg shadow-green-900/10 transition-all w-full md:w-auto"
        >
          <span className="material-symbols-outlined text-[22px]">add_circle</span>
          Adicionar Novo Investimento CDB
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:border-green-200 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-7xl text-gray-800">account_balance</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-gray-50 rounded text-gray-600">
              <span className="material-symbols-outlined text-[18px]">savings</span>
            </span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Investido</span>
          </div>
          <div className="text-3xl font-black text-gray-800 tracking-tight">{formatCurrency(stats.totalInvested)}</div>
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {stats.activeCount} Ativos em carteira
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden border-b-4 border-b-primary group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-7xl text-primary">payments</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-green-50 rounded text-primary">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Patrimônio Líquido</span>
          </div>
          <div className="text-3xl font-black text-gray-800 tracking-tight">{formatCurrency(stats.netWorth)}</div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
            100% Disponível para resgate
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50/50 to-white border border-green-200 rounded-xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-7xl text-green-600">trending_up</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-green-100 rounded text-green-700">
              <span className="material-symbols-outlined text-[18px]">monitoring</span>
            </span>
            <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Rentabilidade Acumulada</span>
          </div>
          <div className="text-3xl font-black text-green-600 tracking-tight">
            {stats.accumulatedReturn >= 0 ? '+ ' : ''}
            {formatCurrency(stats.accumulatedReturn)}
          </div>
          <span className="text-xs text-green-700 font-medium bg-green-100/50 w-fit px-2 py-0.5 rounded border border-green-100">
            {stats.returnPercentage >= 0 ? '+' : ''}
            {stats.returnPercentage.toFixed(2)}% de retorno global
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="text-lg font-bold text-gray-800 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">list_alt</span> 
            Carteira de Ativos
          </div>
          {investments.length === 0 && (
            <span className="text-sm font-normal text-gray-400">Nenhum investimento cadastrado</span>
          )}
        </h3>
        
        <div className="flex flex-col gap-4">
          {investments.map(inv => (
            <InvestmentCard key={inv.id} investment={inv} onDelete={() => onDeleteInvestment(inv.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const InvestmentCard: React.FC<{ investment: Investment; onDelete: () => void }> = ({ investment, onDelete }) => {
  const evolution = useMemo(() => calculateInvestmentEvolution(investment), [investment]);
  const current = evolution.length > 0 ? evolution[evolution.length - 1] : null;
  const netReturn = current ? current.totalBalance - investment.initialValue : 0;
  const returnPercentage = (netReturn / investment.initialValue) * 100;

  const colorClasses = {
    'CDB C6 Pós-fixado': 'border-green-200 hover:border-primary/30',
    'Reserva de Emergência': 'border-orange-200 hover:border-orange-300',
    'CDB Nubank Caixinha': 'border-purple-200 hover:border-purple-300',
  }[investment.name] || 'border-gray-200 hover:border-primary/30';

  const iconClasses = {
    'CDB C6 Pós-fixado': 'bg-gray-50 text-gray-600 group-hover:bg-green-50 group-hover:text-primary icon-account_balance',
    'Reserva de Emergência': 'bg-orange-50 text-orange-600 group-hover:bg-orange-100 icon-savings',
    'CDB Nubank Caixinha': 'bg-purple-50 text-purple-600 group-hover:bg-purple-100 icon-lock_clock',
  }[investment.name] || 'bg-gray-50 text-gray-600 group-hover:bg-green-50 group-hover:text-primary icon-account_balance';

  const iconName = iconClasses.split(' icon-')[1];

  return (
    <div className={`bg-white border ${colorClasses.split(' ')[0]} rounded-xl p-0 shadow-sm hover:shadow-lg transition-all group overflow-hidden`}>
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-4 flex items-start gap-4">
          <div className={`${iconClasses.split(' icon-')[0]} p-3 rounded-xl border border-transparent transition-colors`}>
            <span className="material-symbols-outlined text-[28px]">{iconName}</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                {investment.name}
              </h4>
              <span className="bg-green-100 text-green-700 border border-green-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">Ativo</span>
            </div>
            <p className="text-sm text-text-muted mb-2">Liquidez {investment.liquidity === 'diaria' ? 'Diária' : 'D+1'} • {investment.cdiPercentage}% CDI</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              Início: {new Date(investment.startDate).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-8">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-1">Valor Investido</p>
            <p className="text-base font-semibold text-gray-900 tabular-nums">{formatCurrency(investment.initialValue)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-1">Saldo Atual (Líq.)</p>
            <p className="text-base font-bold text-gray-900 tabular-nums">{formatCurrency(current?.totalBalance || investment.initialValue)}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-1">Rentabilidade</p>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-primary tabular-nums">+{formatCurrency(netReturn)}</span>
              <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold border border-green-100">
                {returnPercentage.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex items-center justify-end gap-2 border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
          <Link 
            to={`/investment/${investment.id}`}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-10 px-5 bg-white border border-gray-300 hover:border-primary hover:bg-primary hover:text-white text-gray-700 text-sm font-semibold rounded-lg transition-all shadow-sm"
          >
            Detalhes
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link 
              to={`/settings/${investment.id}`}
              className="h-10 w-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-green-50 border border-transparent hover:border-primary/20 transition-all" title="Configurações"
            >
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <button 
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="h-10 w-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all" 
              title="Excluir Investimento"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gray-50">
        <div 
          className="h-full bg-primary rounded-r-full transition-all duration-500" 
          style={{ width: `${Math.min(100, isNaN(returnPercentage) ? 0 : returnPercentage * 10)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Dashboard;
