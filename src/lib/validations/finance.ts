import { z } from "zod"

export const TransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE", "GRANT", "REFUND"]),
  amount: z.number().positive(),
  description: z.string().min(1).max(500),
  vendor: z.string().optional(),
  categoryId: z.string().optional(),
  date: z.date(),
})

export const BudgetSchema = z.object({
  seasonYear: z.string(),
  totalBudget: z.number().positive(),
  notes: z.string().optional(),
})

export type Transaction = z.infer<typeof TransactionSchema>
export type Budget = z.infer<typeof BudgetSchema>
