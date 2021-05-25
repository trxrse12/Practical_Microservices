const hashPassword = require('./hash-password.js');

jest.mock('bcrypt', () => ({
  genSaltSync: () => Promise.resolve('this is genSaltSync()'),
  genSalt: () => Promise.resolve('genSalt()'),
  hashSync: () => Promise.resolve('this is hashSync()'),
  hash: () => (password, saltRounds) => Promise.resolve('xxx'),
}));

describe('hashPassword()', () => {
  it('should throw if context arg is invalid', async () => {
    try {
      const result = await hashPassword(null);
    } catch (e) {
      expect(e?.message).toMatch(/invalid context arg/);
    }
  });
});
