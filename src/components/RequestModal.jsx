import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RequestModal = ({ isOpen, onClose, onRequest, item }) => {
  const { user } = useAuth(); // Automatically get the logged-in user!
  const [formData, setFormData] = useState({
    quantity: 1,
    reference: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({ quantity: 1, reference: '' });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRequest(item.id, {
      ...formData,
      quantity: parseInt(formData.quantity),
      mechanicName: user.name, // Auto-attach the user
      status: 'PENDING',
      date: new Date().toISOString()
    });
    onClose();
  };

  const isOutOfStock = item.stock === 0;
  const isRequestingTooMuch = parseInt(formData.quantity) > item.stock;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-blue-50/50 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Request Part</h3>
            <p className="text-sm text-slate-500 mt-1">{item.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className={`p-3 rounded-lg flex items-start gap-3 ${isOutOfStock ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-700'}`}>
            <AlertCircle size={20} className={isOutOfStock ? 'text-red-500' : 'text-slate-400'} />
            <div>
              <p className="text-sm font-medium">Current Stock: {item.stock} available</p>
              {isOutOfStock && <p className="text-xs mt-1">You cannot request this item right now.</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Needed</label>
            <input 
              required 
              type="number" 
              min="1" 
              max={item.stock}
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
              disabled={isOutOfStock}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                isRequestingTooMuch ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'
              }`} 
            />
            {isRequestingTooMuch && <p className="text-xs text-red-500 mt-1">Cannot exceed current stock.</p>}
          </div>

          {/* Mechanic input is gone! We get it from context now. */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Requesting Mechanic</label>
            <input type="text" disabled value={user.name} className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Repair Order / Job Reference</label>
            <input 
              required
              type="text" 
              name="reference" 
              value={formData.reference} 
              onChange={handleChange} 
              placeholder="e.g., Plate RAB 123 C"
              disabled={isOutOfStock}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none" 
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isOutOfStock || isRequestingTooMuch}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;