
if (process.env.COVERAGE !== 'true') {
  class Dummy {
    constructor () {
      return 'COVERAGE is not enabled';
    }
    async get () { return 'COVERAGE is not enabled'; }
  }
  module.exports = Dummy;
} else {
  const path = require('path');
  const inspector = require('inspector');
  const v8ToIstanbul = require('v8-to-istanbul');
  const libCoverage = require('istanbul-lib-coverage');
  const appFolder = process.cwd();

  class Coverage {
    constructor (express) {
      inspector.open(0, true);
      this.session = new inspector.Session();
      this.start();
      if (express) {
        // Enable coverage endpoints under /coverage
        express.use('/coverage', (req, res) =>
          this['express' + req.method](req, res)
            .catch(error => res.status(500).send(error)));
      }
    }

    async expressGET (request, response) {
      const result = this.summarize(await this.get());
      response.status(200).json(result);
    }
    async expressPOST (request, response) {
      await this.start();
      response.status(204).send();
    }
    async expressDELETE (request, response) {
      const result = this.summarize(await this.get());
      await this.stop();
      response.status(200).json(result);
    }

    async start () {
      this.stop();
      this.session.connect();
      await this.postPromise('Profiler.enable');
      await this.postPromise('Runtime.enable');
      await this.postPromise('Profiler.startPreciseCoverage',
        { callCount: true, detailed: true }
      );
      this.enabled = true;
    }

    postPromise (cmd, opts = {}) {
      return new Promise((resolve, reject) => {
        this.session.post(cmd, opts, (err, result) => {
          if (err) return reject(err);
          resolve(result && result.result);
        });
      });
    }

    async get () {
      let result = await this.postPromise('Profiler.takePreciseCoverage');
      result = result
        .filter(file =>
          path.isAbsolute(file.url.replace('file://', '')) && !file.url.includes('node_modules'));

      const coverage = [];
      for (const { url, functions } of result) {
        const reportFormatted = v8ToIstanbul(url);
        await reportFormatted.load(); // this is required due to the async source-map dependency.
        reportFormatted.applyCoverage(functions);
        coverage.push(reportFormatted.toIstanbul());
      }
      this.lastCoverage = coverage;
      return coverage;
    }

    summarize (reports = this.lastCoverage) {
      const joined = reports.reduce((acc, report) => Object.assign(acc, report), {});
      const map = libCoverage.createCoverageMap(joined);
      const summary = libCoverage.createCoverageSummary();
      const result = { summary };
      for (let f of map.files()) {
        const fc = map.fileCoverageFor(f);
        const s = fc.toSummary();
        summary.merge(s);
        result[f.replace(appFolder, '')] = s;
      }
      return result;
    }

    async stop () {
      if (!this.enabled) return;
      await this.postPromise('Profiler.stopPreciseCoverage');
      this.session.disconnect();
      this.enabled = false;
    }
  }
  module.exports = Coverage;
}
