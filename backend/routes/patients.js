import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Sample patients data (replace with database)
let patients = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan.delacruz@email.com',
    phone: '+63 912 345 6789',
    birthDate: '1985-03-15',
    gender: 'Male',
    address: 'Quezon City, Metro Manila',
    emergencyContact: {
      name: 'Maria Dela Cruz',
      relationship: 'Wife',
      phone: '+63 912 345 6790'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@email.com',
    phone: '+63 912 345 6791',
    birthDate: '1990-07-22',
    gender: 'Female',
    address: 'Makati City, Metro Manila',
    emergencyContact: {
      name: 'Jose Santos',
      relationship: 'Husband',
      phone: '+63 912 345 6792'
    },
    createdAt: new Date().toISOString()
  }
];

// Get all patients
router.get('/', authenticateToken, (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    // Filter patients based on search
    let filteredPatients = patients;
    if (search) {
      filteredPatients = patients.filter(patient =>
        patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
        patient.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);
    
    res.json({
      patients: paginatedPatients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredPatients.length,
        pages: Math.ceil(filteredPatients.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients', details: error.message });
  }
});

// Get single patient
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const patient = patients.find(p => p.id === req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient', details: error.message });
  }
});

// Create new patient
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      birthDate,
      gender,
      address,
      emergencyContact
    } = req.body;
    
    const newPatient = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      birthDate,
      gender,
      address,
      emergencyContact,
      createdAt: new Date().toISOString()
    };
    
    patients.push(newPatient);
    res.status(201).json({
      message: 'Patient created successfully',
      patient: newPatient
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create patient', details: error.message });
  }
});

// Update patient
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const patientIndex = patients.findIndex(p => p.id === req.params.id);
    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    patients[patientIndex] = {
      ...patients[patientIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      message: 'Patient updated successfully',
      patient: patients[patientIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update patient', details: error.message });
  }
});

// Delete patient
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const patientIndex = patients.findIndex(p => p.id === req.params.id);
    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    patients.splice(patientIndex, 1);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete patient', details: error.message });
  }
});

export default router;