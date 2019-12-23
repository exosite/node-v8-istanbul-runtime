const assert = require('assert');
const Coverage = require('./');
// eslint-disable-next-line no-new
const coverage = new Coverage();

async function test () {
  try {
    await coverage.get();
    assert('Should not be here' === false);
  } catch (e) {
    assert(e.message === 'Session is not connected', e.message);
  }
  await coverage.start();
  const report = await coverage.get();
  assert(typeof report['/index.js'] === 'object');

  const summary = await coverage.summarize();
  assert(typeof summary.summary.lines === 'object');
  assert(typeof summary.summary.statements === 'object');
  assert(typeof summary.summary.functions === 'object');
  assert(typeof summary.summary.branches === 'object');
  assert(typeof summary['/index.js'] === 'object');
  assert(typeof summary['/index.js'].lines === 'object');
  assert(typeof summary['/index.js'].statements === 'object');
  assert(typeof summary['/index.js'].functions === 'object');
  assert(typeof summary['/index.js'].branches === 'object');

  const full = await coverage.summarize(report, true);
  assert(typeof full['/index.js'] === 'object');
  assert(typeof full['/index.js'].lines === 'object');
  assert(typeof full['/index.js'].statementMap === 'object');
  assert(typeof full['/index.js'].lines === 'object');

  await coverage.stop();
  await coverage.start();
}

test().then(
  _ => process.exit(0),
  e => console.error(e) || process.exit(1)
);
