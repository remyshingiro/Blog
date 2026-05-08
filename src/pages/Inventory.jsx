import { useState } from 'react';
import { Search, Plus, Edit2, ClipboardList, Filter } from 'lucide-react';
import { mockInventory } from '../data/mockData';
import AddItemModal from '../components/AddItemModal';
import RequestModal from '../components/RequestModal'; // Updated Import
import { useAuth } from '../context/AuthContext'; // Pulling in user roles

const Inventory = () => {
  const { user } = useAuth(); // Get the current user role
  const [inventoryList, setInventoryList] = useState(mockInventory);
  
  // State for Modal Controls
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [requestItem, setRequestItem] = useState(null); // Renamed state

  const categories = ["All", ...new Set(inventoryList.map(item => item.category))];

  const filteredItems = inventoryList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddNewItem = (newItem) => {
    setInventoryList([newItem, ...inventoryList]);
  };

  // UPDATED: We no longer deduct stock here. We log a request!
  const handleRequestPart = (itemId, requestData) => {
    // Alert the user that the request was sent to the Manager
    alert(`Success! Requested ${requestData.quantity} part(s). Waiting for Manager approval.`);
    
    // Once Firebase is connected, this will push a new document to the "Requests" collection
    console.log("Sent to Approvals Queue:", requestData);
  };

  return (
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory Master List</h2>
          <p className="text-slate-500 text-sm mt-1">Manage, search, and update your garage parts.</p>
        </div>
        
        {/* RBAC: Only Managers can add new parts */}
        {user.role === 'MANAGER' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={20} />
            <span>Add New Part</span>
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
            placeholder="Search by part name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
          <select
            className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 appearance-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">SKU</th>
                <th className="px-6 py-4 font-semibold">Part Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold text-center">Stock</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-slate-500">{item.sku}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-lg ${item.stock <= item.minStock ? 'text-red-600' : 'text-slate-700'}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.stock === 0 ? (
                        <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">Out of Stock</span>
                      ) : item.stock <= item.minStock ? (
                        <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold">Low Stock</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        
                        {/* RBAC: Only Managers can edit parts */}
                        {user.role === 'MANAGER' && (
                          <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit Part">
                            <Edit2 size={18} />
                          </button>
                        )}

                        {/* Everyone can Request parts */}
                        <button 
                          onClick={() => setRequestItem(item)}
                          className="text-slate-400 hover:text-blue-600 transition-colors" 
                          title="Request Part"
                        >
                          <ClipboardList size={18} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-lg font-medium text-slate-600">No parts found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddNewItem} />
      
      {/* Updated Request Modal */}
      <RequestModal 
        isOpen={!!requestItem} 
        item={requestItem} 
        onClose={() => setRequestItem(null)} 
        onRequest={handleRequestPart} 
      />
    </div>
  );
};

export default Inventory;