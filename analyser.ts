/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A wrapper class for the Web Audio API's AnalyserNode.
 * Provides a simplified interface for retrieving frequency and time-domain data
 * from an audio source, intended for use in audio visualizations.
 */
export class Analyser {
  private analyserNode: AnalyserNode;
  private frequencyData: Uint8Array;
  private timeDomainData: Uint8Array;

  /**
   * Creates an instance of the Analyser.
   * @param audioContext The AudioContext to operate within.
   * @param sourceNode The AudioNode to analyze (e.g., from a microphone or audio element).
   * @param options Optional configuration for the AnalyserNode.
   */
  constructor(
    audioContext: AudioContext,
    sourceNode: AudioNode,
    options: {
      fftSize?: number;
      smoothingTimeConstant?: number;
      minDecibels?: number;
      maxDecibels?: number;
    } = {}
  ) {
    this.analyserNode = audioContext.createAnalyser();

    // Apply configuration options
    this.analyserNode.fftSize = options.fftSize ?? 2048;
    this.analyserNode.smoothingTimeConstant = options.smoothingTimeConstant ?? 0.8;
    this.analyserNode.minDecibels = options.minDecibels ?? -100;
    this.analyserNode.maxDecibels = options.maxDecibels ?? -30;

    // Create data arrays based on the buffer size
    this.frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.timeDomainData = new Uint8Array(this.analyserNode.fftSize);

    // Connect the source node to this analyser
    sourceNode.connect(this.analyserNode);
  }

  /**
   * Updates and returns the current frequency data.
   * The array contains values from 0 to 255 for each frequency bin.
   * @returns A Uint8Array containing the frequency data.
   */
  public getFrequencyData(): Uint8Array {
    this.analyserNode.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  /**
   * Updates and returns the current time-domain (waveform) data.
   * The array contains values from 0 to 255 representing the waveform amplitude.
   * @returns A Uint8Array containing the time-domain data.
   */
  public getTimeDomainData(): Uint8Array {
    this.analyserNode.getByteTimeDomainData(this.timeDomainData);
    return this.timeDomainData;
  }

  /**
   * Calculates the average value of the current frequency data.
   * Useful for driving simple visualizations that respond to overall volume.
   * @returns A number between 0 and 255 representing the average frequency level.
   */
  public getAverageFrequency(): number {
    this.getFrequencyData();
    let sum = 0;
    for (let i = 0; i < this.frequencyData.length; i++) {
      sum += this.frequencyData[i];
    }
    return sum / this.frequencyData.length;
  }

  /**
   * Connects the analyser's output to another AudioNode.
   * This is necessary if you want to hear the audio that is being analyzed.
   * @param destinationNode The AudioNode to connect to (e.g., audioContext.destination).
   */
  public connect(destinationNode: AudioNode): void {
    this.analyserNode.connect(destinationNode);
  }

  /**
   * Disconnects the analyser from all outputs.
   */
  public disconnect(): void {
    this.analyserNode.disconnect();
  }

  /**
   * Returns the underlying AnalyserNode for direct access if needed.
   * @returns The AnalyserNode instance.
   */
  public getNode(): AnalyserNode {
    return this.analyserNode;
  }
}
