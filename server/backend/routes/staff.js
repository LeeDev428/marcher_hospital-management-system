import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Sample staff data
let staff = [
  {
    id: 'doc1',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@hospital.com',
    phone: '+63 912 345 6793',
    role: 'doctor',
    department: 'General Medicine',
    specialization: 'Internal Medicine',
    licenseNumber: 'MD-12345',
    status: 'active',
    schedule: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '17:00' }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc2',
    firstName: 'Jose',
    lastName: 'Garcia',
    email: 'jose.garcia@hospital.com',
    phone: '+63 912 345 6794',
    role: 'doctor',
    department: 'Cardiology',
    specialization: 'Cardiology',
    licenseNumber: 'MD-12346',
    status: 'active',
    schedule: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' }
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'nurse1',
    firstName: 'Ana',
    lastName: 'Reyes',
    email: 'ana.reyes@hospital.com',
    phone: '+63 912 345 6795',
    role: 'nurse',
    department: 'Emergency',
    specialization: 'Emergency Nursing',
    licenseNumber: 'RN-54321',
    status: 'active',
    schedule: {
      monday: { start: '06:00', end: '18:00' },
      tuesday: { start: '06:00', end: '18:00' },
      wednesday: { start: '06:00', end: '18:00' },
      thursday: { start: '06:00', end: '18:00' },
      friday: { start: '06:00', end: '18:00' }
    },
    createdAt: new Date().toISOString()
  }
];

// Get all staff
router.get('/', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 10, role, department, status = 'active' } = req.query;
    
    let filteredStaff = staff;
    
    // Filter by role
    if (role) {
      filteredStaff = filteredStaff.filter(s => s.role === role);
    }
    
    // Filter by department
    if (department) {
      filteredStaff = filteredStaff.filter(s => s.department === department);
    }
    
    // Filter by status
    if (status) {
      filteredStaff = filteredStaff.filter(s => s.status === status);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedStaff = filteredStaff.slice(startIndex, endIndex);
    
    res.json({
      staff: paginatedStaff,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredStaff.length,
        pages: Math.ceil(filteredStaff.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff', details: error.message });
  }
});

// Get single staff member
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const staffMember = staff.find(s => s.id === req.params.id);
    if (!staffMember) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json(staffMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff member', details: error.message });
  }
});

// Get doctors only
router.get('/doctors/list', authMiddleware, (req, res) => {
  try {
    const doctors = staff.filter(s => s.role === 'doctor' && s.status === 'active');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors', details: error.message });
  }
});

// Create new staff member
router.post('/', authMiddleware, (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      department,
      specialization,
      licenseNumber,
      schedule
    } = req.body;
    
    const newStaff = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      role,
      department,
      specialization,
      licenseNumber,
      status: 'active',
      schedule,
      createdAt: new Date().toISOString()
    };
    
    staff.push(newStaff);
    res.status(201).json({
      message: 'Staff member created successfully',
      staff: newStaff
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create staff member', details: error.message });
  }
});

// Update staff member
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const staffIndex = staff.findIndex(s => s.id === req.params.id);
    if (staffIndex === -1) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    staff[staffIndex] = {
      ...staff[staffIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      message: 'Staff member updated successfully',
      staff: staff[staffIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update staff member', details: error.message });
  }
});

export default router;