let btn = document.querySelector('.record-btn');

btn.addEventListener('click', async function () {
  let displayStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
  });

  // voiceStream for recording voice with screen recording
  let voiceStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  let tracks = [...displayStream.getTracks(), ...voiceStream.getAudioTracks()];

  let stream = new MediaStream(tracks);

  //needed for better browser support
  const mime = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
    ? 'video/webm; codecs=vp9'
    : 'video/webm';

  let mediaRecorder = new MediaRecorder(displayStream, {
    mimeType: mime,
  });

  let chunks = [];
  mediaRecorder.addEventListener('dataavailable', function (e) {
    chunks.push(e.data);
  });

  mediaRecorder.addEventListener('stop', function () {
    let blob = new Blob(chunks, {
      type: chunks[0].type,
    });

    chunks = [];
    let url = URL.createObjectURL(blob);

    let video = document.querySelector('video');
    video.src = url;

    let a = document.createElement('a');
    const filename = window.prompt('Enter file name');
    a.href = url;
    a.download = `${filename}.webm`;
    a.click();
  });

  //we have to start the recorder manually
  mediaRecorder.start();
});
