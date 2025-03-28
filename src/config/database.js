const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Unable to connect to PostgreSQL:', err));

module.exports = {sequelize};
