import { createTRPCRouter } from "../../init"
import { transactionsRouter } from "./transactions"
import { transactionItemsRouter } from "./transactionItems"
import { paymentsRouter } from "./payments"
import { paymentPlansRouter } from "./paymentPlans"
import { paymentInstalmentsRouter } from "./paymentInstalments"

export const billingRouter = createTRPCRouter({
  transactions: transactionsRouter,
  transactionItems: transactionItemsRouter,
  payments: paymentsRouter,
  paymentPlans: paymentPlansRouter,
  paymentInstalments: paymentInstalmentsRouter,
})