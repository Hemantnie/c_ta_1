import { Sequelize } from 'sequelize';
import Employee from './employee';
import Address from './address';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

// Initialize models
Employee.initialize(sequelize);
Address.initialize(sequelize);

// Setup associations
Employee.associate();
Address.associate();

export default sequelize;
