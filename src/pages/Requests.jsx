import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockRequests } from '../data/mockData';
import { CheckCircle, XCircle, Printer, Clock, Plus, FileText, Filter } from 'lucide-react';

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState(mockRequests);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'PENDING', 'APPROVED', 'REJECTED'
  const [printData, setPrintData] = useState(null); // Holds the specific request being printed

  // Handlers for Managers
  const handleApprove = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'APPROVED' } : req));
  };

  const handleReject = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'REJECTED' } : req));
  };

  // Trigger the print dialogue for a specific request
  const handlePrint = (request) => {
    setPrintData(request);
    // Slight delay ensures the DOM updates with the printData before the browser print window opens
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Step 1: Filter by Role
  const roleFilteredRequests = user.role === 'MANAGER' 
    ? requests 
    : requests.filter(req => req.mechanicName === user.name);

  // Step 2: Filter by Tab
  const displayRequests = roleFilteredRequests.filter(req => 
    activeTab === 'ALL' ? true : req.status === activeTab
  );

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
        
        {user.role === 'MECHANIC' && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-sm">
            <Plus size={20} />
            <span>New Request</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex gap-2 overflow-x-auto print:hidden">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-slate-100 text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab === 'ALL' ? 'All Requests' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            <span className="ml-2 px-2 py-0.5 rounded-full bg-white border border-slate-200 text-xs text-slate-500">
              {roleFilteredRequests.filter(r => tab === 'ALL' ? true : r.status === tab).length}
            </span>
          </button>
        ))}
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
              {displayRequests.length > 0 ? (
                displayRequests.map((req) => (
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
                          onClick={() => handlePrint(req)} 
                          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-lg font-medium transition ml-auto"
                        >
                          <Printer size={16} /> Print Slip
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                /* EMPTY STATE */
                <tr>
                  <td colSpan={user.role === 'MANAGER' ? "7" : "6"} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-slate-50 p-4 rounded-full mb-3">
                        <FileText className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-800">No requests found</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        There are no {activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} requests to display at this time.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT-ONLY TEMPLATE: Completely rebuilt to act as a real receipt */}
      <div className="hidden print:block p-8 border-2 border-slate-800 max-w-2xl mx-auto">
        <div className="border-b-2 border-slate-800 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-center uppercase tracking-wider">Kigali Auto Masters</h1>
          <p className="text-center text-slate-600 font-medium mt-1">Official Part Release Authorization</p>
        </div>
        
        {printData && (
          <>
            <div className="grid grid-cols-2 gap-8 text-lg mb-8">
              <div>
                <p className="text-sm text-slate-500 uppercase font-bold">Request ID</p>
                <p className="font-mono font-bold">{printData.id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase font-bold">Authorized Date</p>
                <p className="font-bold">{new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="bg-slate-100 p-6 rounded-lg mb-8 border border-slate-200">
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-semibold text-slate-600">Mechanic:</span> 
                  <span className="font-bold">{printData.mechanicName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-semibold text-slate-600">Job Reference:</span> 
                  <span className="font-bold">{printData.jobReference}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-semibold text-slate-600">Part Approved:</span> 
                  <span className="font-bold">{printData.itemName}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-semibold text-slate-600">Quantity to Release:</span> 
                  <span className="font-bold text-xl">{printData.quantity}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-16 pt-8 border-t border-slate-300">
              <div className="text-center w-48">
                <div className="border-b border-slate-800 h-8 mb-2"></div>
                <p className="text-xs text-slate-500 uppercase">Manager Signature</p>
              </div>
              <div className="text-center w-48">
                <div className="border-b border-slate-800 h-8 mb-2"></div>
                <p className="text-xs text-slate-500 uppercase">Stock Clerk Signature</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Requests;