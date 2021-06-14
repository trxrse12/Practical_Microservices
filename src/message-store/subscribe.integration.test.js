const uuid = require('uuid/v4');
const { config, reset } = require('../integration-test-helpers');

describe('In the subscribe module', () => {
  afterAll(() => {
    config.db
      .then(client => client.destroy())

    config.messageStore.stop()
  })
  it.only('Subscribe resumes from the last position', async () => {
    const subscriberId = 'component:subscriberId';
    const category = `stream${uuid().replace(/-/g, '')}`;
    const streamName = `${category}-123`;

    let handledMessageCount = 0;

    const handlers = {
      test: () => {
        handledMessageCount++;

        return Promise.resolve(true);
      },
    };


    const testMessage = () => ({ id: uuid(), type: 'test', data: {} });

    try{
      const subscription = config.messageStore.createSubscription({
        streamName: category,
        handlers,
        subscriberId,
      });

      console.log('SSSSSSSSSSSSSSSSSSSSSSss subscription=', subscription);

      await reset()
        .then(() => config.messageStore.write(streamName, testMessage()))
        .then(() => config.messageStore.write(streamName, testMessage()))
        .then(() => config.messageStore.readLastMessage(streamName))
        .then(lastMessage => subscription.writePosition(lastMessage.globalPosition))
        .then(() => {
          config.messageStore.write(streamName, testMessage())
        })
        .then(() => config.messageStore.write('otherStream', testMessage()))
        .then(() => config.messageStore.write('otherStream', testMessage()))
        .then(() => config.messageStore.write('otherStream', testMessage()))
        .then(() => subscription.loadPosition())
        .then(() => subscription.tick())
        .then(() => {
          expect(handledMessageCount).toBe(1);
        })
    } catch (e) {
      throw new Error(e?.message);
    }
  });
});
