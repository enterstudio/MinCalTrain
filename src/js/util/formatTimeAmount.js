/**
 * Poor mans time format utility since we dont have that
 * in moment.js
 */
var formatTimeAmount = function(numMilliSeconds) {
  if (numMilliSeconds <= 0) {
    throw new Error('Invalid time length', numMilliSeconds);
  }

  var numSeconds = numMilliSeconds / 1000;
  var numMinutes = numSeconds / 60;
  var numHours = Math.floor(numMinutes / 60);

  if (numHours === 0) {
    numMinutes = Math.round(numMinutes);
    return ''+numMinutes + ' minute' +
      (numMinutes !== 1 ? 's' : '');
  }

  var leftOverMinutes = Math.round(numMinutes % 60);

  var result = ''+numHours + ' hour' +
      (numHours !== 1 ? 's' : '');
  result += ', ';
  result += ''+leftOverMinutes + ' minute' +
      (leftOverMinutes !== 1 ? 's' : '');
  return result;
};

module.exports = formatTimeAmount;
