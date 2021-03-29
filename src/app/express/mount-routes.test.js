import express from 'express';
import mountRoutes from './mount-routes';
import request from 'supertest';
import bodyparser from 'body-parser';

const app = express(); // create a fake express app
app.use(bodyparser.json()); //this made it work
const config = {}; // create a mocked config object, that contains the mocked route
config.homePageAggregator = {};
config.homePageAggregator.router = jest.fn((req, res) => {
  res.status(200);
  res.send([{
    state: "NJ",
    capital: "Trenton",
  }])
});

config.recordViewingsApp = {};
config.recordViewingsApp.router = jest.fn((req,res) => Promise.resolve({
  state: "WA",
  capital: "Seattle",
}));

describe('function mountRoutes', () => {
  it('throws if the app is not a valid Express app', () => {
    const badApp = {};
    expect(() => {
      mountRoutes(badApp, config);
    }).toThrow('Invalid Express app object parameter')
  });
  it('throws if the config Express app doesn\'t have a valid handler', async () => {
    const badConfig = {};
    expect(body => {
       mountRoutes(app,badConfig);
    }).toThrow('Invalid route handler');
  });
  it('mounts the config.homeApp.router middleware if is a valid handler', async () => {
    const mountResult = await mountRoutes(app,config); // mount the fake route
    const {body} = await request(app).get('/');
    expect(body).toEqual([
      {
        state: "NJ",
        capital:"Trenton"
      }
    ])
  });
});

