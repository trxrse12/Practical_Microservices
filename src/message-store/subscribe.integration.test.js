const uuid = require('uuid/v4');
const { config, reset, fakeEvent, createMessageStoreWithWriteSink } = require('../test-helpers');

it('Subscribe resumes from the last position', async () => {
  const subscriberId = 'component:subscriberId';
  const category = `stream${uuid().replace(/-/g, '')}`;
  const streamName = `${category}-123`;

  let handledMessageCount = 0;

  const handlers = {
    test: async () => {
      handledMessageCount++;
      return Promise.resolve(true);
    },
  };

  try{
    const subscription = config.messageStore.createSubscription({
      streamName: category,
      handlers,
      subscriberId,
    });

    // const writes = [];
    // const messageStoreWithWriteSink = createMessageStoreWithWriteSink(writes);

    const testEvent = () => ({ ...fakeEvent, type: 'test', id: uuid() }); // type: test is CRUCIAL

    return await reset()

      .then(() => config.messageStore.write(streamName, testEvent()))
      .then(() => config.messageStore.readLastMessage(streamName))
      .then(() => config.messageStore.write(streamName, testEvent()))
      .then(() => config.messageStore.readLastMessage(streamName))
      .then((lastMessage) =>{
        subscription.writePosition(lastMessage.globalPosition) // saves the position
      })
      .then(() => config.messageStore.readLastMessage(streamName))
      .then((lastMessage) =>{
        subscription.writePosition(lastMessage.globalPosition) // saves the position
      })

      .then(() => config.messageStore.write(streamName, testEvent()))
      .then(() => config.messageStore.readLastMessage(streamName))
      .then((lastMessage) =>{
      })

      .then(() => config.messageStore.write('otherStream', testEvent()))
      .then(() => config.messageStore.readLastMessage('otherStream'))
      .then((lastMessage) => {
      })

      .then(() => config.messageStore.write('otherStream', testEvent()))
      .then(() => config.messageStore.write('otherStream', testEvent()))
      .then(() => config.messageStore.readLastMessage(streamName))
      .then((lastMessage) => {
      })



      .then(async () => {
        const loadedPosition = await subscription.loadPosition();
        return loadedPosition;
      })
      .then(() => config.messageStore.readLastMessage(streamName))
      .then((lastMessage) => {
      })

      // now processes the first two messages in the subscription stream (before saving the subscription)
      .then(async () => {
        await subscription.tick()
      })
      .then(() => {
        expect(handledMessageCount).toBe(1);
      })
  } catch (e) {
    throw new Error(e?.message);
  }
});