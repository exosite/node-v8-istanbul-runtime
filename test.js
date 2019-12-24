const assert = require('assert');
const Coverage = require('./');
// eslint-disable-next-line no-new
const coverage = new Coverage();

async function test () {
  try {
    await coverage.get();
    assert(false, 'Should not get without start');
  } catch (e) {
    assert.strictEqual(e.message, 'Session is not connected', 'Should not get without start');
  }
  await coverage.start();
  const report = await coverage.get();
  assert.strictEqual(typeof report['/index.js'], 'object', 'Has index.js');

  const summary = await coverage.summarize();
  assert.strictEqual(typeof summary.summary, 'object', 'Has summary');
  assert.strictEqual(typeof summary.summary.lines, 'object', 'Has summary.lines');
  assert.strictEqual(typeof summary.summary.statements, 'object', 'Has summary.statements');
  assert.strictEqual(typeof summary.summary.functions, 'object', 'Has summary.functions');
  assert.strictEqual(typeof summary.summary.branches, 'object', 'Has summary.branches');
  assert.strictEqual(typeof summary['/index.js'].lines, 'object', 'Has /index.js.lines');
  assert.strictEqual(typeof summary['/index.js'].statements, 'object', 'Has /index.js.statements');
  assert.strictEqual(typeof summary['/index.js'].functions, 'object', 'Has /index.js.functions');
  assert.strictEqual(typeof summary['/index.js'].branches, 'object', 'Has /index.js.branches');

  const full = await coverage.summarize(report, true);
  assert.strictEqual(typeof full['/index.js'], 'object', 'Has index.js');
  assert.strictEqual(typeof full['/index.js'].lines, 'object', 'Has /index.js.lines');
  assert.strictEqual(typeof full['/index.js'].statementMap, 'object', 'Has /index.js.statementMap');

  await coverage.stop();
  await coverage.start();
}

test().then(
  _ => process.exit(0),
  e => console.error(e) || process.exit(1)
);
