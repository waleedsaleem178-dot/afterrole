/**
 * Domain models for AfterRole.
 *
 * Rules baked into the model:
 * - Every Story and Comment references a real `authorId` — there is no anonymity.
 * - Companies have discussed topics / positives / challenges but NO overall score.
 */

export type ID = string;

export interface Employment {
  id: ID;
  companyId?: ID;
  companyName: string;
  role: string;
  location?: string;
  /** Human-friendly start label, e.g. "Aug 2026". */
  startLabel: string;
  /** Human-friendly end label, e.g. "Present" or "2026". */
  endLabel: string;
  current: boolean;
  verified: boolean;
}

export interface User {
  id: ID;
  name: string;
  username: string;
  headline: string;
  location: string;
  bio: string;
  /** Placeholder avatar background color (no real image assets yet). */
  avatarColor: string;
  verified: boolean;
  followerCount: number;
  followingCount: number;
  storyCount: number;
  employment: Employment[];
}

export interface CompanyTopic {
  label: string;
  /** Share of stories that mention this topic (0–100). Not a rating. */
  percent: number;
}

export interface CompanyRoleCategory {
  name: string;
  storyCount: number;
  peopleCount: number;
}

export interface Company {
  id: ID;
  name: string;
  /** e.g. "Technology · Entertainment". */
  industry: string;
  /** Headquarters country, e.g. "United States" or "Pakistan". */
  country?: string;
  sizeLabel: string;
  logoColor: string;
  description: string;
  storyCount: number;
  followerCount: number;
  topics: CompanyTopic[];
  positives: string[];
  challenges: string[];
  roleCategories: CompanyRoleCategory[];
}

export type EmploymentEndReason =
  | 'Resigned'
  | 'Laid off'
  | 'Contract ended'
  | 'Terminated'
  | 'Still employed'
  | 'Prefer not to say';

export type WouldWorkAgain = 'Yes' | 'Maybe' | 'No';

export type EmploymentStatus = 'current' | 'former';

export interface Story {
  id: ID;
  authorId: ID;
  companyId: ID;
  /** Role held at the company (professional context). */
  role: string;
  /** e.g. "Former CRM Specialist · 1 yr 8 mos". */
  employmentContext: string;
  employmentStatus: EmploymentStatus;
  endReason?: EmploymentEndReason;
  createdAt: string; // ISO
  excerpt: string;
  body: string;
  finalStraw?: string;
  whatWasGood?: string;
  topics: string[];
  wouldWorkAgain?: WouldWorkAgain;
  helpfulCount: number;
  beenThereCount: number;
  commentCount: number;
  /** Surfaced in the "Final Straws" section on Home. */
  isFinalStraw?: boolean;
}

export interface Comment {
  id: ID;
  storyId: ID;
  authorId: ID;
  body: string;
  createdAt: string;
  helpfulCount: number;
}

export type NotificationType =
  | 'helpful'
  | 'comment'
  | 'follow'
  | 'company_stories'
  | 'verification';

export interface AppNotification {
  id: ID;
  type: NotificationType;
  actorId?: ID;
  storyId?: ID;
  companyId?: ID;
  message: string;
  createdAt: string;
  read: boolean;
}

/** Draft captured across the 3-step Create Story flow. */
export interface StoryDraft {
  companyId?: ID;
  companyName?: string;
  role?: string;
  startLabel?: string;
  endLabel?: string;
  current?: boolean;
  endReason?: EmploymentEndReason;
  topics: string[];
  topFactors: string[];
  body?: string;
  finalStraw?: string;
  whatWasGood?: string;
  wouldWorkAgain?: WouldWorkAgain;
  confirmed?: boolean;
}

export type VerificationStatus = 'unverified' | 'pending' | 'verified';
