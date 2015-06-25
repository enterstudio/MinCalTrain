var SundaySouthBound = require('./SundaySouthBound');
var baseProcess = require('../time_tables/baseProcess');

var SAT_TIMES = [{

  id: 450,
  stops: {
    'san-francisco': '10:15pm',
    '22nd-street': '10:20pm',
    'bayshore': '10:25pm',
    'so-san-francisco': '10:31pm',
    'san-bruno': '10:35pm',
    'millbrae': '10:39pm',
    'broadway': '10:43pm',
    'burlingame': '10:45pm',
    'san-mateo': '10:51pm',
    'hayward-park': '10:54pm',
    'hillsdale': '10:57pm',
    'belmont': '11:00pm',
    'san-carlos': '11:03pm',
    'redwood-city': '11:09pm',
    'atherton': '11:13pm',
    'menlo-park': '11:16pm',
    'palo-alto': '11:19pm',
    'california-ave': '11:23pm',
    'san-antonio': '11:27pm',
    'mountain-view': '11:31pm',
    'sunnyvale': '11:36pm',
    'lawrence': '11:40pm',
    'santa-clara': '11:45pm',
    'san-jose': '11:53pm',
  }
}, {

  id: 454,
  stops: {
    'san-francisco': '+12:01am',
    '22nd-street': '+12:06am',
    'bayshore': '+12:11am',
    'so-san-francisco': '+12:17am',
    'san-bruno': '+12:21am',
    'millbrae': '+12:25am',
    'broadway': '+12:29am',
    'burlingame': '+12:31am',
    'san-mateo': '+12:37am',
    'hayward-park': '+12:40am',
    'hillsdale': '+12:43am',
    'belmont': '+12:46am',
    'san-carlos': '+12:49am',
    'redwood-city': '+12:55am',
    'atherton': '+12:59am',
    'menlo-park': '+1:02am',
    'palo-alto': '+1:05am',
    'california-ave': '+1:09am',
    'san-antonio': '+1:13am',
    'mountain-view': '+1:17am',
    'sunnyvale': '+1:22am',
    'lawrence': '+1:26am',
    'santa-clara': '+1:31am',
    'san-jose': '+1:39am',
  }


}];

SAT_TIMES.forEach(function(train) {
  baseProcess.addType(train);
});

// Ok here is the deal -- these two trains are saturday only but
// the rest of the sunday times are part of saturdays schedule. So go
// grab sundays schedule and then append these to the end,
// since they are only trains going from the city back down
var TIMES = [];
TIMES = TIMES.concat(SundaySouthBound);
TIMES = TIMES.concat(SAT_TIMES);

module.exports = TIMES;
