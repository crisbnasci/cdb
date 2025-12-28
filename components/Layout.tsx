
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-surface-white border-b border-border-light sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-green-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">table_view</span>
                </div>
                <h1 className="text-text-main text-lg font-bold tracking-tight">CDB Sheets</h1>
              </Link>

              <div className="hidden sm:flex items-center gap-2 ml-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-500 transition-all shadow-sm group"
                  title="Voltar"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-500 transition-all shadow-sm group"
                  title="Avançar"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-xs font-medium text-gray-400 italic">Controle de Investimentos Pessoais</span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 h-9 px-3 bg-red-50 text-red-600 border border-red-100/50 hover:bg-red-100 transition-colors rounded-lg text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sair
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
