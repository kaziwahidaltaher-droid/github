/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { EventEmitter } from './event-emitter';

/**
 * Manages audio recording from the user's microphone using a high-performance
 * AudioWorklet.
 */
export class AudioRecorder extends EventEmitter {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private isRecording = false;

  constructor() {
    super();
  }

  /**
   * Starts the audio recording process.
   * Requests microphone access, sets up the AudioContext and AudioWorklet,
   * and begins streaming audio data.
   */
  async start(): Promise<void> {
    if (this.isRecording) {
      console.warn('Audio recorder is already active.');
      return;
    }
    
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      
      // The build environment is expected to make the worklet script available.
      await this.audioContext.audioWorklet.addModule('audio-recorder-worklet.ts');
      
      this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.workletNode = new AudioWorkletNode(this.audioContext, 'audio-recorder-processor');
      
      this.workletNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
        // Emit the raw audio data for consumers (e.g., visualizers).
        this.emit('data', event.data);
      };
      
      this.microphone.connect(this.workletNode);
      // We don't connect to the destination, as we only want to process the audio, not play it back.

      this.isRecording = true;
      this.emit('start');
    } catch (error) {
      console.error('Failed to start audio recorder:', error);
      this.emit('error', error);
      this.stop(); // Ensure cleanup on failure.
      throw error;
    }
  }

  /**
   * Stops the audio recording and cleans up all associated resources.
   */
  stop(): void {
    if (!this.isRecording && !this.mediaStream) {
      return;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }

    if (this.workletNode) {
        this.workletNode.port.onmessage = null;
        this.workletNode.disconnect();
        this.workletNode = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isRecording = false;
    this.emit('stop');
  }

  /**
   * Returns the current recording state.
   * @returns {boolean} True if recording is active, otherwise false.
   */
  isRecordingActive(): boolean {
      return this.isRecording;
  }

  /**
   * Returns the underlying AudioContext.
   * @returns {AudioContext | null} The active AudioContext or null.
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Returns the MediaStreamAudioSourceNode from the microphone.
   * @returns {MediaStreamAudioSourceNode | null} The source node or null.
   */
  getSourceNode(): MediaStreamAudioSourceNode | null {
    return this.microphone;
  }
}