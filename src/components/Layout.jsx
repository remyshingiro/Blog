import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, Wrench, ArrowLeftRight, 
  Settings as SettingsIcon, ClipboardList, Bell, UserCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  // Upgraded active link styling for a premium feel
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* MOBILE TOP BAR (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-4 z-40 border-b border-slate-800 shadow-sm">
        <h1 className="text-xl font-extrabold text-white tracking-tight">
          Garage<span className="text-blue-500">Flow</span>
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white transition-colors">
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* SIDEBAR (Drawer on mobile, pinned on desktop) */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-slate-900 w-72 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-2xl md:shadow-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800/60">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Garage<span className="text-blue-500">Flow</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
          
          {user.role === 'MANAGER' && (
            <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </NavLink>
          )}

          <NavLink to="/inventory" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
            <Wrench size={20} />
            <span className="font-medium">Inventory</span>
          </NavLink>
          
          <NavLink to="/requests" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
            <ClipboardList size={20} />
            <span className="font-medium">Approvals</span>
          </NavLink>

          <NavLink to="/transactions" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
            <ArrowLeftRight size={20} />
            <span className="font-medium">Transactions</span>
          </NavLink>

          {user.role === 'MANAGER' && (
            <>
              <div className="pt-6 pb-2">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</p>
              </div>
              <NavLink to="/settings" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
                <SettingsIcon size={20} />
                <span className="font-medium">System Settings</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Sidebar User Footer */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-900/50">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
            <UserCircle size={36} className="text-slate-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY (Closes sidebar when clicking outside) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* DESKTOP TOP HEADER */}
        <header className="hidden md:flex h-20 bg-white border-b border-slate-200 items-center justify-between px-8 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Welcome back, {user.name.split(' ')[0]}</h2>
            <p className="text-sm text-slate-500">Here is what's happening in your garage today.</p>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* Header Profile */}
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 border-2 border-white shadow-sm font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8 mt-16 md:mt-0">
          {/* Max-width container prevents extreme stretching on large monitors */}
          <div className="max-w-7xl mx-auto w-full pb-12">
            <Outlet /> 
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default Layout;