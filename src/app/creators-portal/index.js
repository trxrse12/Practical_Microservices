const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { flipConfig } = require('../../utils');

function outerPublishVideo({ context, videoId, sourceUri }, config) {
  console.log('TTTTTTTTTTTTTTTTTTTTTTTTT context=', context);
  console.log('UUUUUUUUUUUUUUUUUUUUUUUUU videoId=', videoId);
  console.log('VVVVVVVVVVVVVVVVVVVVVVVVV sourceUri=', sourceUri);
  console.log('XXXXXXXXXXXXXXXXXXXXXXXXX config=', config);

  if (!config) {
    throw new TypeError('Invalid config')
  }

  const publishVideoCommand = {
    id: uuidv4(),
    type: 'PublishVideo',
    metadata: {
      traceId: context?.traceId,
      userId: context?.userId,
    },
    data: {
      ownerId: context?.userId,
      sourceUri, // comes from the req object
      videoId, // comes from the req object
    },
  };
  const streamName = `videoPublishing:command-${videoId}`;
  return config?.messageStore?.write(streamName, publishVideoCommand);
}

function createActions({ messageStore, queries }) {
  const config = { messageStore, queries };
  config.innerFunction = (context, videoId, sourceUri) =>
    outerPublishVideo.bind(
      null,
      { context, videoId, sourceUri },
      {
        messageStore: config.messageStore,
        queries: config.queries,
      }
    )();
  return {
    publishVideo: config.innerFunction,
  };
}

function createHandlers({ actions, queries }) {
  function handlePublishVideo(req, res, next) {
    return actions
      .publishVideo(req.context, req.body.videoId, req.body.url)
      .then(() => res.json('"ok"'))
      .catch(next);
  }

  function handleShowVideo(req, res, next) {
    const videoId = req.params.id;
    const ownerId = req.context.userId;

    return queries.videoByIdAndOwnerId(videoId, ownerId).then((video) => {
      const template = video
        ? 'creators-portal/templates/video'
        : 'common-templates/404';
    });
  }

  return {
    handlePublishVideo,
  };
}

function createQueries({ db }) {
  return {};
}

function createCreatorsPortal({ db, messageStore }) {
  const queries = createQueries({ db });
  const actions = createActions({ messageStore, queries });
  const handlers = createHandlers({ actions, queries });

  const router = express.Router();
  router
    .route('/publish-video')
    .post(bodyParser.json(), handlers.handlePublishVideo);
  // router.route('/videos/:id').get(handlers.handleShowVideo);
  // router.route('/').get(handlers.handleDashboard);

  // console.log('Creators-portal app started');

  return { handlers, router };
}

module.exports = createCreatorsPortal;

// for unit testing purposes
module.exports.outerPublishVideo = outerPublishVideo;
