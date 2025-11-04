/*
  # Remove Unnecessary Tables

  1. Removed Tables
    - `chat_rooms` - Not needed for hostel management
    - `messages` - Not needed for hostel management
    - `friend_requests` - Not needed for hostel management
    - `user_queue` - Not needed for hostel management
    - `user_sessions` - Not needed for hostel management (using auth.users instead)
    - `attendance_records` - Not in scope for current application

  2. Retained Tables
    - `users` - Core user data (modified to work with app)
*/

DROP TABLE IF EXISTS user_queue CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS friend_requests CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chat_rooms CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;