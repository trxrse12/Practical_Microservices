const uuid = require('uuid/v4');

const {
  config,
  createMessageStoreWithWriteSink,
  reset,
} = require('../../test-helpers');
const createIdentityComponent = require('.'); // this is the Build()

it('Processes a valid user Register command and raises a Registered event', async () => {
  const userId = uuid();
  // now define a command according to the contract.md
  const registerCommand = {
    id: uuid(),
    type: 'Register',
    metadata: {
      traceId: uuid(),
      userId,
    },
    data: {
      userId,
      email: 'test@example.com',
      passwordHash: 'notahash',
    },
  };
  registerCommand.streamName = `identity:command-${userId}`;
  const expectedStreamName = `identity-${userId}`;

  try {
    await reset()
      .then(() =>
        config.identityComponent.identityCommandHandlers.Register(
          registerCommand
        )
      )
      // Handle it again to check idempotence
      .then(() =>
        config.identityComponent.identityCommandHandlers.Register(
          registerCommand
        )
      )
      .then(() => config.messageStore.read(expectedStreamName))
      .then((retrievedMessages) => {
        expect(retrievedMessages.length).toBe(1);
        expect(retrievedMessages[0].type).toBe('Registered');
        expect(retrievedMessages[0].metadata.traceId).toBe(
          registerCommand.metadata.traceId
        );
        expect(retrievedMessages[0].data.userId).toBe(
          registerCommand.data.userId
        );
        expect(retrievedMessages[0].data.email).toBe(
          registerCommand.data.email
        );
        expect(retrievedMessages[0].data.passwordHash).toBe(
          registerCommand.data.passwordHash
        );
      });
  } catch (e) {
    throw new Error(e?.message);
  }
});

it('It writes the command to send the registration email', async () => {
  const userId = uuid();
  // the registered event
  const registeredEvent = {
    id: uuid(),
    type: 'Registered',
    metadata: {
      traceId: uuid(),
      userId,
    },
    data: {
      userId,
      email: 'user@example.com',
      passwordHash: 'notahash',
    },
  };

  // We need to see what was written in this test, and we don't know what
  // identifier the Registered handler will use for the email.
  const writes = []; // the array where the fake messageStore.write will do the actual "writing"
  const messageStoreWithWriteSink = createMessageStoreWithWriteSink(writes);
  const identityComponent = createIdentityComponent({
    messageStore: messageStoreWithWriteSink,
  });
  try {
    return await config.messageStore
      .write(`identity-${userId}`, registeredEvent)
      .then(() =>
        identityComponent.identityEventHandlers.Registered(registeredEvent)
      )
      // process the event twice to ensure idempotence
      .then(() =>
        identityComponent.identityEventHandlers.Registered(registeredEvent)
      )
      .then(() => {
        expect(writes.length).toBe(2);
        const sendEmailCommand = writes[0].message;
        expect(sendEmailCommand.type).toBe('Send');
        expect(sendEmailCommand.data.to).toBe(registeredEvent.data.email);
        expect(sendEmailCommand.data.subject).toBe('Welcome to the site!');
        expect(sendEmailCommand.data.html).toBe(
          '<h1>Welcome to the site!</h1>'
        );
        expect(writes[0].stream).toBe(writes[1].stream);
      });
  } catch (e) {
    throw new Error(e?.message);
  }
});

it('Processes a Sent event when it originated it', async () => {
  const userId = uuid();
  // the RegistrationEmailSent event that this component originated
  const sentEvent = {
    id: uuid(),
    type: 'Sent',
    metadata: {
      originStreamName: `identity-${userId}`, // this is very important, it certifies that the email was sent from the indentity component
      traceId: uuid(),
      userId,
    },
    data: {
      emailId: uuid(),
      to: 'to',
      from: 'from',
      subject: 'subject',
      text: 'text',
      html: 'html',
    },
  };
  try {
    return await config.identityComponent.sendEmailEventHandlers.Sent(sentEvent)
      .then(() => config.messageStore.read(`identity-${userId}`))
      .then((retrievedMessages) => {
        expect(retrievedMessages.length).toBe(1);
        expect(retrievedMessages[0].type).toBe('RegistrationEmailSent');
        expect(retrievedMessages[0].data.emailId).toBe(sentEvent.data.emailId);
        expect(retrievedMessages[0].data.userId).toBe(userId);
      });
  } catch (e) {
    throw new Error(e?.message);
  }
});

it('Does not process a Sent event when it did not originated it', async () => {
  const userId = uuid();
  const emailId = uuid();
  // the RegistrationEmailSent event that OTHER component originated
  const sentEmailEvent = {
    id: uuid(),
    type: 'Sent',
    metadata: {
      originStreamName: `notIdentity-${userId}`, // HERE !!! This
      traceId: uuid(),
      userId,
    },
    data: {
      emailId,
      to: 'to',
      from: 'from',
      subject: 'subject',
      text: 'text',
      html: 'html',
    },
  };

  const streamName = `sendEmail-${emailId}`;

  // creates an artifical subscription
  const subscription = config.messageStore.createSubscription({
    streamName: 'sendEmail',
    handlers: config.identityComponent.sendEmailEventHandlers,
    originStreamName: 'identity',
    subscriberId: 'components:identity:sendEmailEvents',
  });

  try {
    return await config.messageStore
      .write(streamName, sentEmailEvent)
      .then(subscription.tick())
      .then(() => config.messageStore.read(`identity-${userId}`))
      .then((retrievedMessages) => {
        expect(retrievedMessages.length).toBe(0);
      });
  } catch (e) {
    throw new Error(e?.message);
  }
});

it('It does not send the email command if email already sent', async () => {
  const userId = uuid();
  // the registered event
  const registered = {
    id: uuid(),
    type: 'Registered',
    metadata: {
      traceId: uuid(),
      userId,
    },
    data: {
      userId,
      email: 'test@example.com',
      passwordHash: 'notahash',
    },
  };
  // the RegistrationEmailSent event
  const registrationEmailSentEvent = {
    id: uuid(),
    type: 'RegistrationEmailSent',
    metadata: {
      traceId: uuid(),
      userId,
    },
    data: {
      emailId: uuid(),
      userId,
    },
  };
  // We need to see what was written in this test, and we don't know what
  // identifier the Registered handler will use for the email.
  const writes = [];
  const messageStoreWithWriteSink = createMessageStoreWithWriteSink(writes);
  const identityComponent = createIdentityComponent({
    messageStore: messageStoreWithWriteSink,
  });

  // First, write the identity events to the actual store
  try {
    return await config.messageStore
      .write(`identity-${userId}`, registered)
      .then(() =>
        config.messageStore.write(`identity-${userId}`, registrationEmailSentEvent)
      )
      // Then use the identityComponent with the write sink
      .then(() =>
        identityComponent.identityEventHandlers.Registered(registered) // will create a Register command
      )
      .then(() => {
        expect(writes.length).toBe(0); // so it didn't write ther Send command
      });
  } catch (e) {
    throw new Error(e?.message);
  }
});
