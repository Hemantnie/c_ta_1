import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Address from './address';

interface EmployeeAttributes {
  employee_id: string;
  name: string;
  position: string;
  email: string;
  salary: number;
  created_at: Date;
  modified_at: Date;
  address?: Address;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'employee_id' | 'created_at' | 'modified_at'> {}

class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public employee_id!: string;
  public name!: string;
  public position!: string;
  public email!: string;
  public salary!: number;
  public created_at!: Date;
  public modified_at!: Date;
  public address?: Address;

  public static initialize(sequelize: Sequelize) {
    Employee.init(
      {
        employee_id: {
          type: DataTypes.UUID,
          defaultValue: uuidv4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        position: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        salary: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        modified_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'employees',
        timestamps: false,
        hooks: {
          beforeCreate: (employee) => {
            employee.created_at = new Date(new Date().toUTCString());
            employee.modified_at = new Date(new Date().toUTCString());
          },
          beforeUpdate: (employee) => {
            employee.modified_at = new Date(new Date().toUTCString());
          },
        },
      }
    );
  }

  public static associate() {
    Employee.hasOne(Address, {
      foreignKey: 'employee_id',
      as: 'address',
    });
  }
}

export { EmployeeCreationAttributes };
export default Employee;
