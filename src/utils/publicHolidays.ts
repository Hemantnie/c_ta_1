import axios from 'axios';

const HOLIDAYS_API_BASE_URL = 'https://date.nager.at/Api/v2/PublicHoliday';

export const getPublicHolidays = async (countryCode: string, year: number): Promise<any[]> => {
  try {
    const response = await axios.get(`${HOLIDAYS_API_BASE_URL}/${year}/${countryCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching public holidays:', error);
    return [];
  }
};
