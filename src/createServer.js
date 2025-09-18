// Write code here
// Also, you can create additional files in the src folder
// and import (require) them here
const http = require('http');
const { convertToCase } = require('./convertToCase/convertToCase.js');

const PORT = process.env.PORT || 3000;
const cases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

function createServer() {
  const server = http.createServer((req, res) => {
    // res.setHeader('Content-Type', 'application/json');

    const normalizedURL = new URL(req.url, `http://localhost:${PORT}`);

    const normReq = normalizedURL.pathname.slice(1);
    const toCase = normalizedURL.searchParams.get('toCase');

    const normalizedToCase = toCase ? toCase.toUpperCase() : '';
    const caseName = cases.includes(normalizedToCase) ? normalizedToCase : '';

    let text = '';

    if (
      normReq.length > 0 &&
      !normReq.startsWith('favicon') &&
      !normReq.startsWith('.well-known')
    ) {
      text = normReq || '';
    }

    let findObject = {};

    if (caseName && text) {
      findObject = convertToCase(text, caseName);
    }

    const errorMessages = [];

    if (!text) {
      errorMessages.push({
        message:
          'Text to convert is required. Correct request is: ' +
          '"/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    }

    if (!toCase) {
      errorMessages.push({
        message:
          '"toCase" query param is required. Correct request is: ' +
          '"/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    } else if (!caseName) {
      errorMessages.push({
        message:
          'This case is not supported.' +
          ' Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
      });
    }

    if (errorMessages.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 400;
      res.statusMessage = 'Bad request';
      res.end(JSON.stringify({ errors: errorMessages }));

      return;
    }

    const result = {
      originalCase: findObject.originalCase, // то, что вернул convertToCase
      targetCase: caseName, // то, что ты сам достал из query
      originalText: text, // то, что пришло в URL
      convertedText: findObject.convertedText, // то, что вернул convertToCase
    };

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.end(JSON.stringify(result));

    // res.end(`Converted: ${result}`);
  });

  // server.listen(PORT, () => {
  //   // eslint-disable-next-line no-console
  //   console.log(`Server started on WOW-WOW port ${PORT}`);
  // });

  return server;
}

module.exports = { createServer };
// createServer();
