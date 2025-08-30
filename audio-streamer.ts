/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { EventEmitter } from './event-emitter';
import { AudioRecorder } from './audio-recorder';
import { Analyser } from './analyser';

type MicStatus = 'idle' | 'starting' | 'active' | 'error';

/**
 * Manages the entire audio pipeline, from microphone capture to analysis.
 * Provides a simple interface for the UI to start/stop and consume audio data.
 */
export class AudioStreamer extends EventEmitter {
  private recorder: AudioRecorder;
  private analyser: Analyser | null = null;
  private status: MicStatus = 'idle';

  constructor() {
    super();
    this.recorder = new AudioRecorder();

    // Forward events from the recorder
    this.recorder.on('start', () => this.handleStreamStart());
    this.recorder.on('stop', () => this.handleStreamStop());
    this.recorder.on('error', (err) => this.handleStreamError(err));
  }

  private setStatus(newStatus: MicStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.emit('status', this.status);
    }
  }
  
  private handleStreamStart() {
    const audioContext = this.recorder.getAudioContext();
    const sourceNode = this.recorder.getSourceNode();

    if (audioContext && sourceNode) {
      this.analyser = new Analyser(audioContext, sourceNode);
      this.emit('analyser', this.analyser);
      this.setStatus('active');
    } else {
        this.handleStreamError(new Error("AudioContext or source node not available after start."));
    }
  }

  private handleStreamStop() {
    if (this.analyser) {
        this.analyser.disconnect();
        this.analyser = null;
        this.emit('analyser', undefined);
    }
    this.setStatus('idle');
  }

  private handleStreamError(error: Error) {
    console.error("AudioStreamer Error:", error);
    this.setStatus('error');
    this.handleStreamStop(); // Ensure cleanup
  }

  public async start() {
    if (this.status === 'idle' || this.status === 'error') {
      this.setStatus('starting');
      try {
        await this.recorder.start();
      } catch (error) {
        // The error handler will be called via the event listener
      }
    }
  }

  public stop() {
    this.recorder.stop();
  }
  
  public getStatus(): MicStatus {
      return this.status;
  }

  public getAnalyser(): Analyser | undefined {
    return this.analyser ?? undefined;
  }

  public isRecordingActive(): boolean {
      return this.recorder.isRecordingActive();
  }
}