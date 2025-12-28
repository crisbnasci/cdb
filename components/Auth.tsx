
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface AuthProps {
    onSessionChange: (session: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onSessionChange }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { data, error } = isSignUp
            ? await supabase.auth.signUp({ email, password })
            : await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else if (isSignUp && !data.session) {
            setMessage({ type: 'success', text: 'Verifique seu email para confirmar o cadastro!' });
        } else {
            onSessionChange(data.session);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center text-primary mb-4">
                        <span className="material-symbols-outlined text-4xl">table_view</span>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        {isSignUp ? 'Criar sua conta' : 'Acessar CDB Sheets'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isSignUp ? 'Junte-se a nós para gerenciar seus ativos' : 'Bem-vindo de volta! Faça login para continuar'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                    {message && (
                        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">E-mail</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">mail</span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Senha</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">lock</span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl shadow-lg shadow-green-900/10 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                    >
                        {loading ? 'Carregando...' : (isSignUp ? 'Cadastrar Agora' : 'Entrar no Dashboard')}
                        {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm font-bold text-primary hover:text-primary-dark transition-colors"
                        >
                            {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem conta? Crie uma agora'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;
