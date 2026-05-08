import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockRequests } from '../data/mockData';
import { CheckCircle, XCircle, Printer, Clock, Plus } from 'lucide-react';

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState(mockRequests);

  // Handlers for Managers
  const handleApprove = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'APPROVED' } : req));
  };

  const handleReject = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'REJECTED' } : req));
  };

  // Filter requests based on role. Mechanics only see their own.
  const displayRequests = user.role === 'MANAGER' 
    ? requests 
    : requests.filter(req => req.mechanicName === user.name);

  // Helper for Status Badges
  const StatusBadge = ({ status }) => {
    switch(status) {
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Clock size={14}/> Pending</span>;
      case 'APPROVED': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><CheckCircle size={14}/> Approved</span>;
      case 'REJECTED': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><XCircle size={14}/> Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Part Requests & Approvals</h2>
          <p className="text-slate-500 text-sm mt-1">
            {user.role === 'MANAGER' ? 'Review and manage mechanic part requests.' : 'Track your part requests and print approvals.'}
          </p>
        </div>
        
        {/* Only Mechanics can request new parts here */}
        {user.role === 'MECHANIC' && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-sm">
            <Plus size={20} />
            <span>New Request</span>
          </button>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">Request ID</th>
                {user.role === 'MANAGER' && <th className="px-6 py-4 font-semibold">Mechanic</th>}
                <th className="px-6 py-4 font-semibold">Part Required</th>
                <th className="px-6 py-4 font-semibold text-center">Qty</th>
                <th className="px-6 py-4 font-semibold">Job Reference</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {displayRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500">{req.id}</td>
                  {user.role === 'MANAGER' && <td className="px-6 py-4 font-medium text-slate-800">{req.mechanicName}</td>}
                  <td className="px-6 py-4 font-medium text-slate-800">{req.itemName}</td>
                  <td className="px-6 py-4 text-center font-bold">{req.quantity}</td>
                  <td className="px-6 py-4 text-slate-600">{req.jobReference}</td>
                  <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                  <td className="px-6 py-4 text-right">
                    
                    {/* MANAGER ACTIONS */}
                    {user.role === 'MANAGER' && req.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleApprove(req.id)} className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition">Approve</button>
                        <button onClick={() => handleReject(req.id)} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium transition">Reject</button>
                      </div>
                    )}

                    {/* MECHANIC ACTIONS */}
                    {user.role === 'MECHANIC' && req.status === 'APPROVED' && (
                      <button 
                        onClick={() => window.print()} 
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-lg font-medium transition ml-auto"
                      >
                        <Printer size={16} /> Print Slip
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT-ONLY TEMPLATE: This is invisible on screen, but shows up when printing */}
      <div className="hidden print:block p-8 border-2 border-dashed border-slate-300">
        <h1 className="text-3xl font-bold text-center mb-8">Kigali Auto Masters - Part Release Form</h1>
        <p className="text-center text-slate-500 mb-12">Authorized by Management. Hand this to the stock clerk.</p>
        
        <div className="space-y-6 text-lg">
          <div className="flex justify-between border-b pb-2"><span className="font-semibold">Mechanic Name:</span> <span>{user.name}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="font-semibold">Date & Time:</span> <span>{new Date().toLocaleString()}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="font-semibold">Status:</span> <span className="text-green-600 font-bold">APPROVED</span></div>
        </div>

        <div className="mt-16 text-center text-sm text-slate-400">
          <p>Scan barcode at stock room counter.</p>
          <div className="h-12 w-48 bg-slate-200 mx-auto mt-4 rounded"></div> {/* Fake Barcode */}
        </div>
      </div>
    </div>
  );
};

export default Requests;