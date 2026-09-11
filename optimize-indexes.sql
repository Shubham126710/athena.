-- optimize-indexes.sql
-- Run this script in your Supabase SQL Editor to fix the High Disk IO Consumption issue.

-- 1. Index for notes table (frequently ordered by created_at)
-- This prevents full table scans when fetching the latest notes.
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- 2. Index for notifications table (frequently ordered by created_at and limited)
-- This prevents full table scans when fetching the latest 5 notifications for the Hub.
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- 3. Index for sgpa_history table (frequently filtered by user_id and ordered by created_at)
-- This optimizes the SGPA calculator history view for individual users.
CREATE INDEX IF NOT EXISTS idx_sgpa_history_user_created ON sgpa_history(user_id, created_at DESC);
