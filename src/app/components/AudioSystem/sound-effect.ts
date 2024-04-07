export async function fetchSoundEffect(url: string, context: AudioContext) {
  const response = await fetch(url);
  const audioData = await response.arrayBuffer();

  return await context.decodeAudioData(audioData);
}

export function createSoundEffectSource(
  context: AudioContext,
  buffer: AudioBuffer,
  destination: AudioNode,
  loop: boolean = false,
  onEnd?: () => void,
) {
  const audioSource = context.createBufferSource();
  audioSource.buffer = buffer;
  audioSource.loop = loop;

  if (onEnd) {
    audioSource.addEventListener('ended', onEnd);
  }

  audioSource.connect(destination);

  return audioSource;
}
