declare module 'elevenlabs-node' {
  export type Voice = {
    voice_id: string;
    name: string;
    category?: string;
    description?: string;
    samples?: any[];
    settings?: any;
  };

  export interface ElevenLabsOptions {
    apiKey: string;
    voiceId?: string;
  }

  export interface TextToSpeechOptions {
    voiceId: string;
    textInput: string;
    fileName: string;
    stability?: number;
    similarityBoost?: number;
    modelId?: string;
    style?: number;
    speakerBoost?: boolean;
  }

  export default class ElevenLabs {
    constructor(options: ElevenLabsOptions);
    
    textToSpeech(params: TextToSpeechOptions): Promise<void>;
    textToSpeechStream(params: Omit<TextToSpeechOptions, 'fileName'> & { responseType?: string }): Promise<any>;
    editVoiceSettings(params: { voiceId: string; stability: number; similarityBoost: number }): Promise<any>;
    getVoiceSettings(params: { voiceId: string }): Promise<any>;
    deleteVoice(params: { voiceId: string }): Promise<any>;
    getVoice(params: { voiceId: string }): Promise<Voice>;
    getVoices(): Promise<Voice[]>;
    getModels(): Promise<any[]>;
    getDefaultVoiceSettings(): Promise<any>;
    getUserInfo(): Promise<any>;
    getUserSubscription(): Promise<any>;
  }
}