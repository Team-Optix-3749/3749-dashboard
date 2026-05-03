"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useMembers() {
  const { data, error, isLoading } = useSWR("/api/members", fetcher)
  return { members: data, isLoading, error }
}

export function useMyOpi() {
  const { data, error, isLoading } = useSWR("/api/opi", fetcher)
  return { submissions: data, isLoading, error }
}

export function useSponsors() {
  const { data, error, isLoading } = useSWR("/api/sponsors", fetcher)
  return { sponsors: data, isLoading, error }
}
