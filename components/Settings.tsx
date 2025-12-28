
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Investment, TaxBracket } from '../types';
import { formatCurrency } from '../services/investmentCalculator';

interface SettingsProps {
  investments: Investment[];
  onSave: (updates: Investment) => void;
}

const Settings: React.FC<SettingsProps> = ({ investments, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const investment = investments.find(inv => inv.id === id);

  const [formData, setFormData] = useState<Investment | null>(investment ? { ...investment } : null);

  const formatCurrencyDisplay = (value: number): string => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const [displayValue, setDisplayValue] = useState(
    investment ? formatCurrencyDisplay(investment.initialValue) : '0,00'
  );

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = parseFloat(rawValue) / 100;
    setFormData(prev => prev ? { ...prev, initialValue: numericValue } : prev);
    setDisplayValue(formatCurrencyDisplay(numericValue));
  };


  if (!formData) return <div className="p-8 text-center">Investimento não encontrado.</div>;

  const handleSave = () => {
    onSave(formData);
    navigate(`/investment/${id}`);
  };

  const updateTaxBracket = (bracketId: string, updates: Partial<TaxBracket>) => {
    setFormData({
      ...formData,
      taxBrackets: formData.taxBrackets.map(b => b.id === bracketId ? { ...b, ...updates } : b)
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Configurações do Investimento</h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold uppercase rounded-full">Edição</span>
        </div>
        <p className="text-text-muted text-base max-w-3xl">
          Ajuste os parâmetros principais do seu CDB, incluindo valor inicial e características do produto bancário.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Main Parameters */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
              <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 text-primary border-b border-gray-100 pb-2">
                <span className="material-symbols-outlined">monetization_on</span>
                <h3 className="font-bold text-lg text-gray-800">Parâmetros Iniciais</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Valor a ser investido</label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium group-focus-within:text-primary transition-colors">R$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={displayValue}
                      onChange={handleValueChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-bold text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Data de Início</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CDB Details */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 relative">
            <div className="flex items-center gap-2 mb-6 text-primary border-b border-gray-100 pb-2">
              <span className="material-symbols-outlined">description</span>
              <h3 className="font-bold text-lg text-gray-800">Detalhes do CDB</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nome do Produto</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Percentual do CDI</label>
                <div className="relative group">
                  <input
                    type="number"
                    value={formData.cdiPercentage}
                    onChange={(e) => setFormData({ ...formData, cdiPercentage: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold group-focus-within:text-primary transition-colors">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Liquidez</label>
                <select
                  value={formData.liquidity}
                  onChange={(e) => setFormData({ ...formData, liquidity: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="diaria">Diária (D+0)</option>
                  <option value="d_plus_1">D+1</option>
                  <option value="vencimento">No Vencimento</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between p-4 border border-green-200 bg-green-50/40 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg text-green-700 border border-green-200">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">Garantia FGC</span>
                  <span className="text-xs text-green-700 font-medium">Cobertura até R$ 250 mil</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.fgcGuarantee}
                  onChange={(e) => setFormData({ ...formData, fgcGuarantee: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Status do Investimento</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="active">Ativo</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Observações</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Ex: Banco XP, Liquidez Diária..."
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-24 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-gray-700 border-b border-gray-100 pb-2">
              <span className="material-symbols-outlined">table_chart</span>
              <h3 className="font-bold text-lg text-gray-800">Tabela Regressiva IR</h3>
            </div>
            <div className="space-y-4">
              {formData.taxBrackets.map((bracket, i) => {
                const colors = ['red', 'orange', 'amber', 'green'][i] || 'gray';
                return (
                  <div key={bracket.id} className={`group relative flex items-center p-3 border border-gray-200 rounded-lg bg-${colors}-50/20 hover:border-${colors}-300 transition-all`}>
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${colors}-500 rounded-l-lg`}></div>
                    <div className="flex-1 grid grid-cols-12 gap-3 items-center ml-2">
                      <div className="col-span-8">
                        <input
                          type="text"
                          value={bracket.label}
                          onChange={(e) => updateTaxBracket(bracket.id, { label: e.target.value })}
                          className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-900 focus:ring-0"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="number"
                          step="0.1"
                          value={bracket.rate}
                          onChange={(e) => updateTaxBracket(bracket.id, { rate: parseFloat(e.target.value) || 0 })}
                          className={`w-full text-right bg-white border border-gray-200 rounded px-2 py-1.5 text-sm font-bold text-${colors}-600 focus:ring-1 focus:ring-${colors}-500 shadow-sm`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4 pt-6 border-t border-gray-200">
        <Link to={`/investment/${id}`} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancelar</Link>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-green-900/10 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default Settings;
