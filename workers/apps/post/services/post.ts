import {
  eq,
  desc,
  sql,
  and,
  type InferSelectModel,
  type SQL,
} from 'drizzle-orm';

import type { Post, UserPostResponse } from '@/shared/types/post';
import { initDbConnect } from '@/workers/db';
import { postSchema } from '@/workers/db/schema/post';
import { userSchema } from '@/workers/db/schema/user';

import {
  PostCreationFailedException,
  PostNotFoundException,
} from '../exceptions/post';
import type { PostServiceParams } from '../types/post';

export async function createPost(
  env: Env,
  params: PostServiceParams
): Promise<Post> {
  const db = initDbConnect(env);
  try {
    if (!['need', 'offer', 'question'].includes(params.type)) {
      throw new PostCreationFailedException(
        'Invalid post type. Must be "need", "offer", or "question"'
      );
    }
    const [post] = await db
      .insert(postSchema)
      .values({
        author_id: params.authorId,
        type: params.type,
        text: params.text,
      })
      .returning();

    if (!post) {
      throw new PostCreationFailedException();
    }

    return post;
  } catch (error) {
    if (error instanceof PostCreationFailedException) {
      throw error;
    }
    throw new PostCreationFailedException();
  }
}

// new helper to update existing post
export async function updatePost(
  env: Env,
  postId: number,
  authorId: number,
  updates: { type?: string; text?: string }
): Promise<InferSelectModel<typeof postSchema>> {
  const db = initDbConnect(env);
  // basic validation on update fields
  if (
    updates.type !== undefined &&
    !['need', 'offer', 'question'].includes(updates.type)
  ) {
    throw new Error('Invalid post type.');
  }

  const [existing] = await db
    .select()
    .from(postSchema)
    .where(eq(postSchema.id, postId))
    .limit(1);

  if (!existing) {
    throw new PostNotFoundException();
  }

  if (existing.author_id !== authorId) {
    throw new Error('Unauthorized to update this post');
  }

  const data: Partial<{ type: string; text: string }> = {};
  if (updates.type !== undefined) data.type = updates.type;
  if (updates.text !== undefined) data.text = updates.text;

  const [updated] = await db
    .update(postSchema)
    .set({
      ...data,
      updated_at: sql`NOW()`,
    })
    .where(eq(postSchema.id, postId))
    .returning();

  if (!updated) {
    // If the update query didn't return a row something went wrong
    throw new Error('Failed to update post');
  }

  return updated;
}

export async function getPostById(
  env: Env,
  postId: number
): Promise<InferSelectModel<typeof postSchema> | undefined> {
  const db = initDbConnect(env);
  try {
    const [post] = await db
      .select()
      .from(postSchema)
      .where(eq(postSchema.id, postId))
      .limit(1);

    return post;
  } catch {
    return undefined;
  }
}

export async function getPostByIdWithUserInfo(
  env: Env,
  postId: number
): Promise<
  | {
      id: number;
      type: string;
      text: string;
      created_at: number;
      user_full_name: string;
    }
  | undefined
> {
  const db = initDbConnect(env);
  try {
    const [post] = await db
      .select({
        id: postSchema.id,
        type: postSchema.type,
        text: postSchema.text,
        created_at: postSchema.created_at,
        user_full_name: userSchema.full_name,
      })
      .from(postSchema)
      .innerJoin(userSchema, eq(postSchema.author_id, userSchema.id))
      .where(eq(postSchema.id, postId))
      .limit(1);

    return post;
  } catch {
    return undefined;
  }
}

export async function getPostsByAuthor(
  env: Env,
  authorId: number
): Promise<InferSelectModel<typeof postSchema>[]> {
  const db = initDbConnect(env);
  try {
    const posts = await db
      .select()
      .from(postSchema)
      .where(eq(postSchema.author_id, authorId))
      .orderBy(desc(postSchema.created_at));

    return posts;
  } catch {
    return [];
  }
}

interface PostFilters {
  type?: string | undefined;
  user_id?: number | undefined;
  page?: number;
  limit?: number;
}

interface PostResponse {
  id: number;
  type: string;
  text: string;
  created_at: number;
  user_full_name: string;
}

export async function getAllPosts(
  env: Env,
  filters: PostFilters = {}
): Promise<{
  posts: PostResponse[];
  total: number;
}> {
  const db = initDbConnect(env);
  try {
    const { type, user_id, page = 1, limit = 50 } = filters;
    const offset = (page - 1) * limit;

    const whereConditions: SQL<boolean>[] = [];

    if (
      type !== undefined &&
      type !== null &&
      type !== '' &&
      ['need', 'offer', 'question'].includes(type.toLowerCase())
    ) {
      whereConditions.push(
        eq(postSchema.type, type.toLowerCase()) as SQL<boolean>
      );
    }

    if (
      user_id !== undefined &&
      user_id !== null &&
      !Number.isNaN(user_id) &&
      user_id > 0
    ) {
      whereConditions.push(eq(postSchema.author_id, user_id) as SQL<boolean>);
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const query = db
      .select({
        id: postSchema.id,
        type: postSchema.type,
        text: postSchema.text,
        created_at: postSchema.created_at,
        user_full_name: userSchema.full_name,
      })
      .from(postSchema)
      .innerJoin(userSchema, eq(postSchema.author_id, userSchema.id))
      .where(whereClause)
      .orderBy(desc(postSchema.created_at))
      .limit(limit)
      .offset(offset);

    const posts: PostResponse[] = await query;

    const totalResult: Array<{ count: number | null }> = await db
      .select({ count: sql<number>`count(*)` })
      .from(postSchema)
      .where(whereClause);

    const total = totalResult[0]?.count ?? 0;

    return { posts, total };
  } catch (error) {
    console.error(error);
    return { posts: [], total: 0 };
  }
}

export async function deletePost(
  env: Env,
  postId: number,
  authorId: number
): Promise<boolean> {
  const db = initDbConnect(env);
  try {
    const [existingPost] = await db
      .select()
      .from(postSchema)
      .where(eq(postSchema.id, postId))
      .limit(1);

    if (!existingPost) {
      throw new PostNotFoundException();
    }

    if (existingPost.author_id !== authorId) {
      throw new Error('Unauthorized to delete this post');
    }

    await db.delete(postSchema).where(eq(postSchema.id, postId));

    return true;
  } catch (error) {
    if (error instanceof PostNotFoundException) {
      throw error;
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new PostCreationFailedException('Failed to delete post');
  }
}

interface UserPostFilters {
  type?: string | undefined;
  page?: number;
  limit?: number;
}

export async function getUserPosts(
  env: Env,
  userId: number,
  filters: UserPostFilters = {}
): Promise<{
  posts: UserPostResponse[];
  total: number;
}> {
  const db = initDbConnect(env);
  try {
    const { type, page = 1, limit = 50 } = filters;
    const offset = (page - 1) * limit;

    const whereConditions: SQL<boolean>[] = [
      eq(postSchema.author_id, userId) as SQL<boolean>,
    ];

    if (
      type !== undefined &&
      type !== null &&
      type !== '' &&
      ['need', 'offer', 'question'].includes(type.toLowerCase())
    ) {
      whereConditions.push(
        eq(postSchema.type, type.toLowerCase()) as SQL<boolean>
      );
    }

    const posts: UserPostResponse[] = await db
      .select({
        id: postSchema.id,
        user_id: postSchema.author_id,
        type: postSchema.type,
        text: postSchema.text,
        created_at: postSchema.created_at,
        updated_at: postSchema.updated_at,
      })
      .from(postSchema)
      .where(and(...whereConditions))
      .orderBy(desc(postSchema.created_at))
      .limit(limit)
      .offset(offset);

    const totalResult: Array<{ count: number | null }> = await db
      .select({ count: sql<number>`count(*)` })
      .from(postSchema)
      .where(and(...whereConditions));

    const total = totalResult[0]?.count ?? 0;

    return { posts, total };
  } catch {
    return { posts: [], total: 0 };
  }
}
