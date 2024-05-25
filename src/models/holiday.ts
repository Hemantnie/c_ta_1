import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

interface HolidayAttributes {
  holiday_id: string;
  country: string;
  year: number;
  date: Date;
  localName: string;
  name: string;
}

interface HolidayCreationAttributes extends Optional<HolidayAttributes, 'holiday_id'> {}

class Holiday extends Model<HolidayAttributes, HolidayCreationAttributes> implements HolidayAttributes {
  public holiday_id!: string;
  public country!: string;
  public year!: number;
  public date!: Date;
  public localName!: string;
  public name!: string;

  public static initialize(sequelize: Sequelize) {
    Holiday.init(
      {
        holiday_id: {
          type: DataTypes.UUID,
          defaultValue: uuidv4,
          primaryKey: true,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        localName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      },
      {
        sequelize,
        tableName: 'holidays',
        timestamps: false,
      }
    );
  }
}

export { HolidayCreationAttributes };
export default Holiday;
