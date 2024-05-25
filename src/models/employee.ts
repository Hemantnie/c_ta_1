import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './index';
import { v4 as uuidv4 } from 'uuid';

interface EmployeeAttributes {
  employee_id: string;
  name: string;
  position: string;
  email: string;
  salary: number;
  created_at: Date;
  modified_at: Date;
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
}

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
  }
);

export default Employee;
