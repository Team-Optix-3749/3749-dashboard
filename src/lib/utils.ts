import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const statusColors = {
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  IN_REVIEW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
  EXECUTED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
} as const

export const priorityColors = {
  CRITICAL: "bg-red-500/10 text-red-500",
  HIGH: "bg-amber-500/10 text-amber-500",
  MEDIUM: "bg-orange-500/10 text-orange-500",
  LOW: "bg-green-500/10 text-green-500",
} as const

export const roleColors = {
  OWNER: "bg-purple-500/10 text-purple-500",
  OFFICER: "bg-blue-500/10 text-blue-500",
  LEADERSHIP: "bg-cyan-500/10 text-cyan-500",
  MEMBER: "bg-green-500/10 text-green-500",
  PENDING: "bg-gray-500/10 text-gray-500",
} as const

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount)
}
