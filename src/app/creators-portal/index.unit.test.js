const { v4: uuid } = require('uuid');
const { outerPublishVideo } = require('./index');
const { fakeContext } = require('../../test-helpers');

describe('the publishVideo()', () => {
  beforeEach(() => {});
  it('should throw if invalid config argument', () => {
    // expect(() => outerPublishVideo({context, videoId, sourceUri}, config)).toThrow('PublishVideo(): ')
    expect(() =>
      outerPublishVideo(
        {
          context: fakeContext,
          videoId: uuid(),
          sourceUri: 'aaa',
        },
        null
      )
    ).toThrow(/Invalid config/);
  });
});
