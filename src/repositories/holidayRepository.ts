import { Op, Transaction } from 'sequelize';
import Holiday, { HolidayCreationAttributes } from '../models/holiday';

class HolidayRepository {
  public async create(data: HolidayCreationAttributes): Promise<Holiday> {
    return Holiday.create(data);
  }

  public async findByCountryAndYear(country: string, year: number): Promise<Holiday[]> {
    return Holiday.findAll({ where: { country, year } });
  }

  public async bulkCreate(data: HolidayCreationAttributes[]): Promise<Holiday[]> {
    return Holiday.bulkCreate(data);
  }

  public async findHolidayInDaterange(startDate: Date, endDate: Date, transaction?: Transaction){
    return Holiday.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      transaction,
    });
  }
}

export default new HolidayRepository();
