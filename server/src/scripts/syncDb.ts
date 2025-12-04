import sequelize from '../config/database';
import '../models';

const syncDatabase = async () => {
  try {
    console.log('🔄 Connecting to database...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    console.log('🔄 Synchronizing database models...');
    
    // Use { force: true } to drop and recreate tables (use with caution)
    // Use { alter: true } to update tables to match models
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database models synchronized successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    process.exit(1);
  }
};

syncDatabase();
