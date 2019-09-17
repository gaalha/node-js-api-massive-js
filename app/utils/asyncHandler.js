/*
  For better error handling of async operation this function 
  will wrap route handler function with a Promise to 
  handle rejected promises.
  
  Credits: https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
*/
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;