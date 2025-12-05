import sequelize from '../config/database';
import User from '../models/User';
import Reflection from '../models/Reflection';
import SearchHistory from '../models/SearchHistory';

/**
 * Migrate database - Create/update all tables
 */
async function migrate() {
  try {
    console.log('🚀 Starting database migration...');

    // Sync all models
    await sequelize.sync({ alter: true });

    console.log('✅ Database migration completed successfully!');
    console.log('✅ Tables created/updated:');
    console.log('   - users');
    console.log('   - reflections');
    console.log('   - search_history');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
