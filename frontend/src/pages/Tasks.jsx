import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Clock, Calendar, CheckCircle2, Circle } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'MEDIUM', projectId: '', assignedToId: '' });
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/tasks`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/projects`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users`, { headers })
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
      const ownedProjects = projectsRes.data.filter(p => p.createdBy && p.createdBy.id === user.id);
      if(ownedProjects.length > 0) setNewTask(p => ({...p, projectId: ownedProjects[0].id}));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newTask };
      if (payload.assignedToId === '') payload.assignedToId = null;
      if (payload.projectId === '') payload.projectId = null;
      
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/tasks`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/tasks/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'MEDIUM': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'LOW': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-slate-400">Manage your daily tasks and workflow.</p>
        </div>
        {projects.some(p => p.createdBy && p.createdBy.id === user.id) && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-pink-500/30">
            <Plus size={20} /> New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
          <div key={status} className="bg-gradient-to-br from-slate-800/30 to-slate-800/10 border border-slate-700/50 hover:border-slate-600/50 rounded-2xl p-4 min-h-[500px] transition">
            <h2 className="text-lg font-bold text-white mb-4 capitalize flex items-center gap-2">
              {status === 'TODO' && <Circle className="text-slate-400" size={18}/>}
              {status === 'IN_PROGRESS' && <Clock className="text-cyan-400" size={18}/>}
              {status === 'DONE' && <CheckCircle2 className="text-emerald-400" size={18}/>}
              {status.replace('_', ' ')}
            </h2>
            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map((task, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={task.id} className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 p-4 rounded-xl transition group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    <select value={task.status} onChange={(e) => handleStatusUpdate(task.id, e.target.value)} className="bg-slate-900/50 border border-slate-700/50 rounded text-xs text-slate-300 p-1 opacity-0 group-hover:opacity-100 transition focus:outline-none">
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{task.title}</h3>
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center gap-1"><Calendar size={14} /> {task.dueDate || 'No date'}</div>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-2 py-1 rounded-full text-slate-300 truncate max-w-[100px]">{task.assignedTo?.name || 'Unassigned'}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/40 p-6 rounded-2xl border border-pink-500/30 shadow-2xl shadow-pink-500/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">Create New Task</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="block text-sm text-slate-300 mb-1">Title</label><input type="text" value={newTask.title} onChange={e=>setNewTask({...newTask, title: e.target.value})} className="w-full p-2.5 bg-slate-900/50 border border-slate-700/50 focus:border-pink-500/50 rounded-lg text-white focus:ring-2 focus:ring-pink-500/30 focus:outline-none" required /></div>
              <div><label className="block text-sm text-slate-300 mb-1">Description</label><textarea value={newTask.description} onChange={e=>setNewTask({...newTask, description: e.target.value})} className="w-full p-2.5 bg-slate-900/50 border border-slate-700/50 focus:border-pink-500/50 rounded-lg text-white focus:ring-2 focus:ring-pink-500/30 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-slate-300 mb-1">Due Date</label><input type="date" value={newTask.dueDate} onChange={e=>setNewTask({...newTask, dueDate: e.target.value})} className="w-full p-2.5 bg-slate-900/50 border border-slate-700/50 focus:border-pink-500/50 rounded-lg text-white focus:ring-2 focus:ring-pink-500/30 focus:outline-none" required /></div>
                <div><label className="block text-sm text-slate-300 mb-1">Priority</label>
                  <select value={newTask.priority} onChange={e=>setNewTask({...newTask, priority: e.target.value})} className="w-full p-2.5 bg-slate-900/50 border border-slate-700/50 focus:border-pink-500/50 rounded-lg text-white focus:ring-2 focus:ring-pink-500/30 focus:outline-none">
                    <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-sm text-slate-300 mb-1">Project</label>
                <select value={newTask.projectId} onChange={e=>setNewTask({...newTask, projectId: e.target.value})} className="w-full p-2.5 bg-slate-900/50 border border-slate-700/50 focus:border-pink-500/50 rounded-lg text-white focus:ring-2 focus:ring-pink-500/30 focus:outline-none" required>
                  {projects.filter(p => p.createdBy && p.createdBy.id === user.id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div><label className="block text-sm text-slate-300 mb-1">Assignee</label>
                <select value={newTask.assignedToId} onChange={e=>setNewTask({...newTask, assignedToId: e.target.value})} className="w-full p-2.5 bg-slate-900/50 border border-slate-700/50 focus:border-pink-500/50 rounded-lg text-white focus:ring-2 focus:ring-pink-500/30 focus:outline-none">
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-lg transition shadow-lg shadow-pink-500/30">Create Task</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default Tasks;
