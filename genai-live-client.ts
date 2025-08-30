/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Chat } from "@google/genai";
import { EventEmitter } from './event-emitter';
import { AiConfig } from './AiConfigPanel';

export type ClientStatus = 'idle' | 'initializing' | 'ready' | 'streaming' | 'error';

/**
 * A dedicated client for managing a live, streaming chat session with the Gemini API.
 */
export class GenaiLiveClient extends EventEmitter {
    private ai: GoogleGenAI;
    private chat: Chat | null = null;
    private config: AiConfig | null = null;
    private status: ClientStatus = 'idle';

    constructor(apiKey: string) {
        super();
        if (!apiKey) {
            this.setStatus('error', 'API key is missing.');
            // Cast to satisfy TypeScript, as the client is in an error state.
            this.ai = null as any; 
            return;
        }
        this.ai = new GoogleGenAI({ apiKey });
        this.setStatus('idle');
    }

    private setStatus(status: ClientStatus, details?: any) {
        this.status = status;
        this.emit('status', this.status, details);
    }

    public getStatus(): ClientStatus {
        return this.status;
    }

    /**
     * Initializes a chat session with the given configuration.
     * @param config The AI configuration for the chat session.
     */
    public connect(config: AiConfig) {
        if (!this.ai) return;
        this.config = config;
        this.setStatus('initializing');
        try {
            this.chat = this.ai.chats.create({
                model: this.config.model,
                config: {
                    systemInstruction: this.config.systemInstruction,
                    temperature: this.config.temperature,
                    topK: this.config.topK,
                    topP: this.config.topP,
                }
            });
            this.setStatus('ready');
        } catch (error) {
            console.error("Failed to initialize Gemini AI session:", error);
            this.setStatus('error', 'Failed to initialize AI session.');
        }
    }

    /**
     * Updates the chat session with a new configuration if it has changed.
     * @param newConfig The new AI configuration.
     */
    public updateConfig(newConfig: AiConfig) {
        if (JSON.stringify(this.config) !== JSON.stringify(newConfig)) {
            this.connect(newConfig);
        }
    }

    /**
     * Sends a message to the chat and streams the response.
     * @param message The user's message to send.
     */
    public async sendMessage(message: string) {
        if (!this.chat || this.status !== 'ready') {
            console.warn(`Cannot send message in status: ${this.status}`);
            return;
        }

        this.setStatus('streaming');

        try {
            const responseStream = await this.chat.sendMessageStream({ message });
            let fullResponse = '';
            for await (const chunk of responseStream) {
                // The API may send empty chunks, so we only process those with text.
                if (chunk.text) {
                    const chunkText = chunk.text;
                    fullResponse += chunkText;
                    this.emit('chunk', chunkText);
                }
            }
            this.emit('complete', fullResponse);
            this.setStatus('ready');
        } catch (error) {
            console.error("Gemini API call failed:", error);
            const errorMessage = 'Probe communication channel unstable.';
            this.setStatus('error', errorMessage);
            this.emit('error', errorMessage);
        }
    }

    /**
     * Disconnects the client and clears the chat session.
     */
    public disconnect() {
        this.chat = null;
        this.setStatus('idle');
    }
}