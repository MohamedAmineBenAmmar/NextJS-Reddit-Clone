import { Vote } from '@prisma/client'

// We are storing the data that we need to show to the user immediately
export type CachedPost = {
  id: string
  title: string
  authorUsername: string
  content: string
  currentVote: Vote['type'] | null
  createdAt: Date
}