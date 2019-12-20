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
coverage.stop(); // stop the session
coverage.start(); // start a new session & close existing if any
const details = coverage.get(); // get Istanbul coverage
console.log(coverage.summarize()); // get & print summary, use the last generated reports by default
```

### Web Endpoints

If the express route is passed to the constructor follow 3 routes are added:

**GET /coverage**

Get the current coverage summary.

**POST /coverage**

Start a new coverage session.

**DELETE /coverage**

Close the existing session & return the coverage summary.
