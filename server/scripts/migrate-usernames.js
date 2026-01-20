/**
 * Username Migration Script
 * 
 * Generates usernames for existing users who don't have one.
 * This script MUST be run before deploying the username-required changes.
 * 
 * Usage:
 *   node server/scripts/migrate-usernames.js
 * 
 * Or with environment variables:
 *   NODE_ENV=production node server/scripts/migrate-usernames.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const connect = require('../src/config/db');
const logger = require('../src/utils/logger');

/**
 * Generate unique username from email
 */
const generateUniqueUsername = async (email, baseUsername = null) => {
  let username = baseUsername;
  
  // If no base username provided, generate from email
  if (!username && email) {
    const emailPrefix = email.split('@')[0];
    // Remove non-alphanumeric characters, convert to lowercase
    const sanitized = emailPrefix.replace(/[^a-z0-9]/gi, '').toLowerCase();
    // Ensure minimum length
    username = sanitized.length >= 3 ? sanitized : sanitized + '123';
  }
  
  // Ensure username meets requirements
  if (!username || username.length < 3) {
    username = 'user' + Math.floor(Math.random() * 100000);
  }
  
  // Check if username exists, append number if needed
  let finalUsername = username;
  let counter = 1;
  while (await User.findOne({ username: finalUsername })) {
    finalUsername = `${username}${counter}`;
    counter++;
    // Prevent infinite loop
    if (counter > 10000) {
      finalUsername = `${username}${Date.now()}`;
      break;
    }
  }
  
  return finalUsername;
};

/**
 * Main migration function
 */
const migrateUsernames = async () => {
  try {
    logger.info('Starting username migration...');
    
    // Connect to database
    await connect();
    logger.info('Connected to database');
    
    // Find all users without usernames
    const usersWithoutUsernames = await User.find({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: '' }
      ]
    });
    
    logger.info(`Found ${usersWithoutUsernames.length} users without usernames`);
    
    if (usersWithoutUsernames.length === 0) {
      logger.info('No users need migration. Exiting.');
      process.exit(0);
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    // Migrate each user
    for (const user of usersWithoutUsernames) {
      try {
        // Generate unique username
        const username = await generateUniqueUsername(user.email);
        
        // Update user
        user.username = username;
        await user.save();
        
        successCount++;
        logger.info(`✓ Migrated user ${user.email} → username: ${username}`);
      } catch (error) {
        errorCount++;
        logger.error(`✗ Failed to migrate user ${user.email}:`, error.message);
      }
    }
    
    logger.info('\n=== Migration Summary ===');
    logger.info(`Total users processed: ${usersWithoutUsernames.length}`);
    logger.info(`Successfully migrated: ${successCount}`);
    logger.info(`Errors: ${errorCount}`);
    
    if (errorCount > 0) {
      logger.warn('Some users failed to migrate. Please review errors above.');
      process.exit(1);
    }
    
    logger.info('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrateUsernames();
