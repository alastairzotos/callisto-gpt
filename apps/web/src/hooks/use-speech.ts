import { create } from 'zustand';
import { useCallisto } from './use-callisto';
import { SpeechInputAdapter } from '@/utils/stt';
import { SpeechOutputAdapter, SpeechResult } from '@/utils/tts';

interface SpeechValues {
  input?: SpeechInputAdapter;
  output?: SpeechOutputAdapter;
  speechResult?: SpeechResult;
  listening: boolean;
}

interface SpeechActions {
  configure: () => void;
  cancelSpeech: () => void;
}

export type SpeechState = SpeechValues & SpeechActions;

const createSpeechState = (initialValues: SpeechValues) =>
  create<SpeechState>((set, self) => ({
    ...initialValues,

    configure: () => {
      if (!self().input && !self().output) {
        const input = new SpeechInputAdapter();
        input.onListening.attach(listening => set({ listening }));
        input.onResult.attach(async transcript => useCallisto.getState().chat(transcript));

        input.onInterim.attach(text => useCallisto.getState().setInterimText(text));
        input.onResult.attach(async result => useCallisto.getState().setSpeechResultText(result));
        input.onListening.attach(listening => {
          if (listening) {
            useCallisto.getState().setSpeechResultText('');
          }

          useCallisto.getState().setResponseText('')
        })

        const output = new SpeechOutputAdapter();
        output.onSpeaking.attach(speechResult => set({ speechResult }));

        set({ input, output });
      }
    },

    cancelSpeech: () => {
      if (!!self().speechResult) {
        self().speechResult?.cancel();
        set({ speechResult: undefined });
      }
    }
  }));

export const useSpeech = createSpeechState({
  listening: false
});
