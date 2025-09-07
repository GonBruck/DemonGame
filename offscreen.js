// offscreen.js
let audioContext;
let isPlaying = false;
let currentSource = null;
let gainNode = null;

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'PLAY_SOUND') {
        playAudio(msg.soundFile);
    }
    return true;
});

async function playAudio(soundFile) {
  if (isPlaying) {
    console.log('Sound already playing - skipping request');
    return;
  }

  isPlaying = true;
  // Stop any currently playing audio
  try {
    // Stop any currently playing audio
    if (audioContext) {
      audioContext.close();
    }
    
    // Create new audio context
    audioContext = new AudioContext();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.2;
    gainNode.connect(audioContext.destination);
    
    // Fetch and play the sound file
    const response = await fetch(chrome.runtime.getURL(soundFile));
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    currentSource = audioContext.createBufferSource();
    currentSource.buffer = audioBuffer;
    currentSource.connect(gainNode);
    
    // Reset flag when sound ends
    currentSource.onended = () => {
      isPlaying = false;
      currentSource = null;
      console.log('Sound finished playing');
    };
    currentSource.start();
    console.log('Sound started playing');
  } catch (error) {
      console.error('Error playing sound:', error);
      isPlaying = false; // Reset flag on error
  }
}
