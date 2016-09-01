// asyncutils.js
// Utilities for making asynchronous programming simpler.

// NOTE: A major downside to using asyncf instead of a natively supported
// async, is that this method makes it difficult to get a good stack trace.
// TODO: Think of a solution to make debugging easier.

function asyncf(generator) {
  return function() {
    return new Promise((resolve, reject) => {
      try {
        const generatorObject = generator.apply(null, arguments);
        _asyncfHelper(generatorObject, resolve, reject);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  };
}

function _asyncfHelper(generatorObject, resolve, reject, arg, isErr) {
  try {
    const {done, value} =
        isErr ?
        generatorObject.throw(arg) :
        generatorObject.next(arg);
    if (done) {
      resolve(value);
      return;
    }
    // if done is false, 'value' must be a Promise
    value.then(result => {
      _asyncfHelper(generatorObject, resolve, reject, result);
    }).catch(err => {
      _asyncfHelper(generatorObject, resolve, reject, err, true);
    });
  } catch (err) {
    console.error(err);
    reject(err);
  }
}

exports.asyncf = asyncf;
