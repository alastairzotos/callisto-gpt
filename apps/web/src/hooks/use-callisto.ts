import { create } from 'zustand';
import { Response } from '@bitmetro/callisto';
import { useSpeech } from './use-speech';
import { getEnv } from '@/utils/env';
import { getLocalStorage, hasLocalStorage, setLocalStorage } from '@/utils/localstorage';

const SELECTED_SERVER_KEY = '@bitmetro/callisto:selected-server';
const SERVERS_KEY = '@bitmetro/callisto:known-servers';

interface CallistoValues {
  knownServers: string[];
  currentServer?: string;

  threadId?: string;
  pending: boolean;
  responding: boolean;
  response: string[];
}

interface CallistoActions {
  configure: () => void;
  chat: (query: string) => void;
  updateKnownServers: (servers: string[]) => void;
  setCurrentServer: (server: string) => void;
}

type CallistoState = CallistoValues & CallistoActions;

const createCallistoState = (initialValues: CallistoValues) =>
  create<CallistoState>((set, self) => ({
    ...initialValues,

    configure: () => {
      const encodedDefaultServers = JSON.stringify([getEnv().defaultServerUrl]);

      if (!hasLocalStorage(SERVERS_KEY)) {
        setLocalStorage(SERVERS_KEY, encodedDefaultServers);
      }

      const knownServers = JSON.parse(getLocalStorage(SERVERS_KEY)) as string[];

      set({
        knownServers,
        currentServer: getLocalStorage(SELECTED_SERVER_KEY, knownServers[0]),
      });
    },

    chat: (query) => {
      set({ pending: true, responding: false, response: [] });

      const url = `${self().currentServer}/api/v1/chat?q=${encodeURIComponent(query)}${self().threadId ? `&tid=${self().threadId}` : ''}`;
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

    setCurrentServer: (server) => {
      set({ currentServer: server });
      setLocalStorage(SELECTED_SERVER_KEY, server);
    },

    updateKnownServers: (servers: string[]) => {
      set({ knownServers: servers });
      setLocalStorage(SERVERS_KEY, JSON.stringify(servers));
    },
  }))

export const useCallisto = createCallistoState({
  knownServers: [],
  pending: false,
  responding: false,
  response: [],
});
