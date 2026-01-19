const Category = require("../models/category.model");

/**
 * Seed initial categories for SocialUp
 * Run this script to populate the database with default categories
 */
const seedCategories = async () => {
  try {
    const categories = [
      { name: "Events near Seattle, WA", icon: "✨", isSpecial: true, specialType: "events_near", displayOrder: 0 },
      { name: "All events", icon: "👥", isSpecial: true, specialType: "all_events", displayOrder: 1 },
      { name: "New Groups", icon: "🍕", isSpecial: true, specialType: "new_groups", displayOrder: 2 },
      { name: "Social Activities", icon: "🧸", displayOrder: 3 },
      { name: "Hobbies & Passions", icon: "⚽", displayOrder: 4 },
      { name: "Sports & Fitness", icon: "🌳", displayOrder: 5 },
      { name: "Travel & Outdoor", icon: "🧳", displayOrder: 6 },
      { name: "Career & Business", icon: "💻", displayOrder: 7 },
      { name: "Technology", icon: "🏢", displayOrder: 8 },
      { name: "Community & Environment", icon: "🌍", displayOrder: 9 },
      { name: "Identity & Language", icon: "🎮", displayOrder: 10 },
      { name: "Games", icon: "💃", displayOrder: 11 },
      { name: "Dancing", icon: "❤️", displayOrder: 12 },
      { name: "Support & Coaching", icon: "🎵", displayOrder: 13 },
      { name: "Health & Wellbeing", icon: "🧠", displayOrder: 14 },
      { name: "Art & Culture", icon: "🎨", displayOrder: 15 },
      { name: "Science & Education", icon: "🧪", displayOrder: 16 },
      { name: "Pets & Animals", icon: "🐱", displayOrder: 17 },
      { name: "Religion & Spirituality", icon: "🙏", displayOrder: 18 },
      { name: "Writing", icon: "✍️", displayOrder: 19 },
      { name: "Parents & Family", icon: "👶", displayOrder: 20 },
      { name: "Movements & Politics", icon: "✊", displayOrder: 21 },
    ];

    // Clear existing categories (optional - comment out if you want to keep existing)
    // await Category.deleteMany({});

    // Insert categories (skip duplicates)
    for (const category of categories) {
      await Category.findOneAndUpdate(
        { name: category.name },
        category,
        { upsert: true, new: true }
      );
    }

    console.log("✅ Categories seeded successfully!");
    return categories;
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  const connect = require("../configs/db");
  connect()
    .then(() => seedCategories())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedCategories;
