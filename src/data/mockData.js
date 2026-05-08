// Add this to the bottom of src/data/mockData.js

export const mockUsers = [
  { id: "u1", name: "Admin Manager", role: "MANAGER", email: "admin@kigaliauto.com", status: "Active" },
  { id: "u2", name: "John the Mechanic", role: "MECHANIC", email: "john@kigaliauto.com", status: "Active" },
  { id: "u3", name: "Bosco", role: "MECHANIC", email: "bosco@kigaliauto.com", status: "Active" },
];

export const mockRequests = [
  { 
    id: "REQ-001", 
    mechanicName: "John the Mechanic", 
    itemName: "Brake Pads - Toyota Corolla", 
    quantity: 1, 
    jobReference: "Plate RAB 123 C", 
    status: "PENDING", // Statuses: PENDING, APPROVED, REJECTED
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