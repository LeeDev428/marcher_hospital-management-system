import express from 'express';
import { PrismaClient } from '../../../prisma/generated/instance/index.js';
import authService from '../services/authService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      middleName, 
      phoneNumber, 
      role = 'patient',
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      bloodType,
      position,
      department,
      licenseNumber,
      specialization,
      companyName,
      contactPerson
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(password);

    // Create user with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with personal information
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone: phoneNumber,
          role: role.toUpperCase(),
          status: (role === 'admin' || role === 'patient' || role === 'staff') ? 'ACTIVE' : 'PENDING_APPROVAL',
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender,
          address
        }
      });

      // Create role-specific profile
      if (role === 'patient') {
        const patientNumber = await authService.generatePatientNumber();
        await tx.patient.create({
          data: {
            userId: user.id,
            patientNumber,
            emergencyContact,
            bloodType
          }
        });
      } else if (role === 'staff') {
        const staffNumber = await authService.generateStaffNumber();
        await tx.staff.create({
          data: {
            userId: user.id,
            staffNumber,
            position,
            department,
            licenseNumber,
            specialization
          }
        });
      } else if (role === 'partner') {
        await tx.partner.create({
          data: {
            userId: user.id,
            institutionName: companyName,
            institutionType: 'CLINIC', // Default type, should be passed from frontend
            contactPerson
          }
        });
      }

      return user;
    });

    // Generate tokens
    const { accessToken, refreshToken } = authService.generateTokens(
      result.id,
      result.email,
      result.role
    );

    // Save refresh token
    await authService.saveRefreshToken(result.id, refreshToken);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = result;

    res.status(201).json({
      success: true,
      message: role === 'admin' ? 'Registration successful' : 'Registration successful. Account pending approval.',
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user with role-specific profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patientProfile: true,
        staffProfile: true,
        partnerProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await authService.comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check account status
    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Account suspended. Please contact administrator.'
      });
    }

    if (user.status === 'PENDING_APPROVAL') {
      return res.status(403).json({
        success: false,
        message: 'Account pending approval. Please wait for administrator approval.'
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate tokens
    const { accessToken, refreshToken } = authService.generateTokens(
      user.id,
      user.email,
      user.role
    );

    // Save refresh token
    await authService.saveRefreshToken(user.id, refreshToken);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.revokeRefreshToken(refreshToken);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    const user = await authService.verifyRefreshToken(refreshToken);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Revoke old refresh token
    await authService.revokeRefreshToken(refreshToken);

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = authService.generateTokens(
      user.id,
      user.email,
      user.role
    );

    // Save new refresh token
    await authService.saveRefreshToken(user.id, newRefreshToken);

    res.json({
      success: true,
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user endpoint
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        patientProfile: true,
        staffProfile: true,
        partnerProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Demo accounts endpoint
router.get('/demo-accounts', async (req, res) => {
  try {
    res.json({
      success: true,
      accounts: [
        {
          role: 'admin',
          email: 'admin@marcherhospital.com',
          password: 'admin123',
          description: 'Full system access'
        },
        {
          role: 'staff',
          email: 'doctor@marcherhospital.com',
          password: 'doctor123',
          description: 'Medical staff access'
        },
        {
          role: 'patient',
          email: 'patient@example.com',
          password: 'patient123',
          description: 'Patient portal access'
        },
        {
          role: 'partner',
          email: 'partner@insurance.com',
          password: 'partner123',
          description: 'Insurance partner access'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;