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
}

export default new HolidayRepository();
