import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Users, FolderOpen, Edit, UserPlus } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState({ id: null, name: '', description: '' });
  const [selectedUser, setSelectedUser] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user'));

  const projectColors = [
    { bg: 'from-cyan-900/40 to-blue-900/40', border: 'border-cyan-500/40 hover:border-cyan-400/60', icon: 'bg-cyan-500/20 text-cyan-400', accent: 'text-cyan-400', glow: 'shadow-glow-cyan', gradient: 'from-cyan-500 to-blue-500', button: 'from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400' },
    { bg: 'from-purple-900/40 to-pink-900/40', border: 'border-purple-500/40 hover:border-purple-400/60', icon: 'bg-purple-500/20 text-purple-400', accent: 'text-purple-400', glow: 'shadow-glow-purple', gradient: 'from-purple-500 to-pink-500', button: 'from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400' },
    { bg: 'from-rose-900/40 to-pink-900/40', border: 'border-rose-500/40 hover:border-rose-400/60', icon: 'bg-rose-500/20 text-rose-400', accent: 'text-rose-400', glow: 'shadow-glow-rose', gradient: 'from-rose-500 to-pink-500', button: 'from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400' },
    { bg: 'from-indigo-900/40 to-purple-900/40', border: 'border-indigo-500/40 hover:border-indigo-400/60', icon: 'bg-indigo-500/20 text-indigo-400', accent: 'text-indigo-400', glow: 'shadow-glow-indigo', gradient: 'from-indigo-500 to-purple-500', button: 'from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400' },
    { bg: 'from-emerald-900/40 to-teal-900/40', border: 'border-emerald-500/40 hover:border-emerald-400/60', icon: 'bg-emerald-500/20 text-emerald-400', accent: 'text-emerald-400', glow: 'shadow-glow-cyan', gradient: 'from-emerald-500 to-teal-500', button: 'from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400' },
    { bg: 'from-amber-900/40 to-orange-900/40', border: 'border-amber-500/40 hover:border-amber-400/60', icon: 'bg-amber-500/20 text-amber-400', accent: 'text-amber-400', glow: 'shadow-glow-pink', gradient: 'from-amber-500 to-orange-500', button: 'from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400' },
  ];

  const getProjectColor = (index) => projectColors[index % projectColors.length];

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [projRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/projects`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users`, { headers })
      ]);
      setProjects(projRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/projects/${currentProject.id}`, currentProject, { headers });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/projects`, currentProject, { headers });
      }
      setShowModal(false);
      setCurrentProject({ id: null, name: '', description: '' });
      fetchData();
    } catch (err) {
      alert("Failed to save project");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/projects/${currentProject.id}/members/${selectedUser}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowMemberModal(false);
      setSelectedUser('');
      fetchData();
    } catch (err) {
      alert("Failed to add member. You might not have permission.");
    }
  };

  const openEditModal = (project) => {
    setCurrentProject({ id: project.id, name: project.name, description: project.description });
    setIsEditing(true);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setCurrentProject({ id: null, name: '', description: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const openMemberModal = (project) => {
    setCurrentProject(project);
    setShowMemberModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage and view your team projects.</p>
        </div>
        {(user.role === 'ADMIN' || true) && (
          <button onClick={openCreateModal} className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-cyan-500/30">
            <Plus size={20} /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => {
          const isAdminOrCreator = user.role === 'ADMIN' || (p.createdBy && p.createdBy.id === user.id);
          const colors = getProjectColor(i);
          return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={p.id} 
              className={`bg-gradient-to-br ${colors.bg} backdrop-blur-xl border-2 ${colors.border} p-6 rounded-2xl transition-all duration-300 group flex flex-col justify-between hover:shadow-xl relative overflow-hidden`}
            >
              {/* Glow background */}
              <div className={`absolute inset-0 ${colors.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 ${colors.icon} rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <FolderOpen size={28} />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${colors.gradient} text-white`}>#{p.id}</span>
                </div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-3`}>{p.name}</h3>
                <p className="text-slate-300 text-sm mb-6 line-clamp-3 leading-relaxed font-light">{p.description}</p>
              </div>
              
              <div className="relative z-10 flex items-center justify-between border-t border-slate-600/30 pt-4 mt-auto">
                <div className={`flex items-center gap-2 text-sm font-semibold ${colors.accent}`}>
                  <Users size={16} />
                  <span>{p.members?.length || 0} Members</span>
                </div>
                {isAdminOrCreator && (
                  <div className="flex gap-2">
                    <button onClick={() => openMemberModal(p)} className={`p-2.5 ${colors.icon} rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg`} title="Add Member">
                      <UserPlus size={18} />
                    </button>
                    <button onClick={() => openEditModal(p)} className={`p-2.5 bg-slate-700/40 text-slate-300 hover:text-white hover:bg-slate-600/60 rounded-lg transition-all duration-200 hover:scale-110`} title="Edit Project">
                      <Edit size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/40 p-6 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 w-full max-w-md">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                <input type="text" value={currentProject.name} onChange={e=>setCurrentProject({...currentProject, name: e.target.value})} className="w-full p-3 bg-slate-900/50 border border-slate-700/50 focus:border-cyan-500/50 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/30 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea value={currentProject.description} onChange={e=>setCurrentProject({...currentProject, description: e.target.value})} className="w-full p-3 bg-slate-900/50 border border-slate-700/50 focus:border-cyan-500/50 rounded-lg text-white h-24 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none" required />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg transition shadow-lg shadow-cyan-500/30">{isEditing ? 'Save Changes' : 'Create Project'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/40 p-6 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-2">Add Member</h2>
            <p className="text-slate-400 text-sm mb-6">Select a user to add to {currentProject.name}</p>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Select User</label>
                <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)} className="w-full p-3 bg-slate-900/50 border border-slate-700/50 focus:border-purple-500/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500/30 focus:outline-none" required>
                  <option value="" disabled>Choose a user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowMemberModal(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-lg transition shadow-lg shadow-purple-500/30">Add to Project</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default Projects;
