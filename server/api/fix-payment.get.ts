/**
 * Manual Payment Status Fix
 * For testing: Update pending payments to PAID status
 * DELETE THIS FILE IN PRODUCTION!
 */

import { PrismaClient as InstancePrismaClient } from '@/prisma/generated/instance/client'

const instancePrisma = new InstancePrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const transactionNumber = query.txn as string
    
    if (!transactionNumber) {
      return { error: 'Missing transaction number. Use: /api/fix-payment?txn=TXN-2025-400613' }
    }
    
    // Find the transaction
    const transaction = await instancePrisma.billingTransaction.findFirst({
      where: { transactionNumber },
      include: { payments: true }
    })
    
    if (!transaction) {
      return { error: 'Transaction not found' }
    }
    
    // Find pending payment
    const pendingPayment = transaction.payments.find(p => p.status === 'PENDING')
    
    if (!pendingPayment) {
      return { message: 'No pending payments found', transaction }
    }
    
    // Update payment to COMPLETED
    await instancePrisma.billingPayment.update({
      where: { id: pendingPayment.id },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
      }
    })
    
    // Update transaction status
    const paymentAmount = Number(pendingPayment.amount)
    const newPaidAmount = Number(transaction.paidAmount) + paymentAmount
    const newBalanceAmount = Number(transaction.totalAmount) - newPaidAmount
    
    await instancePrisma.billingTransaction.update({
      where: { id: transaction.id },
      data: {
        status: newBalanceAmount <= 0 ? 'PAID' : 'PARTIALLY_PAID',
        paidAmount: newPaidAmount.toString(),
        balanceAmount: newBalanceAmount.toString(),
      }
    })
    
    return {
      success: true,
      message: 'Payment updated successfully',
      transactionNumber,
      oldStatus: 'PENDING',
      newStatus: newBalanceAmount <= 0 ? 'PAID' : 'PARTIALLY_PAID',
      paidAmount: newPaidAmount,
      balanceAmount: newBalanceAmount
    }
    
  } catch (error: any) {
    return { error: error.message }
  }
})
