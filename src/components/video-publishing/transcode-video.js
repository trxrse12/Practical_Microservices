const FAKE_TRANSCODING_DESTINATION =
  'https://www.youtube.com/watch?v=GI_P3UtZXAA';

function transcodeVideo(context){
  console.log('I have a video transcoder installed that I\'m calling into this function');

  const {video} = context;
  context.transcodedUri = FAKE_TRANSCODING_DESTINATION;
  console.log(`Transcode ${video.sourceUri} to ${context.transcodedUri}`);

  return context;
}

module.exports = transcodeVideo;