import { CEventEmitter } from './events';

export interface SpeechResult {
  promise: Promise<SpeechSynthesisEvent>;
  cancel: () => void;
}

export class SpeechOutputAdapter {
  public onSpeaking = new CEventEmitter<(response?: SpeechResult) => void>();
  private mainVoice?: SpeechSynthesisVoice;

  constructor() {
    this.setVoice();
  }

  async speakResponse(text: string): Promise<void> {
    const result = this.speak(text);
    this.onSpeaking.emit(result);
    await result.promise;
    this.onSpeaking.emit(undefined);
  }

  private speak(words: string): SpeechResult {
    const utterance = new SpeechSynthesisUtterance(words);
    utterance.voice = this.mainVoice!;

    return {
      promise: new Promise((resolve) => {
        utterance.onend = resolve;
        speechSynthesis.speak(utterance)
      }),

      cancel: () => speechSynthesis.cancel()
    }
  }

  private setVoice() {
    speechSynthesis.onvoiceschanged = () => {
      this.mainVoice = speechSynthesis.getVoices().find(voice => voice.name === 'Samantha');
    }
  }
}
