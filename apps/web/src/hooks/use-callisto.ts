import { create } from 'zustand';
import { Response } from '@bitmetro/callisto';
import { useSpeech } from './use-speech';

const SELECTED_SERVER_KEY = 'callisto:selected-server';
const SERVERS_KEY = 'callisto:known-servers';

interface CallistoValues {
  interimText: string;
  speechResultText: string;
  responseText: string;

  threadId?: string;
  isPending: boolean;
}

interface CallistoActions {
  setInterimText: (text: string) => void;
  setSpeechResultText: (text: string) => void;
  setResponseText: (text: string) => void;

  chat: (query: string) => void;
}

type CallistoState = CallistoValues & CallistoActions;

const createCallistoState = (initialValues: CallistoValues) =>
  create<CallistoState>((set, self) => ({
    ...initialValues,

    setInterimText: text => set({ interimText: text }),
    setSpeechResultText: text => set({ speechResultText: text }),
    setResponseText: text => set({ responseText: text }),

    chat: (query) => {
      set({ isPending: true, responseText: '' });

      const url = `http://localhost:7000/api/v1/chat?q=${encodeURIComponent(query)}${self().threadId ? `&tid=${self().threadId}` : ''}`;
      const ev = new EventSource(url);

      ev.onmessage = (evt) => {
        const res = JSON.parse(evt.data) as Response;

        switch (res.type) {
          case 'thread-id':
            set({ threadId: res.data });
            break;

          case 'text':
            set({ responseText: self().responseText + res.data });
            break;

          case 'data':
            console.log(res.data);
            break;

          case 'step-completed':
            set({ responseText: self().responseText + '\n' });
            break;

          case 'stop':
            set({ isPending: false });
            
            useSpeech.getState().speak(self().responseText);

            ev.close();

            break;
        }
      }
    },
  }))

export const useCallisto = createCallistoState({
  interimText: '',
  speechResultText: '',
  responseText: '',

  isPending: false,
});
