import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Sample facilities data
let facilities = [
  {
    id: '1',
    name: 'Emergency Room',
    type: 'emergency',
    department: 'Emergency Medicine',
    capacity: 20,
    currentOccupancy: 15,
    status: 'active',
    location: 'Ground Floor, Building A',
    equipment: [
      'Defibrillators',
      'Ventilators',
      'X-ray Machine',
      'ECG Machines',
      'Crash Carts'
    ],
    contactNumber: '+63 2 123 4567',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Operating Theater 1',
    type: 'surgery',
    department: 'Surgery',
    capacity: 1,
    currentOccupancy: 0,
    status: 'active',
    location: '3rd Floor, Building A',
    equipment: [
      'Surgical Lights',
      'Anesthesia Machine',
      'Surgical Table',
      'Monitors',
      'Surgical Instruments'
    ],
    contactNumber: '+63 2 123 4568',
    createdAt: new Date().toISOString()
  }
];

// Get all facilities
router.get('/', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 10, type, department, status = 'active' } = req.query;
    
    let filteredFacilities = facilities;
    
    // Filter by type
    if (type) {
      filteredFacilities = filteredFacilities.filter(f => f.type === type);
    }
    
    // Filter by department
    if (department) {
      filteredFacilities = filteredFacilities.filter(f => f.department === department);
    }
    
    // Filter by status
    if (status) {
      filteredFacilities = filteredFacilities.filter(f => f.status === status);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedFacilities = filteredFacilities.slice(startIndex, endIndex);
    
    res.json({
      facilities: paginatedFacilities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredFacilities.length,
        pages: Math.ceil(filteredFacilities.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch facilities', details: error.message });
  }
});

// Get single facility
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const facility = facilities.find(f => f.id === req.params.id);
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json(facility);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch facility', details: error.message });
  }
});

// Create new facility
router.post('/', authMiddleware, (req, res) => {
  try {
    const {
      name,
      type,
      department,
      capacity,
      location,
      equipment,
      contactNumber
    } = req.body;
    
    const newFacility = {
      id: Date.now().toString(),
      name,
      type,
      department,
      capacity,
      currentOccupancy: 0,
      status: 'active',
      location,
      equipment: equipment || [],
      contactNumber,
      createdAt: new Date().toISOString()
    };
    
    facilities.push(newFacility);
    res.status(201).json({
      message: 'Facility created successfully',
      facility: newFacility
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create facility', details: error.message });
  }
});

export default router;