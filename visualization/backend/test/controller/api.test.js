const express = require('express');
const request = require('supertest');

const csvService = require('../../src/services/csvService');
const apiRoute = require('../../src/controller/api');

jest.mock('../../src/services/csvService');
describe('api', () => {
  const app = express();
  app.use(apiRoute);
  beforeEach(() => {
    csvService.getData.mockReturnValue({ columns: { exposed: [2, 3], hour: [1, 2] } });
    csvService.getHeaders.mockReturnValue({ headers: ['hour', 'susceptible'] });
  });

  it('should get data', async () => {
    await request(app)
      .get('/data')
      .expect(200)
      .expect({ columns: { exposed: [2, 3], hour: [1, 2] } });
    expect(csvService.getData).toHaveBeenCalled();
  });

  it('should get data for requested columns', async () => {
    await request(app)
      .get('/data')
      .query({ columns: ['expose', 'hour'] })
      .expect(200)
      .expect({ columns: { exposed: [2, 3], hour: [1, 2] } });
    expect(csvService.getData).toHaveBeenCalledWith(['expose', 'hour']);
  });

  it('should get headers', async () => {
    await request(app)
      .get('/headers')
      .expect(200)
      .expect({ headers: ['hour', 'susceptible'] });
    expect(csvService.getHeaders).toHaveBeenCalled();
  });
});
