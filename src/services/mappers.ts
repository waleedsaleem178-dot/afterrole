import type {
  CommentRow,
  CompanyRow,
  CompanyTopicStatRow,
  EmploymentRow,
  NotificationRow,
  ProfileRow,
  StoryRow,
} from '@/types/database';
import type {
  AppNotification,
  Comment,
  Company,
  CompanyTopic,
  Employment,
  Story,
  User,
} from '@/types';

/** Real per-profile counts (0 when not yet loaded — never faked). */
export interface ProfileCounts {
  followerCount?: number;
  followingCount?: number;
  storyCount?: number;
}

export function toUser(row: ProfileRow, counts: ProfileCounts = {}, employment: Employment[] = []): User {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    headline: row.headline,
    location: row.location,
    bio: row.bio,
    avatarColor: row.avatar_color,
    verified: row.verified,
    followerCount: counts.followerCount ?? 0,
    followingCount: counts.followingCount ?? 0,
    storyCount: counts.storyCount ?? 0,
    employment,
  };
}

export function toEmployment(row: EmploymentRow): Employment {
  return {
    id: row.id,
    companyId: row.company_id ?? undefined,
    companyName: row.company_name,
    role: row.role,
    location: row.location ?? undefined,
    startLabel: row.start_label,
    endLabel: row.end_label,
    current: row.is_current,
    verified: row.verified,
  };
}

export interface CompanyExtras {
  storyCount?: number;
  followerCount?: number;
  topics?: CompanyTopicStatRow[];
}

export function toCompany(row: CompanyRow, extras: CompanyExtras = {}): Company {
  const topics: CompanyTopic[] = (extras.topics ?? [])
    .map((t) => ({ label: t.topic, percent: Number(t.percent) }))
    .sort((a, b) => b.percent - a.percent);
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    country: row.country ?? undefined,
    sizeLabel: row.size_label || '—',
    logoColor: row.logo_color,
    description: row.description,
    storyCount: extras.storyCount ?? 0,
    followerCount: extras.followerCount ?? 0,
    topics,
    // Green/red flags and role categories are only shown once real story
    // analysis exists; never fabricated.
    positives: [],
    challenges: [],
    roleCategories: [],
  };
}

export interface StoryCounts {
  helpfulCount?: number;
  beenThereCount?: number;
  commentCount?: number;
}

export function toStory(row: StoryRow, counts: StoryCounts = {}): Story {
  return {
    id: row.id,
    authorId: row.author_id,
    companyId: row.company_id,
    role: row.role,
    employmentContext: row.employment_context,
    employmentStatus: row.employment_status,
    endReason: (row.end_reason as Story['endReason']) ?? undefined,
    createdAt: row.created_at,
    excerpt: row.excerpt,
    body: row.body,
    finalStraw: row.final_straw ?? undefined,
    whatWasGood: row.what_was_good ?? undefined,
    topics: row.topics,
    wouldWorkAgain: row.would_work_again ?? undefined,
    helpfulCount: counts.helpfulCount ?? 0,
    beenThereCount: counts.beenThereCount ?? 0,
    commentCount: counts.commentCount ?? 0,
    isFinalStraw: row.is_final_straw,
  };
}

export function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    storyId: row.story_id,
    authorId: row.author_id,
    body: row.body,
    createdAt: row.created_at,
    helpfulCount: 0,
  };
}

export function toNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    type: row.type,
    actorId: row.actor_id ?? undefined,
    storyId: row.story_id ?? undefined,
    companyId: row.company_id ?? undefined,
    message: row.message,
    createdAt: row.created_at,
    read: row.read,
  };
}
