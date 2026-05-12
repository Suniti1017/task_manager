import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/signup`, { name, email, password });
      navigate('/login');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md p-8 relative z-10 backdrop-blur-xl bg-slate-800/40 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/10">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required className="w-full p-3 bg-slate-900/50 border border-slate-700/50 focus:border-purple-500/50 rounded-lg focus:ring-2 focus:ring-purple-500/30 focus:outline-none text-white transition" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full p-3 bg-slate-900/50 border border-slate-700/50 focus:border-purple-500/50 rounded-lg focus:ring-2 focus:ring-purple-500/30 focus:outline-none text-white transition" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full p-3 bg-slate-900/50 border border-slate-700/50 focus:border-purple-500/50 rounded-lg focus:ring-2 focus:ring-purple-500/30 focus:outline-none text-white transition" placeholder="********" />
          </div>
          <button type="submit" className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium shadow-lg shadow-purple-500/30 transition duration-200 transform hover:-translate-y-0.5">
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};
export default Signup;
