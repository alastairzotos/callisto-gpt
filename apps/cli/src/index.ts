import { createInterface } from 'readline';
import EventSource from 'eventsource';
import { Response } from '@bitmetro/callisto';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

let threadId: string;

const prompt = () => {
  rl.question('> ', async query => {
    const url = `http://localhost:6000/api/v1/chat?q=${encodeURIComponent(query)}${threadId ? `&tid=${threadId}` : ''}`;
    const ev = new EventSource(url);

    ev.onmessage = (evt) => {
      const res = JSON.parse(evt.data) as Response;

      switch (res.type) {
        case 'thread-id':
          threadId = res.data;
          break;

        case 'text':
          process.stdout.write(res.data);
          break;

        case 'data':
          console.log(res.data);
          break;

        case 'stop':
          process.stdout.write('\n');
          prompt();
          break;
      }
    };
  })
}

prompt();