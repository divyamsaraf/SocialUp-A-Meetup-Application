# Username Migration & Fallback Cutoff Plan

**Date:** January 19, 2026  
**Status:** Critical - Must Complete Before Production

---

## 🚨 Critical: Username Migration Required

### Why Migration Is Required

The user model now enforces:
- ✅ Username is **required**
- ✅ Username is **unique**
- ✅ Username is used for **all profile URLs**

**Existing users without usernames will cause:**
- ❌ Registration failures (if username required)
- ❌ Profile page crashes
- ❌ Navigation errors
- ❌ API failures

---

## 📋 Migration Script

### Location
`server/scripts/migrate-usernames.js`

### Usage

```bash
# Development
node server/scripts/migrate-usernames.js

# Production (with environment variables)
NODE_ENV=production node server/scripts/migrate-usernames.js
```

### What It Does

1. Finds all users without usernames
2. Generates unique usernames from email addresses
3. Updates users in database
4. Reports success/error counts

### Pre-Migration Checklist

- [ ] Backup database
- [ ] Test script on development database first
- [ ] Verify script completes successfully
- [ ] Check for duplicate usernames
- [ ] Verify all users have usernames

### Post-Migration Verification

```javascript
// Verify all users have usernames
db.users.find({ $or: [
  { username: { $exists: false } },
  { username: null },
  { username: '' }
]}).count()
// Should return 0
```

---

## 🔪 Fallback Cutoff Plan

### Current State (Temporary)

**Files with `_id` fallbacks:**
- `client/src/pages/EventDetails.jsx` - Host/attendee links
- `client/src/pages/GroupDetails.jsx` - Organizer/moderator/member links

**Pattern:**
```javascript
to={`/profile/${user?.username || user?._id}`}
```

### Why Fallbacks Exist

- Populated user objects may not always include `username`
- Backward compatibility during migration
- Safety net for edge cases

### ⚠️ Problem

- Allows IDs to leak back into URLs
- Weakens routing contract
- Makes debugging harder
- Inconsistent behavior

---

## 📅 Cutoff Timeline

### Phase 1: Migration (Week 1)
- ✅ Run migration script
- ✅ Verify all users have usernames
- ✅ Monitor for missing usernames
- ✅ Fix any edge cases

### Phase 2: Remove Fallbacks (Week 2)

**Target Date:** [SET DATE AFTER MIGRATION VERIFIED]

**Files to Update:**

1. **EventDetails.jsx**
   ```javascript
   // BEFORE
   to={`/profile/${event.hostedBy?.username || event.hostedBy?._id}`}
   
   // AFTER
   to={`/profile/${event.hostedBy?.username}`}
   ```

2. **GroupDetails.jsx**
   ```javascript
   // BEFORE
   to={`/profile/${group.organizer?.username || group.organizer?._id}`}
   to={`/profile/${modData?.username || modData?._id || moderator}`}
   to={`/profile/${memberData?.username || memberData?._id || member}`}
   
   // AFTER
   to={`/profile/${group.organizer?.username}`}
   to={`/profile/${modData?.username}`}
   to={`/profile/${memberData?.username}`}
   ```

**Pre-Cutoff Checklist:**
- [ ] All users have usernames (verified)
- [ ] All API responses include username in populated fields
- [ ] No errors in logs related to missing usernames
- [ ] Test all profile links work correctly

**Post-Cutoff Actions:**
- [ ] Remove `_id` fallbacks from all files
- [ ] Add error handling for missing username
- [ ] Update tests to expect username only
- [ ] Document that username is always required

---

## 🔍 Ensuring Username in Populated Fields

### Backend Populate Calls

Ensure all `.populate()` calls include `username`:

```javascript
// ✅ GOOD
.populate('hostedBy', 'name username profile_pic')
.populate('organizer', 'name username profile_pic')
.populate('members', 'name username profile_pic')

// ❌ BAD (missing username)
.populate('hostedBy', 'name profile_pic')
```

### Files to Check

- `server/src/services/event.service.js` - Event population
- `server/src/services/group.service.js` - Group population
- `server/src/services/user.service.js` - User queries
- Any other service that populates user data

---

## 🛡️ Safeguards

### Pre-Production Check

Add temporary startup check (remove after migration):

```javascript
// In server startup (temporary)
const usersWithoutUsernames = await User.countDocuments({
  $or: [
    { username: { $exists: false } },
    { username: null },
    { username: '' }
  ]
});

if (usersWithoutUsernames > 0) {
  logger.error(`CRITICAL: ${usersWithoutUsernames} users without usernames`);
  logger.error('Run migration script before starting server');
  process.exit(1);
}
```

### Monitoring

- Log warnings when username is missing
- Alert if username generation fails
- Track username-related errors

---

## ✅ Success Criteria

### Migration Complete When:
- [x] All users have usernames
- [x] No errors in migration script
- [x] All profile links work
- [x] No missing username errors in logs

### Cutoff Complete When:
- [x] All `_id` fallbacks removed
- [x] All links use username only
- [x] Error handling for missing username
- [x] Tests updated
- [x] Documentation updated

---

## 📝 Notes

- **Migration is NOT optional** - required before production
- **Fallbacks are temporary** - remove after migration verified
- **Monitor closely** - watch for edge cases
- **Test thoroughly** - verify all profile links work

---

**Last Updated:** January 19, 2026
