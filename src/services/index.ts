/**
 * AfterRole data layer. All Supabase access goes through these services —
 * screens never call the client directly. Guard calls with `isSupabaseConfigured`
 * from '@/lib/supabase' (or the useAuth/useSession hooks) so nothing runs against
 * an unconfigured backend.
 */
export * as auth from './auth';
export * as profiles from './profiles';
export * as companies from './companies';
export * as employment from './employment';
export * as stories from './stories';
export * as comments from './comments';
export * as reactions from './reactions';
export * as follows from './follows';
export * as saves from './saves';
export * as notifications from './notifications';
export * as reports from './reports';
export * as verification from './verification';
