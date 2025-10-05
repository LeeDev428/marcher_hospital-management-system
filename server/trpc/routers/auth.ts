import { z } from 'zod';
import { publicProcedure, createTRPCRouter } from '../init';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Input validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(['admin', 'patient', 'staff', 'partner']).default('patient'),
  // Patient-specific fields
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  bloodType: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']).optional(),
  // Staff-specific fields
  position: z.string().optional(),
  department: z.string().optional(),
  licenseNumber: z.string().optional(),
  specialization: z.string().optional(),
  // Partner-specific fields
  companyName: z.string().optional(),
  contactPerson: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      try {
        const response = await $fetch(`${BACKEND_URL}/api/auth/register`, {
          method: 'POST',
          body: input
        });
        return response;
      } catch (error: any) {
        if (error.data) {
          throw new Error(error.data.message || 'Registration failed');
        }
        throw new Error('Network error occurred');
      }
    }),

  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await $fetch(`${BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          body: input
        }) as any;

        // Set HTTP-only cookies if login is successful
        if (response.success && response.tokens) {
          const { setCookie } = await import('h3');
          
          // Set access token cookie
          setCookie(ctx.event, 'accessToken', response.tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 // 15 minutes
          });

          // Set refresh token cookie  
          setCookie(ctx.event, 'refreshToken', response.tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
          });

          // Return response without tokens (they're now in cookies)
          const { tokens, ...responseWithoutTokens } = response;
          return responseWithoutTokens;
        }

        return response;
      } catch (error: any) {
        if (error.data) {
          throw new Error(error.data.message || 'Login failed');
        }
        throw new Error('Network error occurred');
      }
    }),

  logout: publicProcedure
    .input(z.object({ refreshToken: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const authHeader = ctx.event?.node?.req?.headers?.authorization;
        const response = await $fetch(`${BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          body: input,
          headers: {
            'Authorization': authHeader || ''
          }
        }) as any;

        // Clear cookies on successful logout
        if (response.success) {
          const { deleteCookie } = await import('h3');
          
          deleteCookie(ctx.event, 'accessToken');
          deleteCookie(ctx.event, 'refreshToken');
        }

        return response;
      } catch (error: any) {
        // Clear cookies even if backend logout fails
        const { deleteCookie } = await import('h3');
        deleteCookie(ctx.event, 'accessToken');
        deleteCookie(ctx.event, 'refreshToken');
        
        if (error.data) {
          throw new Error(error.data.message || 'Logout failed');
        }
        throw new Error('Network error occurred');
      }
    }),

  refreshToken: publicProcedure
    .input(refreshTokenSchema)
    .mutation(async ({ input }) => {
      try {
        const response = await $fetch(`${BACKEND_URL}/api/auth/refresh-token`, {
          method: 'POST',
          body: input
        });
        return response;
      } catch (error: any) {
        if (error.data) {
          throw new Error(error.data.message || 'Token refresh failed');
        }
        throw new Error('Network error occurred');
      }
    }),

  me: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const authHeader = ctx.event?.node?.req?.headers?.authorization;
        if (!authHeader) {
          throw new Error('Authorization header required');
        }

        const response = await $fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            'Authorization': authHeader
          }
        });
        return response;
      } catch (error: any) {
        if (error.data) {
          throw new Error(error.data.message || 'Failed to fetch user data');
        }
        throw new Error('Network error occurred');
      }
    }),

  getDemoAccounts: publicProcedure
    .query(async () => {
      try {
        const response = await $fetch(`${BACKEND_URL}/api/auth/demo-accounts`);
        return response;
      } catch (error: any) {
        if (error.data) {
          throw new Error(error.data.message || 'Failed to fetch demo accounts');
        }
        throw new Error('Network error occurred');
      }
    })
});