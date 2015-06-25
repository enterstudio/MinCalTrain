var formatTimeAmount = require('../util/formatTimeAmount');

function _getMilliSeconds(hours, minutes) {
  return +hours * 60 * 60 * 1000 +
    +minutes * 60 * 1000;
}

function _getString(hours, minutes) {
  return formatTimeAmount(_getMilliSeconds(hours, minutes));
}

describe('format time amount', function() {
  it('can get milliseconds', function() {
    expect(_getMilliSeconds(0, 0)).toBe(0);
    expect(_getMilliSeconds(1, 0)).toBe(60 * 60 * 1000);
    expect(_getMilliSeconds(1, 1)).toBe(60 * 60 * 1000 + 60 * 1000);
  });

  it('formats time amounts', function() {
    expect(_getString(1, 3)).toBe('1 hour, 3 minutes');
    expect(_getString(0, 3)).toBe('3 minutes');
    expect(_getString(0, 1)).toBe('1 minute');
    expect(_getString(2, 1)).toBe('2 hours, 1 minute');
  });
});
