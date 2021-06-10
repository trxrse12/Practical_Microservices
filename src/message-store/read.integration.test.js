const uuid = require('uuid/v4');

const { config, reset } = require('../test-helpers');

const makeCategory = () => uuid().replace(/-/g, '');

it('Calling read() in a category returns events in a category', async () => {
  const category1 = makeCategory();
  const category2 = makeCategory();

  const event1 = { id: uuid(), type: 'event1', data: {} };
  const event2 = { id: uuid(), type: 'event2', data: {} };
  const event3 = { id: uuid(), type: 'event3', data: {} };

  try {
    await reset()
      .then(() => config.messageStore.write(`${category1}--1`, event1))
      .then(() => config.messageStore.write(`${category2}--1`, event2))
      .then(() => config.messageStore.write(`${category1}--2`, event3))
      .then(() => config.messageStore.read(category1))
      .then((messages) => {
        expect(messages.length).toBe(2);
        const notInCategory1Messages = messages.find(
          (m) => !m.streamName.includes(category1)
        );
        expect(notInCategory1Messages).toBeUndefined();
      });
  } catch (e) {
    throw new Error(e?.message);
  }
});

it('it reads the last message in a stream', async () => {
  const stream1 = `${makeCategory()}-${uuid()}`; // here the stream name is more complex than the previous test
  const stream2 = `${makeCategory()}-${uuid()}`;

  const event1 = { id: uuid(), type: 'event1', data: {} };
  const event2 = { id: uuid(), type: 'event2', data: {} };
  const event3 = { id: uuid(), type: 'event3', data: {} };
  const event4 = { id: uuid(), type: 'event4', data: {} };

  try {
    await reset()
      .then(() => config.messageStore.write(stream1, event1))
      .then(() => config.messageStore.write(stream1, event2))
      .then(() => config.messageStore.write(stream1, event3))
      .then(() => config.messageStore.write(stream2, event4))
      .then(() => config.messageStore.readLastMessage(stream1))
      .then((message) => {
        expect(message).not.toBeNull();
        expect(message.type).toBe('event3');
      });
  } catch (e) {
    throw new Error(e?.message);
  }
});

it('it reads from the $all stream', async () => {
  const event1 = { id: uuid(), type: 'event1', data: { hi: 'there' } };
  const event2 = { id: uuid(), type: 'event2', data: { hi: 'there' } };
  const event3 = { id: uuid(), type: 'event3', data: { hi: 'there' } };

  // These need to be different categories
  const entityType = makeCategory();
  const streamName1 = `${entityType}-${uuid()}`;
  const streamName2 = `${entityType}:command-${uuid()}`;
  const streamName3 = `${uuid()}+position`;

  try {
    await reset()
      .then(() => config.messageStore.write(streamName1, event1))
      .then(() => config.messageStore.write(streamName2, event2))
      .then(() => config.messageStore.write(streamName3, event3))
      .then(() => config.messageStore.read('$all'))
      .then((messages) => {
        // console.log('MMMMMMMMMMMMMMMMMMMMMM messages=', messages);
        expect(messages.find((m) => m.id === event1.id)).not.toBeUndefined();
        expect(messages.find((m) => m.id === event2.id)).not.toBeUndefined();
        expect(messages.find((m) => m.id === event3.id)).not.toBeUndefined();
      });
  } catch (e) {
    throw new Error(e?.message);
  }
});
