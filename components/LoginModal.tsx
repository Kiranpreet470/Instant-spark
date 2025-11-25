import React, { useState } from 'react';
import { X, Lock, User as UserIcon, Zap } from 'lucide-react';

interface LoginModalProps {
  onLogin: (username: string, pass: string) => boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-zinc-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-8">
           <div className="bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-3 rounded-full mb-4">
              <Zap className="text-white fill-white" size={32} />
           </div>
           <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
           <p className="text-gray-400">Switch account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Username / ID</label>
            <div className="relative">
              <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter Password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Admin Access: ID <span className="text-gray-300">admin</span> / Pass <span className="text-gray-300">password123</span></p>
          <p className="mt-1">User Access: ID <span className="text-gray-300">spark_creator</span> / Pass <span className="text-gray-300">any</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;