import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';

export const convertToTimezone = (req: Request, res: Response, next: NextFunction) => {
  const timezone = req.query.timezone as string;

  if (!timezone) {
    return next();
  }

  res.locals.timezone = timezone;

  const originalJson = res.json.bind(res);

  res.json = (data: any) => {
    if (Array.isArray(data)) {
      data = data.map((item) => convertDates(item, timezone));
    } else {
      data = convertDates(data, timezone);
    }

    return originalJson(data);
  };

  next();
};

const convertDates = (data: any, timezone: string) => {
  const dateFields = ['created_at', 'modified_at'];

  dateFields.forEach((field) => {
    if (data[field]) {
      data[field] = moment.utc(data[field]).tz(timezone).format();
    }
  });

  return data;
};
