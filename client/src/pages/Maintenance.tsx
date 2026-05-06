import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { Plus, Check, Clock, AlertCircle, X } from 'lucide-react';

const Maintenance = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteTaskId, setNoteTaskId] = useState(null);
  const [taskNote, setTaskNote] = useState('');
  const [ships, setShips] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    shipId: '',
    assignedTo: '',
    dueDate: '',
  });

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterShip, setFilterShip] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/maintenance');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [shipsRes, usersRes] = await Promise.all([
        api.get('/ships'),
        api.get('/auth/users')
      ]);
      setShips(shipsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDependencies();
  }, [user.role]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/maintenance/${id}`, { status, completedDate: status === 'Completed' ? new Date() : null });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      if (editTaskId) {
        await api.put(`/maintenance/${editTaskId}`, newTask);
      } else {
        await api.post('/maintenance', newTask);
      }
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', shipId: '', assignedTo: '', dueDate: '' });
      setEditTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const openNewTaskModal = () => {
    setEditTaskId(null);
    setNewTask({ title: '', description: '', shipId: '', assignedTo: '', dueDate: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditTaskId(task._id);
    setNewTask({
      title: task.title,
      description: task.description,
      shipId: task.shipId?._id || '',
      assignedTo: task.assignedTo?._id || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/maintenance/${noteTaskId}`, { notes: taskNote });
      setNoteModalOpen(false);
      setNoteTaskId(null);
      setTaskNote('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const openNoteModal = (task) => {
    setNoteTaskId(task._id);
    setTaskNote(task.notes || '');
    setNoteModalOpen(true);
  };

  const getStatusBadge = (status, dueDate) => {
    const isOverdue = new Date(dueDate) < new Date() && status !== 'Completed';
    
    if (isOverdue) return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center w-max"><AlertCircle size={12} className="mr-1" /> Overdue</span>;
    if (status === 'Completed') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center w-max"><Check size={12} className="mr-1" /> Completed</span>;
    if (status === 'In Progress') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center w-max"><Clock size={12} className="mr-1" /> In Progress</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 w-max">Pending</span>;
  };

  if (loading) return <div>Loading tasks...</div>;

  let displayTasks = user.role === 'Admin' ? tasks : tasks.filter((t: any) => t.assignedTo?._id === user._id);

  displayTasks = displayTasks.filter((task: any) => {
    if (filterStatus !== 'All' && task.status !== filterStatus) return false;
    if (filterShip !== 'All' && task.shipId?._id !== filterShip) return false;
    if (filterDate && new Date(task.dueDate).toISOString().split('T')[0] !== filterDate) return false;
    return true;
  });

  return (
    <div className="fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance Tasks</h1>
          <p className="text-slate-500">Manage and track ship maintenance activities</p>
        </div>
        {user.role === 'Admin' && (
          <button 
            onClick={openNewTaskModal}
            className="bg-marine-600 hover:bg-marine-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">
            <Plus size={18} className="mr-2" /> New Task
          </button>
        )}
      </div>

      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full text-sm border-slate-200 rounded-lg outline-none focus:border-marine-500 focus:ring-1 focus:ring-marine-500">
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Ship</label>
          <select value={filterShip} onChange={e => setFilterShip(e.target.value)} className="w-full text-sm border-slate-200 rounded-lg outline-none focus:border-marine-500 focus:ring-1 focus:ring-marine-500">
            <option value="All">All Ships</option>
            {ships.map((ship: any) => <option key={ship._id} value={ship._id}>{ship.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Due Date</label>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-full text-sm border-slate-200 rounded-lg outline-none focus:border-marine-500 focus:ring-1 focus:ring-marine-500" />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold text-sm text-slate-600">Task Name</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-600">Ship</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-600">Due Date</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayTasks.map(task => (
                <tr key={task._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{task.title}</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs">{task.description}</p>
                    {task.notes && (
                      <p className="text-xs text-slate-600 mt-2 bg-yellow-50 p-2 rounded border border-yellow-100">
                        <strong>Note:</strong> {task.notes}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{task.shipId?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{format(new Date(task.dueDate), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4">
                    {user.role === 'Admin' ? (
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(task.status, task.dueDate)}
                        <select 
                          value={task.status} 
                          onChange={(e) => updateStatus(task._id, e.target.value)}
                          className="text-xs font-medium border border-slate-300 rounded p-1 outline-none bg-white text-slate-600"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    ) : (
                      getStatusBadge(task.status, task.dueDate)
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role === 'Crew' && (
                      <div className="flex justify-end space-x-3 items-center">
                        {task.status !== 'Completed' && (
                          <>
                            {task.status === 'Pending' && (
                              <button onClick={() => updateStatus(task._id, 'In Progress')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Start</button>
                            )}
                            {task.status === 'In Progress' && (
                              <button onClick={() => updateStatus(task._id, 'Completed')} className="text-green-600 hover:text-green-800 text-sm font-medium">Complete</button>
                            )}
                          </>
                        )}
                        <button onClick={() => openNoteModal(task)} className="text-slate-600 hover:text-slate-800 text-sm font-medium">
                          {task.notes ? 'Edit Note' : 'Add Note'}
                        </button>
                      </div>
                    )}
                    {user.role === 'Admin' && (
                      <button onClick={() => openEditModal(task)} className="text-marine-600 hover:text-marine-800 text-sm font-medium">Edit</button>
                    )}
                  </td>
                </tr>
              ))}
              {displayTasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">{editTaskId ? 'Edit Task' : 'Create New Task'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  required 
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none"
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ship</label>
                <select 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none"
                  value={newTask.shipId}
                  onChange={e => setNewTask({...newTask, shipId: e.target.value})}
                >
                  <option value="">Select a ship</option>
                  {ships.map(ship => (
                    <option key={ship._id} value={ship._id}>{ship.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                <select 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none"
                  value={newTask.assignedTo}
                  onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  <option value="">Select crew member</option>
                  {users.filter(u => u.role === 'Crew').map(user => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none"
                  value={newTask.dueDate}
                  onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-marine-600 text-white rounded-lg hover:bg-marine-700 transition-colors shadow-sm"
                >
                  {editTaskId ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {noteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Task Notes</h2>
              <button onClick={() => setNoteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveNote} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Add your note below</label>
                <textarea 
                  required 
                  rows="4"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none"
                  value={taskNote}
                  onChange={e => setTaskNote(e.target.value)}
                  placeholder="Enter details about the task execution, any issues found, or parts used..."
                ></textarea>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setNoteModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-marine-600 text-white rounded-lg hover:bg-marine-700 transition-colors shadow-sm"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
