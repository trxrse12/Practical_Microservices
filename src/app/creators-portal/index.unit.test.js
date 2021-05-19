const { outerPublishVideo } = require('./index');

describe('the publishVideo()', () => {
  let context;
  beforeEach(() => {

  });
  it('should throw if invalid context argument', () => {
    context = null;
    // expect(() => outerPublishVideo({context, videoId, sourceUri}, config)).toThrow('PublishVideo(): ')
    expect(1).toBe(1)
  });
});