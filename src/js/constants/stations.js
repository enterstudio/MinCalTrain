var STATIONS_BY_ID = {
  'belmont': {
    name: 'Belmont'
  },
  'morgan-hill': {
    name: 'Morgan Hill'
  },
  'atherton': {
    name: 'Atherton'
  },
  'gilroy': {
    name: 'Gilroy'
  },
  '22nd-street': {
    name: '22nd Street'
  },
  'capitol': {
    name: 'Capitol'
  },
  'sunnyvale': {
    name: 'Sunnyvale'
  },
  'santa-clara': {
    name: 'Santa Clara'
  },
  'mountain-view': {
    name: 'Mountain View'
  },
  'san-carlos': {
    name: 'San Carlos'
  },
  'san-martin': {
    name: 'San Martin'
  },
  'hayward-park': {
    name: 'Hayward Park'
  },
  'blossom-hill': {
    name: 'Blossom Hill'
  },
  'so-san-francisco': {
    name: 'So. San Francisco'
  },
  'millbrae': {
    name: 'Millbrae'
  },
  'san-bruno': {
    name: 'San Bruno'
  },
  'san-francisco': {
    name: 'San Francisco'
  },
  'san-jose': {
    name: 'San Jose'
  },
  'palo-alto': {
    name: 'Palo Alto'
  },
  'tamien': {
    name: 'Tamien'
  },
  'california-ave': {
    name: 'California Ave'
  },
  'san-mateo': {
    name: 'San Mateo'
  },
  'burlingame': {
    name: 'Burlingame'
  },
  'san-antonio': {
    name: 'San Antonio'
  },
  'broadway': {
    name: 'Broadway'
  },
  'college-park': {
    name: 'College Park'
  },
  'menlo-park': {
    name: 'Menlo Park'
  },
  'lawrence': {
    name: 'Lawrence'
  },
  'bayshore': {
    name: 'Bayshore'
  },
  'hillsdale': {
    name: 'Hillsdale'
  },
  'redwood-city': {
    name: 'Redwood City'
  },
  'san-jose-diridon': {
    name: 'San Jose Diridon'
  },
  'tamien': {
    name: 'Tamien'
  },
  'capitol': {
    name: 'Capitol'
  },
  'blossom-hill': {
    name: 'Blossom Hill'
  },
  'morgan-hill': {
    name: 'Morgan Hill'
  },
  'san-martin': {
    name: 'San Martin'
  },
  'gilroy': {
    name: 'Gilroy'
  },
};

var stationOrder = [
  'san-francisco',
  '22nd-street',
  'bayshore',
  'so-san-francisco',
  'san-bruno',
  'millbrae',
  'broadway',
  'burlingame',
  'san-mateo',
  'hayward-park',
  'hillsdale',
  'belmont',
  'san-carlos',
  'redwood-city',
  'atherton',
  'menlo-park',
  'palo-alto',
  'california-ave',
  'san-antonio',
  'mountain-view',
  'sunnyvale',
  'lawrence',
  'santa-clara',
  'san-jose',
  'college-park',
  'san-jose-diridon',
  'tamien',
  'capitol',
  'blossom-hill',
  'morgan-hill',
  'san-martin',
  'gilroy'
];

// Add the id to each
Object.keys(STATIONS_BY_ID).forEach(function(id) {
  var station = STATIONS_BY_ID[id];
  station.id = id;
});

var STATIONS = [];
stationOrder.forEach(function(id, southBoundIndex) {
  STATIONS_BY_ID[id].southBoundIndex = southBoundIndex;
  STATIONS_BY_ID[id].northBoundIndex = 
    stationOrder.length - southBoundIndex - 1;
  STATIONS.push(STATIONS_BY_ID[id]);
});

module.exports = {
  getAllStations: function() {
    return STATIONS.slice(0);
  },

  getStationName: function(id) {
    return STATIONS_BY_ID[id].name;
  },

  __getStationsByID: function() {
    return STATIONS_BY_ID;
  },
};
