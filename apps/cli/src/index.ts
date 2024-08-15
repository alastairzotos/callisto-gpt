import { createInterface } from 'readline';
import EventSource from 'eventsource';
import { Response } from '@bitmetro/callisto';

async function* questions(query: string) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  try {
    for (; ;) {
      yield new Promise<string>((resolve) => rl.question(query, resolve));
    }
  } finally {
    rl.close();
  }
}

async function run() {
  let threadId: string | undefined;

  const handleQuery = (query: string) => new Promise<void>(resolve => {
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
          resolve();
          break;
      }
    };
  })

  for await (const query of questions("> ")) {
    await handleQuery(query);
  }
}

run();