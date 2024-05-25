import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/models';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import Employee from '../src/models/employee';
import Address from '../src/models/address';
import Holiday from '../src/models/holiday';

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Seed holiday data
  const holidayEntries = [
    {
      holiday_id: uuidv4(),
      country: 'US',
      year: 2024,
      date: new Date(moment().add(3, 'days').toISOString()), // Upcoming holiday
      localName: "Upcoming Holiday",
      name: "Upcoming Holiday"
    },
    {
      holiday_id: uuidv4(),
      country: 'CA',
      year: 2024,
      date: new Date(moment().subtract(1, 'days').toISOString()), // Past holiday
      localName: "Past Holiday",
      name: "Past Holiday"
    }
  ];
  await Holiday.bulkCreate(holidayEntries);

  // Seed employee data
  const employeeEntries = [
    {
      employee_id: uuidv4(),
      name: 'John Doe',
      position: 'Developer',
      email: 'john.doe@example.com',
      salary: 60000,
      created_at: new Date(),
      modified_at: new Date(),
      address: {
        address_id: uuidv4(),
        street: '123 Main St',
        house_number: '456',
        country: 'US',
        state: 'CA',
        zipcode: '12345'
      }
    },
    {
      employee_id: uuidv4(),
      name: 'Jane Smith',
      position: 'Manager',
      email: 'jane.smith@example.com',
      salary: 80000,
      created_at: new Date(),
      modified_at: new Date(),
      address: {
        address_id: uuidv4(),
        street: '789 Elm St',
        house_number: '789',
        country: 'CA',
        state: 'ON',
        zipcode: '67890'
      }
    }
  ];

  for (const emp of employeeEntries) {
    const { address, ...employeeData } = emp;
    const employee = await Employee.create(employeeData);
    await Address.create({ ...address, employee_id: employee.employee_id });
  }
});

describe('Employee API', () => {
  let employeeId: string;
  const employeeData = {
    name: 'Rama Kumar',
    position: 'Developer',
    email: 'Rama.Kumar@example.com',
    salary: 60000,
    address: {
      street: '123 Main St',
      house_number: '456',
      country: 'US',
      state: 'CA',
      zipcode: '12345',
    },
  };

  it('should create a new employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(employeeData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('employee_id');
    employeeId = res.body.employee_id;
  });

  it('should fail to create a new employee with invalid email', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({
        ...employeeData,
        email: 'invalid-email',
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid email format');
  });

  it('should retrieve all employees', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(3);
  });

  it('should retrieve an employee by ID', async () => {
    const res = await request(app).get(`/api/employees/${employeeId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('employee_id', employeeId);
  });

  it('should update an employee', async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .send({
        email: 'Rama.Kumar@google.com',
        salary: 80000,
        address: {
          street: '456 Elm St',
          house_number: '789',
          country: 'US',
          state: 'CA',
          zipcode: '54321',
        },
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', 'Rama.Kumar@google.com');
  });

  it('should fail to update an employee with invalid email', async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .send({
        email: 'invalid-email',
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid email format');
  });

  it('should retrieve public holidays for an employee', async () => {
    const year = new Date().getFullYear();
    const res = await request(app).get(`/api/employees/${employeeId}/holidays/${year}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should delete an employee', async () => {
    const res = await request(app).delete(`/api/employees/${employeeId}`);
    expect(res.status).toBe(204);
  });

  it('should return 404 when retrieving a deleted employee', async () => {
    const res = await request(app).get(`/api/employees/${employeeId}`);
    expect(res.status).toBe(404);
  });

  it('should retrieve employees with upcoming public holidays', async () => {
    const res = await request(app).get('/api/employees/upcoming-holidays');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('John Doe');
  });


  describe('Timezone conversion', () => {
    beforeAll(async () => {
      const res = await request(app)
        .post('/api/employees')
        .send(employeeData);
      employeeId = res.body.employee_id;
    });

    it('should retrieve employee with converted created_at and modified_at in America/New_York timezone', async () => {
      const res = await request(app).get(`/api/employees/${employeeId}?timezone=America/New_York`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('modified_at');

      const createdAtNy = moment.utc(res.body.created_at).tz('America/New_York').format();
      const modifiedAtNy = moment.utc(res.body.modified_at).tz('America/New_York').format();
      const expectedCreatedAt = moment.utc(res.body.created_at).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ssZ');
      const expectedModifiedAt = moment.utc(res.body.modified_at).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ssZ');

      expect(createdAtNy).toBe(expectedCreatedAt);
      expect(modifiedAtNy).toBe(expectedModifiedAt);
    });

    it('should retrieve employee with converted created_at and modified_at in Asia/Tokyo timezone', async () => {
      const res = await request(app).get(`/api/employees/${employeeId}?timezone=Asia/Tokyo`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('modified_at');

      const createdAtTokyo = moment.utc(res.body.created_at).tz('Asia/Tokyo').format();
      const modifiedAtTokyo = moment.utc(res.body.modified_at).tz('Asia/Tokyo').format();
      const expectedCreatedAt = moment.utc(res.body.created_at).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ');
      const expectedModifiedAt = moment.utc(res.body.modified_at).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ');

      expect(createdAtTokyo).toBe(expectedCreatedAt);
      expect(modifiedAtTokyo).toBe(expectedModifiedAt);
    });
  });
});

afterAll(async () => {
  await sequelize.close();
});
