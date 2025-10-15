import { z } from "zod"

// Payment Method Schema
export const paymentMethodSchema = z.enum([
  "CASH",
  "CARD",
  "ONLINE",
  "INSURANCE",
])

export const paymentMethodOptions = paymentMethodSchema.options.map((option) => ({
  label: option.charAt(0) + option.slice(1).toLowerCase(),
  value: option,
}))

// Payment Status Schema
export const paymentStatusSchema = z.enum([
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
])

export const paymentStatusOptions = paymentStatusSchema.options.map((option) => ({
  label: option.charAt(0).toUpperCase() + option.slice(1).toLowerCase(),
  value: option,
}))

// Cart Item Schema (for POS UI state)
export const cartItemSchema = z.object({
  pharmacyItemId: z.string().uuid("Invalid pharmacy item ID"),
  name: z.string(),
  strength: z.string(),
  unit: z.string(),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  availableStock: z.number().min(0),
  subtotal: z.number(),
})

// Pharmacy Sale Item Schema
export const pharmacySaleItemSchema = z.object({
  pharmacyItemId: z.string().uuid("Invalid pharmacy item ID"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  subtotal: z.number().min(0, "Subtotal must be positive"),
})

// Create Pharmacy Sale Schema
export const createPharmacySaleSchema = z.object({
  customerName: z.string().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  staffId: z.string().uuid("Invalid staff ID").optional().nullable(),
  items: z.array(pharmacySaleItemSchema).min(1, "At least one item is required"),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  discount: z.number().min(0, "Discount must be positive").default(0),
  tax: z.number().min(0, "Tax must be positive").default(0),
  total: z.number().min(0, "Total must be positive"),
  paymentMethod: paymentMethodSchema.default("CASH"),
  paymentStatus: paymentStatusSchema.default("COMPLETED"),
  notes: z.string().optional().nullable(),
})

// Get Pharmacy Sale Schema
export const getPharmacySaleSchema = z.object({
  id: z.string().uuid("Invalid sale ID"),
})

// Table Pharmacy Sale Schema (for listing)
export const tablePharmacySaleSchema = z.object({
  id: z.string().uuid(),
  invoiceNumber: z.string(),
  customerName: z.string().nullable(),
  customerPhone: z.string().nullable(),
  staffId: z.string().nullable(),
  subtotal: z.number(),
  discount: z.number(),
  tax: z.number(),
  total: z.number(),
  paymentMethod: paymentMethodSchema,
  paymentStatus: paymentStatusSchema,
  itemCount: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Full Pharmacy Sale Schema (with relations)
export const fullPharmacySaleSchema = z.object({
  id: z.string().uuid(),
  invoiceNumber: z.string(),
  customerName: z.string().nullable(),
  customerPhone: z.string().nullable(),
  staffId: z.string().nullable(),
  subtotal: z.number(),
  discount: z.number(),
  tax: z.number(),
  total: z.number(),
  paymentMethod: paymentMethodSchema,
  paymentStatus: paymentStatusSchema,
  notes: z.string().nullable(),
  items: z.array(z.object({
    id: z.string().uuid(),
    pharmacyItemId: z.string().uuid(),
    quantity: z.number(),
    unitPrice: z.number(),
    subtotal: z.number(),
    pharmacyItem: z.object({
      id: z.string().uuid(),
      name: z.string(),
      strength: z.string(),
      unit: z.string(),
      form: z.string(),
      brand: z.object({
        name: z.string(),
      }),
    }),
  })),
  payments: z.array(z.object({
    id: z.string().uuid(),
    amount: z.number(),
    method: paymentMethodSchema,
    transactionId: z.string().nullable(),
    paidAt: z.string().datetime(),
  })),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Get Available Items Schema (for POS)
export const getAvailableItemsSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  minStock: z.number().min(0).optional().default(1), // Only show items with stock
})

// Update Sale Status Schema
export const updateSaleStatusSchema = z.object({
  id: z.string().uuid("Invalid sale ID"),
  paymentStatus: paymentStatusSchema,
})

// Delete Pharmacy Sale Schema
export const deletePharmacySaleSchema = z.object({
  id: z.string().uuid("Invalid sale ID"),
})

// Type exports
export type CartItem = z.infer<typeof cartItemSchema>
export type PharmacySaleItem = z.infer<typeof pharmacySaleItemSchema>
export type CreatePharmacySale = z.infer<typeof createPharmacySaleSchema>
export type GetPharmacySale = z.infer<typeof getPharmacySaleSchema>
export type TablePharmacySale = z.infer<typeof tablePharmacySaleSchema>
export type FullPharmacySale = z.infer<typeof fullPharmacySaleSchema>
export type GetAvailableItems = z.infer<typeof getAvailableItemsSchema>
export type UpdateSaleStatus = z.infer<typeof updateSaleStatusSchema>
export type DeletePharmacySale = z.infer<typeof deletePharmacySaleSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type PaymentStatus = z.infer<typeof paymentStatusSchema>
