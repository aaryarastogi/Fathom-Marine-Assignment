import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PenTool, ShieldAlert, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <PenTool size={20} /> },
    { name: 'Safety Drills', path: '/drills', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-marine-950 text-white flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-marine-400">Fathom<span className="text-white">Marine</span></h1>
        <p className="text-xs text-marine-300 mt-1">Assignment Dashboard</p>
      </div>

      <nav className="flex-1 mt-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-marine-800 text-white' : 'text-marine-300 hover:bg-marine-800/50 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-marine-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-marine-700 flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-marine-400">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="text-marine-400 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
