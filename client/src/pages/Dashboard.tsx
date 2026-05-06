import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/dashboard/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!metrics) return <div>Failed to load metrics.</div>;

  const taskData = [
    { name: 'Completed', value: metrics.maintenance.completed, color: '#10b981' },
    { name: 'Pending', value: metrics.maintenance.pending, color: '#f59e0b' },
  ];

  const drillData = [
    { name: 'Completed', value: metrics.drills.completed, color: '#10b981' },
    { name: 'Missed', value: metrics.drills.missed, color: '#ef4444' },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Compliance Overview</h1>
          <p className="text-slate-500">Real-time safety and maintenance metrics</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="text-slate-500 text-sm">Overall Compliance</div>
          <div className={`text-2xl font-bold ${metrics.compliance.overall >= 80 ? 'text-green-600' : 'text-orange-500'}`}>
            {metrics.compliance.overall.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Tasks Overdue</h3>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{metrics.maintenance.overdue}</p>
          <p className="text-sm text-slate-500 mt-1">Requires immediate attention</p>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Tasks Pending</h3>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{metrics.maintenance.pending}</p>
          <p className="text-sm text-slate-500 mt-1">Scheduled for upcoming days</p>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Drills Completed</h3>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{metrics.drills.completed}</p>
          <p className="text-sm text-slate-500 mt-1">Out of {metrics.drills.total} total drills</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-slate-700 mb-6">Maintenance Task Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-semibold text-slate-700 mb-6">Safety Drill Participation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={drillData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {drillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
