import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Sample appointments data
let appointments = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Juan Dela Cruz',
    doctorId: 'doc1',
    doctorName: 'Dr. Maria Rodriguez',
    department: 'General Medicine',
    appointmentDate: '2025-10-05',
    appointmentTime: '10:00',
    status: 'scheduled',
    type: 'consultation',
    notes: 'Regular check-up',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Maria Santos',
    doctorId: 'doc2',
    doctorName: 'Dr. Jose Garcia',
    department: 'Cardiology',
    appointmentDate: '2025-10-06',
    appointmentTime: '14:30',
    status: 'scheduled',
    type: 'follow-up',
    notes: 'Heart condition follow-up',
    createdAt: new Date().toISOString()
  }
];

// Get all appointments
router.get('/', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;
    
    let filteredAppointments = appointments;
    
    // Filter by status
    if (status) {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
    }
    
    // Filter by date
    if (date) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate === date);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);
    
    res.json({
      appointments: paginatedAppointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredAppointments.length,
        pages: Math.ceil(filteredAppointments.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
  }
});

// Get single appointment
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const appointment = appointments.find(apt => apt.id === req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointment', details: error.message });
  }
});

// Create new appointment
router.post('/', authMiddleware, (req, res) => {
  try {
    const {
      patientId,
      patientName,
      doctorId,
      doctorName,
      department,
      appointmentDate,
      appointmentTime,
      type,
      notes
    } = req.body;
    
    const newAppointment = {
      id: Date.now().toString(),
      patientId,
      patientName,
      doctorId,
      doctorName,
      department,
      appointmentDate,
      appointmentTime,
      status: 'scheduled',
      type,
      notes,
      createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: newAppointment
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment', details: error.message });
  }
});

// Update appointment
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const appointmentIndex = appointments.findIndex(apt => apt.id === req.params.id);
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      message: 'Appointment updated successfully',
      appointment: appointments[appointmentIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment', details: error.message });
  }
});

// Cancel appointment
router.patch('/:id/cancel', authMiddleware, (req, res) => {
  try {
    const appointmentIndex = appointments.findIndex(apt => apt.id === req.params.id);
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    appointments[appointmentIndex].status = 'cancelled';
    appointments[appointmentIndex].updatedAt = new Date().toISOString();
    
    res.json({
      message: 'Appointment cancelled successfully',
      appointment: appointments[appointmentIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel appointment', details: error.message });
  }
});

export default router;