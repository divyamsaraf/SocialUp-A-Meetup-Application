# Profile Routing Audit - Phase 1

**Date:** January 19, 2025  
**Status:** Audit Complete

---

## 🔍 Profile Link Generation Points

### 1. Navbar Component
**File:** `client/src/components/common/Navbar.jsx`

**Issues Found:**
- Line 156: `to={user?.username ? `/profile/${user.username}` : `/profile/${user._id}`}`
- Line 296: `to={user?.username ? `/profile/${user.username}` : `/profile/${user._id}`}`
- **Problem:** Falls back to `_id` if username is missing
- **Impact:** IDs leak into URLs

### 2. EventDetails Page
**File:** `client/src/pages/EventDetails.jsx`

**Issues Found:**
- Line 224: `to={`/profile/${event.hostedBy?._id}`}` - Host link
- Line 253: `to={`/profile/${attendeeData?._id || attendee}`}` - Attendee links
- **Problem:** Always uses `_id`, never username
- **Impact:** All event-related profile links use IDs

### 3. GroupDetails Page
**File:** `client/src/pages/GroupDetails.jsx`

**Issues Found:**
- Line 213: `to={`/profile/${group.organizer?._id}`}` - Organizer link
- Line 242: `to={`/profile/${modData?._id || moderator}`}` - Moderator links
- Line 273: `to={`/profile/${memberData?._id || member}`}` - Member links
- **Problem:** Always uses `_id`, never username
- **Impact:** All group-related profile links use IDs

### 4. EditProfile Page
**File:** `client/src/pages/EditProfile.jsx`

**Issues Found:**
- Line 81: `navigate(`/profile/${user.username || user._id}`)` - Fallback to ID
- Line 380: `onClick={() => navigate(`/profile/${user._id}`)}` - Uses ID directly
- **Problem:** Falls back to `_id` if username missing
- **Impact:** Navigation after profile edit may use ID

### 5. Profile Page
**File:** `client/src/pages/Profile.jsx`

**Issues Found:**
- Line 98: Checks if param is ObjectId: `/^[0-9a-fA-F]{24}$/.test(username)`
- Line 128-134: Tries both `getUserById` and `getUserByUsername` based on param type
- **Problem:** Accepts both ID and username, mixed logic
- **Impact:** Inconsistent behavior, first-load 404 issues

---

## 🔍 Backend Route Analysis

### User Routes
**File:** `server/src/routes/user.routes.js`

**Current Routes:**
- `GET /api/users/username/:username` - Get by username ✅
- `GET /api/users/:id` - Get by ID ⚠️ (conflicts with username route)
- `GET /api/users/:id/events` - Get user events (supports both ID and username)
- `GET /api/users/:id/groups` - Get user groups (ID only)

**Issues:**
- Route order: `/username/:username` comes before `/:id` ✅ (good)
- But `/:id` route will match any string, including usernames
- `getUserEvents` supports both ID and username (mixed logic)

### User Service
**File:** `server/src/services/user.service.js`

**Issues:**
- `getUserEvents` accepts both ID and username (line 53-68)
- Checks if identifier is ObjectId, then decides lookup method
- **Problem:** Mixed identifier logic

### User Model
**File:** `server/src/models/user.model.js`

**Issues:**
- `username` field is optional: `{ type: String, trim: true }`
- No unique constraint on username
- No validation for URL-safe characters
- **Problem:** Username may not exist, may not be unique

---

## 🔍 Absolute URLs Found

**File:** `client/src/pages/Home.jsx`
- Line 43: `window.location.href = `/events?${params.toString()}`;`
- **Note:** This is for search redirect, not profile-related

**File:** `client/src/services/api.js`
- Line 36: `window.location.href = '/login';`
- **Note:** This is for auth redirect, not profile-related

**No localhost URLs found in profile navigation** ✅

---

## 📋 Summary of Issues

### Critical Issues:
1. **Username not required** - Users may not have username
2. **Username not unique** - Database allows duplicates
3. **Mixed identifier logic** - Code accepts both ID and username
4. **ID fallbacks everywhere** - All links fall back to `_id`
5. **Route conflicts** - `/:id` route may match usernames

### Files Requiring Changes:
1. `server/src/models/user.model.js` - Make username required, unique
2. `client/src/components/common/Navbar.jsx` - Remove ID fallback
3. `client/src/pages/EventDetails.jsx` - Use username only
4. `client/src/pages/GroupDetails.jsx` - Use username only
5. `client/src/pages/EditProfile.jsx` - Use username only
6. `client/src/pages/Profile.jsx` - Accept username only, redirect IDs
7. `server/src/routes/user.routes.js` - Add redirect middleware
8. `server/src/services/user.service.js` - Enforce username lookups
9. `server/src/controllers/user.controller.js` - Add redirect logic

---

## 🎯 Data Contract Definition

### Required Contract:
- **Public URL Format:** `/profile/:username`
- **Username Rules:**
  - Required (cannot be null/undefined)
  - Unique (database constraint)
  - Lowercase (normalized)
  - URL-safe (alphanumeric, hyphens, underscores)
  - Minimum length: 3 characters
  - Maximum length: 30 characters

### Internal IDs:
- **MUST NEVER** appear in URLs
- Only used for database relationships
- Not exposed to frontend routing

---

**Audit Complete - Ready for Implementation**
