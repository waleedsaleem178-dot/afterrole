/**
 * AfterRole database types.
 *
 * Hand-maintained to match `supabase/migrations/*`. When the Supabase CLI is
 * available you can regenerate with:
 *   supabase gen types typescript --project-id <ref> > src/types/database.ts
 */

export type VerificationStatusDB = 'unverified' | 'pending' | 'verified';
export type EmploymentStatusDB = 'current' | 'former';
export type WouldWorkAgainDB = 'Yes' | 'Maybe' | 'No';
export type StoryStatusDB = 'draft' | 'published' | 'removed';
export type ReactionTypeDB = 'helpful' | 'been_there';
export type NotificationTypeDB =
  | 'helpful'
  | 'comment'
  | 'follow'
  | 'company_stories'
  | 'verification';

export type CompanyRow = {
  id: string;
  name: string;
  industry: string;
  country: string | null;
  size_label: string | null;
  logo_color: string;
  description: string;
  logo_url: string | null;
  created_by: string | null;
  is_verified: boolean;
  created_at: string;
}

export type ProfileRow = {
  id: string;
  name: string;
  username: string;
  headline: string;
  location: string;
  bio: string;
  avatar_color: string;
  avatar_url: string | null;
  verified: boolean;
  verification_status: VerificationStatusDB;
  created_at: string;
  updated_at: string;
}

export type EmploymentRow = {
  id: string;
  profile_id: string;
  company_id: string | null;
  company_name: string;
  role: string;
  location: string | null;
  start_label: string;
  end_label: string;
  is_current: boolean;
  verified: boolean;
  created_at: string;
}

export type StoryRow = {
  id: string;
  author_id: string;
  company_id: string;
  role: string;
  employment_context: string;
  employment_status: EmploymentStatusDB;
  end_reason: string | null;
  excerpt: string;
  body: string;
  final_straw: string | null;
  what_was_good: string | null;
  topics: string[];
  would_work_again: WouldWorkAgainDB | null;
  is_final_straw: boolean;
  status: StoryStatusDB;
  created_at: string;
  updated_at: string;
}

export type CommentRow = {
  id: string;
  story_id: string;
  author_id: string;
  body: string;
  created_at: string;
}

export type StoryReactionRow = {
  story_id: string;
  profile_id: string;
  type: ReactionTypeDB;
  created_at: string;
}

export type SavedStoryRow = {
  profile_id: string;
  story_id: string;
  created_at: string;
}

export type CompanyFollowRow = {
  profile_id: string;
  company_id: string;
  created_at: string;
}

export type UserFollowRow = {
  follower_id: string;
  followee_id: string;
  created_at: string;
}

export type NotificationRow = {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  type: NotificationTypeDB;
  story_id: string | null;
  company_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export type ContentReportRow = {
  id: string;
  reporter_id: string;
  story_id: string | null;
  comment_id: string | null;
  reason: string;
  status: 'open' | 'reviewing' | 'resolved';
  created_at: string;
}

export type VerificationRequestRow = {
  id: string;
  profile_id: string;
  employment_id: string | null;
  evidence_path: string | null;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export type StoryReactionCountRow = {
  story_id: string;
  helpful_count: number;
  been_there_count: number;
}

export type CompanyStoryCountRow = {
  company_id: string;
  story_count: number;
}

export type CompanyTopicStatRow = {
  company_id: string;
  topic: string;
  mentions: number;
  percent: number;
}

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type View<Row> = {
  Row: Row;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      companies: Table<CompanyRow>;
      profiles: Table<ProfileRow>;
      employment_history: Table<EmploymentRow>;
      stories: Table<StoryRow>;
      comments: Table<CommentRow>;
      story_reactions: Table<StoryReactionRow>;
      saved_stories: Table<SavedStoryRow>;
      company_follows: Table<CompanyFollowRow>;
      user_follows: Table<UserFollowRow>;
      notifications: Table<NotificationRow>;
      content_reports: Table<ContentReportRow>;
      verification_requests: Table<VerificationRequestRow>;
    };
    Views: {
      story_reaction_counts: View<StoryReactionCountRow>;
      company_story_counts: View<CompanyStoryCountRow>;
      company_topic_stats: View<CompanyTopicStatRow>;
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
