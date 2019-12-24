# node-v8-istanbul-runtime
Run-time code coverage from native v8 and provided in Istanbul format.

## Usage

Set ENV: COVERAGE = "true"

Then add the module and optionally pass the express router to it.

```javascript
// Enable coverage routes
const Coverage = require('node-v8-istanbul-runtime');
// eslint-disable-next-line no-new
new Coverage(express_app);
```

### JS API

```javascript
const coverage = new Coverage();
coverage.start(); // start a new session & close existing if any
const report = coverage.get(); // get Istanbul coverage
console.log(coverage.summarize(report)); // get & print summary, use the last generated reports by default
console.log(coverage.summarize(report, true)); // Also keep the full details
coverage.stop(); // stop the session
```

### Web Endpoints

If the express route is passed to the constructor follow 3 routes are added:

**GET /coverage?full=true**

Get the current coverage summary.
Optional _full_ query parameter to get the full report.

**POST /coverage**

Start a new coverage session.

**DELETE /coverage**

Close the existing session & return the coverage summary.
