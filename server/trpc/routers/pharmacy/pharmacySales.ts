import {
  createPharmacySaleSchema,
  getPharmacySaleSchema,
  getAvailableItemsSchema,
  updateSaleStatusSchema,
  deletePharmacySaleSchema,
} from "~/types/pharmacy"
import { createTRPCRouter, publicProcedure } from "../../init"

// Generate invoice number (format: INV-YYYYMMDD-XXXX)
function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0")
  return `INV-${year}${month}${day}-${random}`
}

// Get available pharmacy items for POS (with stock > 0)
const getAvailableItems = publicProcedure
  .input(getAvailableItemsSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { search, categoryId, brandId, minStock } = input

    try {
      const items = await instancePrisma.pharmacyItem.findMany({
        where: {
          stock: { gte: minStock || 1 }, // Only items with stock
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { strength: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }),
          ...(categoryId && { categoryId }),
          ...(brandId && { brandId }),
        },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      })

      return {
        success: true,
        message: "Available items fetched successfully",
        data: items,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to fetch available items",
        data: null,
      }
    }
  })

// Get all pharmacy sales
const getPharmacySales = publicProcedure.query(async ({ ctx }) => {
  const { instancePrisma } = ctx

  try {
    const sales = await instancePrisma.pharmacySale.findMany({
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform to table format
    const transformedSales = sales.map((sale) => ({
      id: sale.id,
      invoiceNumber: sale.invoiceNumber,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      staffId: sale.staffId,
      subtotal: Number(sale.subtotal),
      discount: Number(sale.discount),
      tax: Number(sale.tax),
      total: Number(sale.total),
      paymentMethod: sale.paymentMethod,
      paymentStatus: sale.paymentStatus,
      itemCount: sale._count.items,
      createdAt: sale.createdAt.toISOString(),
      updatedAt: sale.updatedAt.toISOString(),
    }))

    return {
      success: true,
      message: "Pharmacy sales fetched successfully",
      data: transformedSales,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "Failed to fetch pharmacy sales",
      data: null,
    }
  }
})

// Get single pharmacy sale with items
const getPharmacySale = publicProcedure
  .input(getPharmacySaleSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const sale = await instancePrisma.pharmacySale.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              pharmacyItem: {
                include: {
                  brand: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          payments: true,
        },
      })

      if (!sale) {
        return {
          success: false,
          message: "Sale not found",
          data: null,
        }
      }

      // Transform to full format
      const transformedSale = {
        id: sale.id,
        invoiceNumber: sale.invoiceNumber,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        staffId: sale.staffId,
        subtotal: Number(sale.subtotal),
        discount: Number(sale.discount),
        tax: Number(sale.tax),
        total: Number(sale.total),
        paymentMethod: sale.paymentMethod,
        paymentStatus: sale.paymentStatus,
        notes: sale.notes,
        items: sale.items.map((item) => ({
          id: item.id,
          pharmacyItemId: item.pharmacyItemId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          subtotal: Number(item.subtotal),
          pharmacyItem: {
            id: item.pharmacyItem.id,
            name: item.pharmacyItem.name,
            strength: item.pharmacyItem.strength,
            unit: item.pharmacyItem.unit,
            form: item.pharmacyItem.form,
            brand: {
              name: item.pharmacyItem.brand.name,
            },
          },
        })),
        payments: sale.payments.map((payment) => ({
          id: payment.id,
          amount: Number(payment.amount),
          method: payment.method,
          transactionId: payment.transactionId,
          paidAt: payment.paidAt.toISOString(),
        })),
        createdAt: sale.createdAt.toISOString(),
        updatedAt: sale.updatedAt.toISOString(),
      }

      return {
        success: true,
        message: "Pharmacy sale fetched successfully",
        data: transformedSale,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to fetch pharmacy sale",
        data: null,
      }
    }
  })

// Create pharmacy sale (POS checkout)
const createPharmacySale = publicProcedure
  .input(createPharmacySaleSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const {
      customerName,
      customerPhone,
      staffId,
      items,
      subtotal,
      discount,
      tax,
      total,
      amountPaid,
      changeGiven,
      paymentMethod,
      paymentStatus,
      notes,
    } = input

    try {
      // Generate unique invoice number
      const invoiceNumber = generateInvoiceNumber()

      // Check stock availability for all items
      for (const item of items) {
        const pharmacyItem = await instancePrisma.pharmacyItem.findUnique({
          where: { id: item.pharmacyItemId },
        })

        if (!pharmacyItem) {
          return {
            success: false,
            message: `Item with ID ${item.pharmacyItemId} not found`,
            data: null,
          }
        }

        if (pharmacyItem.stock < item.quantity) {
          return {
            success: false,
            message: `Insufficient stock for ${pharmacyItem.name}. Available: ${pharmacyItem.stock}, Requested: ${item.quantity}`,
            data: null,
          }
        }
      }

      // Create sale with items in a transaction
      const sale = await instancePrisma.$transaction(async (tx) => {
        // Create the sale
        const newSale = await tx.pharmacySale.create({
          data: {
            invoiceNumber,
            customerName,
            customerPhone,
            staffId,
            subtotal,
            discount,
            tax,
            total,
            amountPaid,
            changeGiven,
            paymentMethod,
            paymentStatus,
            notes,
          },
        })

        // Create sale items and update stock
        for (const item of items) {
          // Create sale item
          await tx.pharmacySaleItem.create({
            data: {
              saleId: newSale.id,
              pharmacyItemId: item.pharmacyItemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
            },
          })

          // Decrease stock
          await tx.pharmacyItem.update({
            where: { id: item.pharmacyItemId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        }

        // Create payment record
        await tx.pharmacyPayment.create({
          data: {
            saleId: newSale.id,
            amount: total,
            method: paymentMethod,
          },
        })

        // Fetch complete sale data
        return await tx.pharmacySale.findUnique({
          where: { id: newSale.id },
          include: {
            items: {
              include: {
                pharmacyItem: {
                  include: {
                    brand: true,
                  },
                },
              },
            },
            payments: true,
          },
        })
      })

      return {
        success: true,
        message: "Sale completed successfully",
        data: sale,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to create pharmacy sale",
        data: null,
      }
    }
  })

// Update sale status
const updateSaleStatus = publicProcedure
  .input(updateSaleStatusSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, paymentStatus } = input

    try {
      const sale = await instancePrisma.pharmacySale.update({
        where: { id },
        data: {
          paymentStatus,
        },
      })

      return {
        success: true,
        message: "Sale status updated successfully",
        data: sale,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to update sale status",
        data: null,
      }
    }
  })

// Delete pharmacy sale (soft delete/cancel)
const deletePharmacySale = publicProcedure
  .input(deletePharmacySaleSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      // Instead of deleting, mark as cancelled
      const sale = await instancePrisma.pharmacySale.update({
        where: { id },
        data: {
          paymentStatus: "CANCELLED",
        },
      })

      return {
        success: true,
        message: "Sale cancelled successfully",
        data: sale,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to cancel sale",
        data: null,
      }
    }
  })

export const pharmacySalesRouter = createTRPCRouter({
  getAvailableItems,
  getPharmacySales,
  getPharmacySale,
  createPharmacySale,
  updateSaleStatus,
  deletePharmacySale,
})
