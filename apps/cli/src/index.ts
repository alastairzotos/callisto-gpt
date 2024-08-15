import { createInterface } from 'readline';
import EventSource from 'eventsource';
import chalk from 'chalk';
import { Response } from '@bitmetro/callisto';

const cliSpinners = require('fix-esm').require('cli-spinners');
const ora = require('fix-esm').require('ora')

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
  process.stdout.write('\x1Bc\n'); 

  let threadId: string | undefined;

  const callistoPrompt = chalk.blueBright(`[${chalk.blue('Callisto')}] `);
  
  const handleQuery = (query: string) => new Promise<void>(resolve => {
    const url = `http://localhost:6000/api/v1/chat?q=${encodeURIComponent(query)}${threadId ? `&tid=${threadId}` : ''}`;
    const ev = new EventSource(url);
    
    const spinner = ora({
      prefixText: callistoPrompt,
      spinner: cliSpinners.aesthetic,
    }).start();

    let responseStarted = false;

    ev.onmessage = (evt) => {
      spinner.stop();

      if (!responseStarted) {
        process.stdout.write(callistoPrompt);
        responseStarted = true;
      }

      const res = JSON.parse(evt.data) as Response;

      switch (res.type) {
        case 'thread-id':
          threadId = res.data;
          break;

        case 'text':
          process.stdout.write(chalk.cyan(res.data));
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

  for await (const query of questions(chalk.greenBright(`[${chalk.green('You')}] `))) {
    await handleQuery(query);
  }
}

run();