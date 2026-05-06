import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { Plus, CheckCircle, XCircle, X } from 'lucide-react';

const Drills = () => {
  const { user } = useContext(AuthContext);
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ships, setShips] = useState([]);
  const [newDrill, setNewDrill] = useState({
    title: '',
    description: '',
    shipId: '',
    scheduledDate: '',
  });

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterShip, setFilterShip] = useState('All');

  const fetchDrills = async () => {
    try {
      const res = await api.get('/drills');
      setDrills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const shipsRes = await api.get('/ships');
      setShips(shipsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDrills();
    fetchDependencies();
  }, [user.role]);

  const markAttendance = async (id) => {
    try {
      await api.post(`/drills/${id}/attendance`, { userId: user._id });
      fetchDrills();
    } catch (err) {
      console.error(err);
    }
  };

  const updateDrillStatus = async (id, status) => {
    try {
      await api.put(`/drills/${id}`, { status, completedDate: status === 'Completed' ? new Date() : null });
      fetchDrills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleDrill = async (e) => {
    e.preventDefault();
    try {
      await api.post('/drills', newDrill);
      setIsModalOpen(false);
      setNewDrill({ title: '', description: '', shipId: '', scheduledDate: '' });
      fetchDrills();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading drills...</div>;

  return (
    <div className="fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Safety Drills</h1>
          <p className="text-slate-500">Schedule drills and track crew participation</p>
        </div>
        {user.role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-marine-600 hover:bg-marine-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">
            <Plus size={18} className="mr-2" /> Schedule Drill
          </button>
        )}
      </div>

      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full text-sm border-slate-200 rounded-lg outline-none focus:border-marine-500 focus:ring-1 focus:ring-marine-500">
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
            <option value="Missed">Missed</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Ship</label>
          <select value={filterShip} onChange={e => setFilterShip(e.target.value)} className="w-full text-sm border-slate-200 rounded-lg outline-none focus:border-marine-500 focus:ring-1 focus:ring-marine-500">
            <option value="All">All Ships</option>
            {ships.map((ship: any) => <option key={ship._id} value={ship._id}>{ship.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(() => {
          let displayDrills = drills.filter((drill: any) => {
            const isOverdue = new Date(drill.scheduledDate) < new Date() && drill.status !== 'Completed';
            const computedStatus = isOverdue && drill.status !== 'Missed' ? 'Overdue' : drill.status;
            
            if (filterStatus !== 'All' && computedStatus !== filterStatus) return false;
            if (filterShip !== 'All' && drill.shipId?._id !== filterShip) return false;
            return true;
          });

          if (displayDrills.length === 0) return <div className="col-span-full p-8 text-center text-slate-500 glass-panel">No drills found.</div>;

          return displayDrills.map((drill: any) => {
            const isAttended = drill.attendance.some((a: any) => a._id === user._id || a === user._id);
            const isOverdue = new Date(drill.scheduledDate) < new Date() && drill.status !== 'Completed';

          return (
            <div key={drill._id} className="glass-panel p-6 flex flex-col h-full relative overflow-hidden">
              {isOverdue && <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>}
              {drill.status === 'Completed' && <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>}
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-slate-800">{drill.title}</h3>
                {user.role === 'Admin' ? (
                  <select 
                    value={drill.status} 
                    onChange={(e) => updateDrillStatus(drill._id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-medium outline-none border ${
                      drill.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                      isOverdue ? 'bg-red-100 text-red-700 border-red-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Missed">Missed</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    drill.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    isOverdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isOverdue && drill.status !== 'Missed' ? 'Overdue' : drill.status}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-slate-600 mb-4 flex-grow">{drill.description}</p>
              
              <div className="space-y-2 text-sm text-slate-500 mb-6">
                <div className="flex justify-between">
                  <span>Ship:</span>
                  <span className="font-medium text-slate-700">{drill.shipId?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduled:</span>
                  <span className="font-medium text-slate-700">{format(new Date(drill.scheduledDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants:</span>
                  <span className="font-medium text-slate-700">{drill.attendance.length} Crew Members</span>
                </div>
              </div>

              {user.role === 'Crew' && drill.status !== 'Completed' && !isOverdue && (
                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => markAttendance(drill._id)}
                    disabled={isAttended}
                    className={`w-full py-2 rounded-lg font-medium flex items-center justify-center transition-colors ${
                      isAttended 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-marine-50 text-marine-600 hover:bg-marine-100'
                    }`}
                  >
                    {isAttended ? <><CheckCircle size={16} className="mr-2" /> Attendance Marked</> : 'Mark Attendance'}
                  </button>
                  <button 
                    onClick={() => updateDrillStatus(drill._id, 'Completed')}
                    className="w-full py-2 rounded-lg font-medium flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          );
        });
      })()}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Schedule Safety Drill</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleScheduleDrill} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Drill Title</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none"
                  value={newDrill.title}
                  onChange={e => setNewDrill({...newDrill, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  required 
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none"
                  value={newDrill.description}
                  onChange={e => setNewDrill({...newDrill, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ship</label>
                <select 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none"
                  value={newDrill.shipId}
                  onChange={e => setNewDrill({...newDrill, shipId: e.target.value})}
                >
                  <option value="">Select a ship</option>
                  {ships.map(ship => (
                    <option key={ship._id} value={ship._id}>{ship.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Scheduled Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-marine-500 focus:border-marine-500 outline-none"
                  value={newDrill.scheduledDate}
                  onChange={e => setNewDrill({...newDrill, scheduledDate: e.target.value})}
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
                  Schedule Drill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drills;
