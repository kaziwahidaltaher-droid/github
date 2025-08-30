/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// A type alias for the listener function.
type Listener = (...args: any[]) => void;

/**
 * A simple, generic event emitter class for handling custom events.
 */
export class EventEmitter {
  private events: { [eventName: string]: Listener[] } = {};

  /**
   * Registers a listener for a given event.
   * @param eventName The name of the event to listen for.
   * @param listener The callback function to execute.
   * @returns A function to unsubscribe the listener.
   */
  on(eventName: string, listener: Listener): () => void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
    
    // Return an "unsubscribe" function for easy cleanup.
    return () => this.off(eventName, listener);
  }

  /**
   * Removes a listener for a given event.
   * @param eventName The name of the event.
   * @param listener The specific listener function to remove.
   */
  off(eventName: string, listener: Listener): void {
    const listeners = this.events[eventName];
    if (!listeners) {
      return;
    }

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Emits an event, calling all registered listeners with the provided arguments.
   * @param eventName The name of the event to emit.
   * @param args The arguments to pass to the listeners.
   */
  emit(eventName: string, ...args: any[]): void {
    const listeners = this.events[eventName];
    if (!listeners) {
      return;
    }
    // Call each listener with the provided arguments.
    listeners.forEach(listener => listener(...args));
  }
}