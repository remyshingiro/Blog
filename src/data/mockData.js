// 1. INVENTORY DATA
export const mockInventory = [
  { id: "1", name: "Brake Pads - Toyota Corolla", sku: "BP-TC-001", category: "Brakes", stock: 12, minStock: 5, price: 15000 },
  { id: "2", name: "Oil Filter - Suzuki Carry", sku: "OF-SC-202", category: "Filters", stock: 3, minStock: 10, price: 5500 },
  { id: "3", name: "Spark Plug - NGK", sku: "SP-NGK-99", category: "Engine", stock: 45, minStock: 20, price: 3000 },
  { id: "4", name: "Alternator Belt", sku: "AB-GEN-04", category: "Engine", stock: 2, minStock: 4, price: 12000 },
  { id: "5", name: "Synthetic Motor Oil (5L)", sku: "OIL-SYN-5L", category: "Fluids", stock: 8, minStock: 10, price: 35000 },
];

// 2. TRANSACTION DATA
export const mockTransactions = [
  { id: "t1", itemName: "Oil Filter - Suzuki Carry", type: "OUT", quantity: 1, date: "2026-05-07T09:15:00Z", mechanic: "Jean" },
  { id: "t2", itemName: "Brake Pads - Toyota Corolla", type: "OUT", quantity: 1, date: "2026-05-06T14:30:00Z", mechanic: "Bosco" },
  { id: "t3", itemName: "Spark Plug - NGK", type: "IN", quantity: 50, date: "2026-05-05T10:00:00Z", mechanic: "Manager" },
];

// 3. USER DATA
export const mockUsers = [
  { id: "u1", name: "Admin Manager", role: "MANAGER", email: "admin@kigaliauto.com", status: "Active" },
  { id: "u2", name: "John the Mechanic", role: "MECHANIC", email: "john@kigaliauto.com", status: "Active" },
  { id: "u3", name: "Bosco", role: "MECHANIC", email: "bosco@kigaliauto.com", status: "Active" },
];

// 4. REQUESTS DATA
export const mockRequests = [
  { 
    id: "REQ-001", 
    mechanicName: "John the Mechanic", 
    itemName: "Brake Pads - Toyota Corolla", 
    quantity: 1, 
    jobReference: "Plate RAB 123 C", 
    status: "PENDING", 
    date: "2026-05-08T08:30:00Z" 
  },
  { 
    id: "REQ-002", 
    mechanicName: "Bosco", 
    itemName: "Synthetic Motor Oil (5L)", 
    quantity: 2, 
    jobReference: "Routine Service - RAE 456 F", 
    status: "APPROVED", 
    date: "2026-05-08T09:15:00Z" 
  }
];