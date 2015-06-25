var SundayNorthBound = require('./SundayNorthBound');
var baseProcess = require('../time_tables/baseProcess');

var SAT_TIMES = [{

  id: 421,
  stops: {
    'san-jose': '7:00am',
    'santa-clara': '7:05am',
    'lawrence': '7:10am',
    'sunnyvale': '7:14am',
    'mountain-view': '7:19am',
    'san-antonio': '7:23am',
    'california-ave': '7:27am',
    'palo-alto': '7:31am',
    'menlo-park': '7:34am',
    'atherton': '7:37am',
    'redwood-city': '7:41am',
    'san-carlos': '7:45am',
    'belmont': '7:48am',
    'hillsdale': '7:51am',
    'hayward-park': '7:54am',
    'san-mateo': '7:57am',
    'burlingame': '8:02am',
    'broadway': '8:05am',
    'millbrae': '8:10am',
    'san-bruno': '8:14am',
    'so-san-francisco': '8:19am',
    'bayshore': '8:25am',
    '22nd-street': '8:30am',
    'san-francisco': '8:38am',
  }
}, {

  id: 451,
  stops: {
    'san-jose': '10:30pm',
    'santa-clara': '10:35pm',
    'lawrence': '10:40pm',
    'sunnyvale': '10:44pm',
    'mountain-view': '10:49pm',
    'san-antonio': '10:53pm',
    'california-ave': '10:57pm',
    'palo-alto': '11:01pm',
    'menlo-park': '11:04pm',
    'atherton': '11:07pm',
    'redwood-city': '11:11pm',
    'san-carlos': '11:15pm',
    'belmont': '11:18pm',
    'hillsdale': '11:21pm',
    'hayward-park': '11:24pm',
    'san-mateo': '11:27pm',
    'burlingame': '11:32pm',
    'broadway': '11:35pm',
    'millbrae': '11:40pm',
    'san-bruno': '11:44pm',
    'so-san-francisco': '11:49pm',
    'bayshore': '11:55pm',
    '22nd-street': '+12:00am',
    'san-francisco': '+12:08am',
  }
}];

SAT_TIMES.forEach(function(train) {
  baseProcess.addType(train);
});

// Ok here is the deal -- these two trains are saturday only but
// the rest of the sunday times are part of saturdays schedule. So go
// grab sundays schedule and then append these to the front and back

var TIMES = [SAT_TIMES[0]];
TIMES = TIMES.concat(SundayNorthBound);
TIMES.push(SAT_TIMES[1]);

module.exports = TIMES;
