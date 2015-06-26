/**
 * Poor mans time format utility since we dont have that
 * in moment.js
 */

var formatFromMinutes = function(numMinutes) {
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

var formatMinutesAbbrev = function(numMinutes) {
  var long = formatFromMinutes(numMinutes);
  return long
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(',', '');
};

var formatTimeAmount = function(numMilliSeconds) {
  if (numMilliSeconds <= 0) {
    throw new Error('Invalid time length', numMilliSeconds);
  }

  var numSeconds = numMilliSeconds / 1000;
  var numMinutes = numSeconds / 60;
  return formatFromMinutes(numMinutes);
};

module.exports = {
  formatMilliseconds: formatTimeAmount,
  formatMinutes: formatFromMinutes,
  formatMinutesAbbrev: formatMinutesAbbrev,
};
