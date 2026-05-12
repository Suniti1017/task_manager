import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-lg border-b border-cyan-500/40 p-4 sticky top-0 z-50 shadow-2xl shadow-cyan-500/20">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/40 font-bold">
             TM
          </div>
          TaskFlow
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-slate-300 hover:text-cyan-400 transition flex items-center gap-2"><LayoutDashboard size={18}/> Dashboard</Link>
          <Link to="/projects" className="text-slate-300 hover:text-purple-400 transition flex items-center gap-2"><FolderKanban size={18}/> Projects</Link>
          <Link to="/tasks" className="text-slate-300 hover:text-pink-400 transition flex items-center gap-2"><CheckSquare size={18}/> Tasks</Link>
          <button onClick={handleLogout} className="ml-4 text-amber-400 hover:text-amber-300 transition flex items-center gap-2">
            <LogOut size={18}/> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
