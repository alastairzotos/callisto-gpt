import { create } from 'zustand';
import { Response } from '@bitmetro/callisto';
import { useSpeech } from './use-speech';

const SELECTED_SERVER_KEY = 'callisto:selected-server';
const SERVERS_KEY = 'callisto:known-servers';

interface CallistoValues {
  threadId?: string;
  pending: boolean;
  responding: boolean;
  response: string[];
}

interface CallistoActions {
  chat: (query: string) => void;
}

type CallistoState = CallistoValues & CallistoActions;

const createCallistoState = (initialValues: CallistoValues) =>
  create<CallistoState>((set, self) => ({
    ...initialValues,

    chat: (query) => {
      set({ pending: true, responding: false, response: [] });

      const url = `http://localhost:7000/api/v1/chat?q=${encodeURIComponent(query)}${self().threadId ? `&tid=${self().threadId}` : ''}`;
      const ev = new EventSource(url);

      ev.onmessage = (evt) => {
        const res = JSON.parse(evt.data) as Response;

        switch (res.type) {
          case 'thread-id':
            set({ threadId: res.data });
            break;

          case 'text':
            set({
              responding: true,
              pending: false,
              response: [...self().response, res.data],
            });
            
            break;

          case 'data':
            console.log(res.data);
            break;

          case 'step-completed':
            set({ response: [...self().response, '\n'] });
            break;

          case 'stop':
            set({ responding: false });
            
            useSpeech.getState().speak(self().response.join(''));

            ev.close();

            break;
        }
      }
    },
  }))

export const useCallisto = createCallistoState({
  pending: false,
  responding: false,
  response: [],
});
