import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Ship } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Crew');
  
  const { login, signup } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(name, email, password, role);
      }
      navigate('/');
    } catch (err: any) {
      setError(err || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full glass-panel p-8 fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-marine-600 rounded-full flex items-center justify-center text-white mb-4">
            <Ship size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Fathom Marine</h2>
          <p className="text-slate-500 mt-2">{isLoginMode ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none transition-all"
              placeholder="user@fathom.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <div className="flex space-x-4">
                <label className={`flex-1 flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${role === 'Crew' ? 'border-marine-500 bg-marine-50 text-marine-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                  <input type="radio" name="role" value="Crew" className="hidden" checked={role === 'Crew'} onChange={() => setRole('Crew')} />
                  Crew Member
                </label>
                <label className={`flex-1 flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${role === 'Admin' ? 'border-marine-500 bg-marine-50 text-marine-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                  <input type="radio" name="role" value="Admin" className="hidden" checked={role === 'Admin'} onChange={() => setRole('Admin')} />
                  Admin
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-marine-600 text-white font-medium py-3 rounded-lg hover:bg-marine-700 transition-colors mt-6 flex justify-center items-center"
          >
            {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
            className="text-marine-600 hover:text-marine-800 text-sm font-medium transition-colors"
          >
            {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
