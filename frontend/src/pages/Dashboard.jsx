import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, LayoutList } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, delay, gradient }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-xl border-2 border-slate-600/40 hover:border-slate-500/60 transition-all duration-300 group relative overflow-hidden hover:shadow-2xl`}>
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
        <h3 className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${colorClass} shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
        <Icon size={28} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalTasks: 0, todoTasks: 0, inProgressTasks: 0, doneTasks: 0, overdueTasks: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's an overview of your tasks.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={LayoutList} colorClass="bg-cyan-500/20 text-cyan-400" gradient="from-cyan-900/30 to-blue-900/20" delay={0.1} />
        <StatCard title="In Progress" value={stats.inProgressTasks} icon={Clock} colorClass="bg-purple-500/20 text-purple-400" gradient="from-purple-900/30 to-indigo-900/20" delay={0.2} />
        <StatCard title="Completed" value={stats.doneTasks} icon={CheckCircle2} colorClass="bg-emerald-500/20 text-emerald-400" gradient="from-emerald-900/30 to-teal-900/20" delay={0.3} />
        <StatCard title="Overdue" value={stats.overdueTasks} icon={AlertCircle} colorClass="bg-amber-500/20 text-amber-400" gradient="from-amber-900/30 to-orange-900/20" delay={0.4} />
      </div>
    </div>
  );
};
export default Dashboard;
