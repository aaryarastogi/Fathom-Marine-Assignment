import React, { useContext } from 'react';
import { Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="md:hidden mr-4 text-slate-500 hover:text-slate-700">
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold text-slate-800">
            Welcome back, {user?.name}
          </h2>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
