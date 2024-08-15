const funcs = require('./index');

process.on('message', async ({ funcName, args }) => {
  process.send(await funcs[funcName](args));
});
