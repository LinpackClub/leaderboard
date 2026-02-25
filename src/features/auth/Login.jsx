import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import SEO from '../../components/seo/SEO';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (login(username, password)) {
            navigate('/admin');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <SEO title="Admin Login | VITB GOT LATENT" description="Secure admin login for VITB GOT LATENT leaderboard management." image="/og-admin.png" />


            <div className="glass-panel w-full max-w-md p-8 rounded-2xl border border-border shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-text-main">Admin Access</h1>
                    <p className="text-text-muted">Please enter your credentials</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-bg-card-hover border border-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-bg-card-hover border border-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter password"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full btn btn-primary py-3 rounded-lg font-semibold shadow-lg shadow-primary/20"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
