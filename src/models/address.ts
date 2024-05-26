import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Employee from './employee';

interface AddressAttributes {
  address_id: string;
  street: string;
  house_number: string;
  country: string;
  state: string;
  zipcode: string;
  employee_id: string; // Foreign key to Employee
}

interface AddressCreationAttributes extends Optional<AddressAttributes, 'address_id'> {}

class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public address_id!: string;
  public street!: string;
  public house_number!: string;
  public country!: string;
  public state!: string;
  public zipcode!: string;
  public employee_id!: string; // Foreign key to Employee

  public static initialize(sequelize: Sequelize) {
    Address.init(
      {
        address_id: {
          type: DataTypes.UUID,
          defaultValue: uuidv4,
          primaryKey: true,
        },
        street: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        house_number: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        zipcode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        employee_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'addresses',
        timestamps: false,
      }
    );
  }

  public static associate() {
    Address.belongsTo(Employee, {
      foreignKey: 'employee_id',
      as: 'employeeDetail',
    });
  }
}

export { AddressCreationAttributes };
export default Address;
