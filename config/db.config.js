import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config()

const NODE_ENV = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/database',
  {
    dialect: 'postgres',
    logging: NODE_ENV === 'development' ? console.log : false,  //make it true to see verbose logs
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;