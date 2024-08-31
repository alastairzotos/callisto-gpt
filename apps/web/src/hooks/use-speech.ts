import { create } from 'zustand';
import { useCallisto } from './use-callisto';
import { SpeechInputAdapter } from '@/utils/stt';

interface SpeechValues {
  _input?: SpeechInputAdapter;
  _queue: string[];
  listening: boolean;
  interimText: string;
  speechResultText: string;

  speaking: boolean;
  _audioBufferSourceNode?: AudioBufferSourceNode;
}

interface SpeechActions {
  configure: () => void;
  listen: () => void;
  speak: (input: string) => void;
  cancelSpeech: () => void;
  _processQueue: () => void;
}

export type SpeechState = SpeechValues & SpeechActions;

const createSpeechState = (initialValues: SpeechValues) =>
  create<SpeechState>((set, self) => ({
    ...initialValues,

    configure: () => {
      if (!self()._input) {
        const input = new SpeechInputAdapter();
        input.onListening.attach(listening => set({ listening }));
        input.onResult.attach(async transcript => useCallisto.getState().chat(transcript));

        input.onInterim.attach(text => set({ interimText: text }));
        input.onResult.attach(async result => set({ speechResultText: result }));
        input.onListening.attach(listening => {
          if (listening) {
            set({ speechResultText: '' });
          }
        })

        set({ _input: input });
      }
    },

    listen: () => {
      self()._input?.startRecognition();
    },

    speak: (input) => {
      if (input.trim().length > 0) {
        set({ _queue: [...self()._queue, input.trim()] });
        self()._processQueue();
      }
    },

    _processQueue: () => {
      if (self().speaking) {
        return;
      }

      if (self()._queue.length > 0) {
        const input = self()._queue[0];

        set({
          _queue: self()._queue.slice(1),
          speaking: true,
        });

        const audioCtx = new AudioContext();

        fetch(`${useCallisto.getState().currentServer}/api/v1/chat/speech?input=${input}`)
          .then(res => res.arrayBuffer())
          .then(buffer => audioCtx.decodeAudioData(buffer))
          .then(decodedAudio => {
            const audioBufferSourceNode = audioCtx.createBufferSource();
            audioBufferSourceNode.buffer = decodedAudio;

            audioBufferSourceNode.onended = () => {
              set({ speaking: false, _audioBufferSourceNode: undefined });
              self()._processQueue();
            }

            set({ _audioBufferSourceNode: audioBufferSourceNode })

            audioBufferSourceNode.connect(audioCtx.destination);
            audioBufferSourceNode.start(audioCtx.currentTime);
          })
          .catch(console.error);
      }
    },

    cancelSpeech: () => {
      self()._audioBufferSourceNode?.stop();
    }
  }));

export const useSpeech = createSpeechState({
  _queue: [],
  listening: false,
  interimText: '',
  speechResultText: '',
  speaking: false,
});
