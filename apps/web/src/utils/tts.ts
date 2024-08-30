import { CEventEmitter } from './events';

export interface SpeechResult {
  promise: Promise<SpeechSynthesisEvent>;
  cancel: () => void;
}

export class SpeechOutputAdapter {
  public onSpeaking = new CEventEmitter<(response?: SpeechResult) => void>();

  async speakResponse(text: string): Promise<void> {
    const result = this.speak(text);
    this.onSpeaking.emit(result);
    await result.promise;
    this.onSpeaking.emit(undefined);
  }

  private speak(words: string): SpeechResult {
    const mainVoice = speechSynthesis.getVoices().find(voice => voice.name === 'Samantha');
    const utterance = new SpeechSynthesisUtterance(words);
    utterance.voice = mainVoice!;

    return {
      promise: new Promise((resolve) => {
        utterance.onend = resolve;
        speechSynthesis.speak(utterance)
      }),

      cancel: () => speechSynthesis.cancel()
    }
  }
}
