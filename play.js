const poll = ({ fn, validate, interval, maxAttempts }) => {
    console.log('Start poll...');
    let attempts = 0;
  
    const checkResults = async (resolve, reject) => {
      console.log('- checking');
      const result = await fn();
      attempts++;
  
      if (validate(result)) {
        return resolve(result);
      } else if (maxAttempts && attempts === maxAttempts) {
        return reject(new Error('Exceeded max attempts'));
      } else {
        setTimeout(checkResults, interval, resolve, reject);
      }
    };
  
    return new Promise(checkResults);
  };
  
  const simulateServerRequestTime = interval => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
  };
  
  const TIME_TO_DISPLAY_NEW_DATA = 10000;
  const TIME_TO_CHECK_RESULTS = 2000;
  
  let fakeResults = null;
  const createResults = (() => {
    setTimeout(() => {
        const timeElapsed = Date.now()
        const now = new Date(timeElapsed)
        lastUpdate = now.toGMTString();
      fakeResults = {
        "Travis Woofer": '123',
        "Buddy Minted": '321',
        "David Goldeira": '432',
        "Dave Grolsch": "301",
        "Joey Jordiking":"904",
        lastUpdate
      };
    }, TIME_TO_DISPLAY_NEW_DATA + TIME_TO_CHECK_RESULTS);
  })();
  
  const mockApi = async () => {
    await simulateServerRequestTime(500);
    return fakeResults;
  };
  
  const validateResults = results => !!results;
  const POLL_INTERVAL = 1000;
  const pollForNewResults = poll({
    fn: mockApi,
    validate: validateResults,
    interval: POLL_INTERVAL,
  })
    .then(results => console.log(results))
    .catch(err => console.error(err));