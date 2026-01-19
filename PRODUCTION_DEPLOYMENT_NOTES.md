# Production Deployment Notes - Profile Routing

**Date:** January 19, 2026  
**Critical:** Read before deploying

---

## 🚨 Pre-Deployment Checklist

### 1. Username Migration (REQUIRED)

```bash
# Run migration script
node server/scripts/migrate-usernames.js

# Verify all users have usernames
# Should show 0 users without usernames
```

**Status:** ⚠️ **MUST COMPLETE BEFORE DEPLOYMENT**

### 2. Server-Side Redirect Configuration

The server-side redirect middleware is added, but **for SPA routes**, you need to configure redirects at your hosting/CDN level.

#### Option A: Vercel

Add to `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/profile/:id",
      "has": [
        {
          "type": "header",
          "key": "x-profile-id",
          "value": "^[0-9a-fA-F]{24}$"
        }
      ],
      "destination": "/api/users/:id/redirect",
      "permanent": true,
      "statusCode": 308
    }
  ]
}
```

Or use middleware:

```javascript
// vercel.json or middleware.js
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const profileMatch = pathname.match(/^\/profile\/([^\/]+)$/);
  
  if (profileMatch) {
    const param = profileMatch[1];
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(param);
    
    if (isObjectId) {
      // Fetch user and redirect
      // Implementation depends on your setup
    }
  }
}
```

#### Option B: Netlify

Add to `netcel.json` or `_redirects`:

```
/profile/:id  /api/users/:id/redirect  308
```

#### Option C: Nginx

```nginx
location ~ ^/profile/([0-9a-fA-F]{24})$ {
    # Proxy to API to get username, then redirect
    # Or use lua script for dynamic redirect
}
```

#### Option D: Express SPA Server

If serving SPA from Express, add before static file serving:

```javascript
// In server.js, before static file serving
app.use(profileRedirect); // Already added
```

**Note:** The middleware is added but only works if Express serves the SPA. If frontend is separate, configure at hosting level.

### 3. Verify Populated Fields Include Username

Check all `.populate()` calls include `username`:

```bash
# Search for populate calls
grep -r "\.populate" server/src/services/

# Verify username is included in all user populates
```

**Files to check:**
- `server/src/services/event.service.js`
- `server/src/services/group.service.js`
- `server/src/services/user.service.js`

---

## 🔍 Post-Deployment Verification

### 1. Test Profile URLs

- [ ] `/profile/:username` loads correctly
- [ ] `/profile/:id` redirects to `/profile/:username`
- [ ] Direct URL access works (cold load)
- [ ] Social media previews work
- [ ] Search engine crawlers can follow redirects

### 2. Test Navigation

- [ ] Navbar profile link uses username
- [ ] Event host links use username
- [ ] Group organizer/member links use username
- [ ] Edit profile redirect uses username

### 3. Monitor Logs

Watch for:
- Missing username errors
- Redirect failures
- Profile page 404s
- Username generation failures

---

## 🛡️ Safeguards

### Temporary Startup Check (Remove After Migration)

Add to `server/src/server.js` (temporary):

```javascript
// TEMPORARY: Remove after migration verified
const checkUsernames = async () => {
  const User = require('./models/user.model');
  const count = await User.countDocuments({
    $or: [
      { username: { $exists: false } },
      { username: null },
      { username: '' }
    ]
  });
  
  if (count > 0) {
    logger.error(`CRITICAL: ${count} users without usernames`);
    logger.error('Run migration script before starting server');
    process.exit(1);
  }
};

// Call before starting server
await checkUsernames();
```

---

## 📋 Deployment Steps

1. **Run Migration Script**
   ```bash
   node server/scripts/migrate-usernames.js
   ```

2. **Verify Migration**
   - Check database
   - Verify all users have usernames
   - Test profile pages

3. **Configure Redirects**
   - Set up hosting/CDN redirects
   - Test redirect functionality
   - Verify SEO-friendly redirects

4. **Deploy**
   - Deploy backend
   - Deploy frontend
   - Test all profile links

5. **Monitor**
   - Watch logs for errors
   - Monitor redirects
   - Check for missing usernames

---

## ⚠️ Known Limitations

1. **SPA Routes:** Server-side redirect middleware only works if Express serves the SPA. For separate frontend, configure at hosting level.

2. **Populated Fields:** Ensure all `.populate()` calls include `username` field.

3. **Fallbacks:** Temporary `_id` fallbacks exist in EventDetails/GroupDetails. Remove after migration verified (see `MIGRATION_AND_CUTOFF_PLAN.md`).

---

## 📞 Support

If issues arise:
1. Check migration script ran successfully
2. Verify all users have usernames
3. Check populate calls include username
4. Verify redirect configuration
5. Check logs for errors

---

**Last Updated:** January 19, 2026
