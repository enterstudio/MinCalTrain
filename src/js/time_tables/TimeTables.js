var Stations = require('../constants/Stations');

var WeekdayNorthbound =
  require('../time_tables/WeekdayNorthbound');

var TimeTables = {
  getScheduleForDay: function(date) {
    var day = date.getDay();
    if (day === 0) {
      throw new Error('Sunday not done yet');
    } else if (day === 6) {
      throw new Error('Saturday not done yet');
    }
    // TODO add southbound
    return {
      northBound: WeekdayNorthbound,
      southBound: null,
    };
  },

};

module.exports = TimeTables;
