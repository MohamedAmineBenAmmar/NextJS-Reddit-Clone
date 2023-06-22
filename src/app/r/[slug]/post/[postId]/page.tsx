import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import type { CachedPost } from "@/types/redis";
import React, { Suspense } from "react";
import { Post, User, Vote } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { formatTimeToNow } from "@/lib/utils";
import EditorOutput from "@/components/EditorOutput";
import CommentsSection from "@/components/CommentsSection";

interface PageProps {
  params: {
    postId: string;
  };
}

// To force hard reload on the page each time the user visit the post view page
// For example: when it comes to comments we want the user the last uptodate comments not cached ones
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({ params }: PageProps) => {
  // Each time we visit this page to display the specific post page
  // we will interact with the redis database and see if we have a cached version of the post to display
  // important data fast and then stream data like comments and other stuff little by a little
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  // If we miss the cache
  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteShell />}>
          {/* This component is going to display the not imported data */}
          {/* @ts-expect-error server component */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>

        <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />

          {/* Idea is to stream the comments instead of server side loading them (requiring all comments to be loaded before the page is even redered ===> bad UX) */}
          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            {/* @ts-expect-error server component */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      {/* upvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      {/* score */}
      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}

export default page;
