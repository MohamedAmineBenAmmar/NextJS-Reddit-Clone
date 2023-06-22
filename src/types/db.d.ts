import type { Post, Subreddit, User, Vote, Comment } from '@prisma/client'

// Extend the Post type with the subreddit, votes, author, and comments fields
export type ExtendedPost = Post & {
  subreddit: Subreddit
  votes: Vote[]
  author: User
  comments: Comment[]
}