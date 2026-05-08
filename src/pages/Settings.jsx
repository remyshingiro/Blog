import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Shield, Building, Users, UserPlus, X, Trash2 } from 'lucide-react';
import { mockUsers } from '../data/mockData';

const Settings = () => {
  const { user, switchRole } = useAuth();
  
  // State for managing our staff list and the "Add Staff" modal
  const [staffList, setStaffList] = useState(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'MECHANIC' });

  // Handle adding a new staff member to the table
  const handleAddStaff = (e) => {
    e.preventDefault();
    const newMember = {
      ...newStaff,
      id: `u${Date.now()}`, // Temporary ID generator
      status: 'Active'
    };
    
    setStaffList([...staffList, newMember]);
    setNewStaff({ name: '', email: '', role: 'MECHANIC' }); // Reset form
    setIsModalOpen(false); // Close modal
  };

  // Handle removing a staff member (just for the UI mockup)
  const handleRemoveStaff = (id) => {
    setStaffList(staffList.filter(staff => staff.id !== id));
  };

  return (
    <div className="max-w-5xl space-y-6 relative">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage garage preferences and user access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Profile and Garage Details */}
        <div className="space-y-6 lg:col-span-1">
          {/* User Profile & Role Switcher */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <UserCircle size={32} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{user.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Shield size={14} className={user.role === 'MANAGER' ? 'text-purple-500' : 'text-slate-400'} />
                  <span className="text-sm font-medium text-slate-500">{user.role}</span>
                </div>
              </div>
            </div>
            
            {/* Development Testing Tools */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase mb-3 text-center">Dev Test: Switch Role</p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => switchRole('MANAGER')}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition ${user.role === 'MANAGER' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  Log in as Manager
                </button>
                <button 
                  onClick={() => switchRole('MECHANIC')}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition ${user.role === 'MECHANIC' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  Log in as Mechanic
                </button>
              </div>
            </div>
          </div>

          {/* Garage Information Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
              <Building size={18} className="text-slate-500" />
              <h3 className="font-semibold text-slate-800">Garage Details</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Garage Name</label>
                <input type="text" disabled defaultValue="Kigali Auto Masters" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <input type="text" disabled defaultValue="RWF (Rwandan Franc)" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Staff Management */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
            
            {/* Staff Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-blue-600" />
                <h3 className="font-semibold text-slate-800">Staff Management</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <UserPlus size={16} />
                <span>Add Staff</span>
              </button>
            </div>

            {/* Staff Table */}
            <div className="overflow-x-auto p-0 flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Name</th>
                    <th className="px-5 py-4 font-medium">Role</th>
                    <th className="px-5 py-4 font-medium">Email</th>
                    <th className="px-5 py-4 font-medium text-center">Status</th>
                    <th className="px-5 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50 group">
                      <td className="px-5 py-3 font-medium text-slate-800">{staff.name}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${staff.role === 'MANAGER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500">{staff.email}</td>
                      <td className="px-5 py-3 text-center">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button 
                          onClick={() => handleRemoveStaff(staff.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>

      {/* Add Staff Modal (Built inline for simplicity) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Add New Team Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} placeholder="e.g., Patrick" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input required type="email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} placeholder="patrick@kigaliauto.com" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">System Role</label>
                <select value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="MECHANIC">Mechanic (Can request parts)</option>
                  <option value="MANAGER">Manager (Full admin access)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;