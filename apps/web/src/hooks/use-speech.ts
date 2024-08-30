import { create } from 'zustand';
import { useCallisto } from './use-callisto';
import { SpeechInputAdapter } from '@/utils/stt';

interface SpeechValues {
  input?: SpeechInputAdapter;
  listening: boolean;

  speaking: boolean;
  audioBufferSourceNode?: AudioBufferSourceNode;
}

interface SpeechActions {
  configure: () => void;
  speak: (input: string) => void;
  cancelSpeech: () => void;
}

export type SpeechState = SpeechValues & SpeechActions;

const createSpeechState = (initialValues: SpeechValues) =>
  create<SpeechState>((set, self) => ({
    ...initialValues,

    configure: () => {
      if (!self().input) {
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

        set({ input });
      }
    },

    speak: (input) => {
      set({ speaking: true });

      const audioCtx = new AudioContext();

      fetch(`http://localhost:7000/api/v1/chat/speech?input=${input}`)
        .then(res => res.arrayBuffer())
        .then(buffer => audioCtx.decodeAudioData(buffer))
        .then(decodedAudio => {
          const audioBufferSourceNode = audioCtx.createBufferSource();
          audioBufferSourceNode.buffer = decodedAudio;

          audioBufferSourceNode.onended = () => {
            set({ speaking: false, audioBufferSourceNode: undefined });
          }

          set({ audioBufferSourceNode })

          audioBufferSourceNode.connect(audioCtx.destination);
          audioBufferSourceNode.start(audioCtx.currentTime);
        });
    },

    cancelSpeech: () => {
      self().audioBufferSourceNode?.stop();
    }
  }));

export const useSpeech = createSpeechState({
  listening: false,
  speaking: false,
});
