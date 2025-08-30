/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Fix for TypeScript not recognizing AudioWorkletGlobalScope types.
// These are available in the AudioWorklet execution context.
declare class AudioWorkletProcessor {
  readonly port: MessagePort;
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean;
}

declare function registerProcessor(
  name: string,
  processorCtor: new (options?: any) => AudioWorkletProcessor
): void;

/**
 * This AudioWorkletProcessor runs in a separate thread to process audio data.
 * Its purpose is to receive raw audio buffers from the microphone input and
 * forward them to the main thread for further processing (e.g., visualization).
 */
class AudioRecorderProcessor extends AudioWorkletProcessor {
  /**
   * This method is called for each block of audio data.
   * @param inputs - An array of inputs, each with an array of channels.
   *                 For a mono microphone, this will be inputs[0][0].
   */
  process(inputs: Float32Array[][]): boolean {
    // We expect a single input with a single channel (mono).
    const input = inputs[0];
    const channelData = input?.[0];

    if (channelData) {
      // Post a copy of the raw audio data (Float32Array) back to the main thread.
      // A copy is important to avoid transferring ownership and potential race conditions.
      this.port.postMessage(channelData.slice(0));
    }

    // Return true to keep the processor alive.
    return true;
  }
}

// Register the processor with the name that the main thread will use to instantiate it.
registerProcessor('audio-recorder-processor', AudioRecorderProcessor);