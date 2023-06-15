import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfprobePath(pathToFfprobeExecutable);

ffmpeg.ffprobe(pathToYourVideo, function (err, metadata) {
  if (err) {
    console.error(err);
  } else {
    // metadata should contain 'width', 'height' and 'display_aspect_ratio'
    console.log(metadata);
  }
});
