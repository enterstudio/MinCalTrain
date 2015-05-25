var STATIONS_BY_SLUG = {
  "belmont": {
    "id": "2e20cf1b-95b1-3604-bec2-efc46e07cddf",
    "name": "Belmont",
  },
  "morgan-hill": {
    "id": "4c8b1363-1eb3-375d-b503-b96f68430fca",
    "name": "Morgan Hill",
  },
  "atherton": {
    "id": "acac942d-d06d-383c-8c06-c01c4f53c95e",
    "name": "Atherton",
  },
  "gilroy": {
    "id": "fcded072-9e49-3665-9941-86d655030dcf",
    "name": "Gilroy",
  },
  "22nd-street": {
    "id": "47abeb4f-26c2-3c69-9cd0-c06bdca162aa",
    "name": "22nd Street",
  },
  "capitol": {
    "id": "6a545975-3ecc-3b87-817d-0b079a934e04",
    "name": "Capitol",
  },
  "sunnyvale": {
    "id": "760ec2a3-4eb0-3073-aa08-1990d6cfd318",
    "name": "Sunnyvale",
  },
  "santa-clara": {
    "id": "9237a211-1665-3d57-8cb4-3189754fa533",
    "name": "Santa Clara",
  },
  "mountain-view": {
    "id": "dfc2e118-6c85-3f22-b47e-569d62bc5953",
    "name": "Mountain View",
  },
  "san-carlos": {
    "id": "f0007e3b-e4ec-3ec3-8dfd-ecc5c035a66d",
    "name": "San Carlos",
  },
  "san-martin": {
    "id": "393ff776-3c69-3c92-8224-07b74d07a5e6",
    "name": "San Martin",
  },
  "hayward-park": {
    "id": "5b9be18d-0bd2-3fc0-9324-74e9cbd796bc",
    "name": "Hayward Park",
  },
  "blossom-hill": {
    "id": "7e537789-ffb0-35ff-87a7-7fc45d65beae",
    "name": "Blossom Hill",
  },
  "so-san-francisco": {
    "id": "250ac8b7-41a4-35c5-ac48-3f43d838d08f",
    "name": "So. San Francisco",
  },
  "millbrae": {
    "id": "969184ba-4312-31fb-9cee-2a3e56cdef1b",
    "name": "Millbrae",
  },
  "san-bruno": {
    "id": "5341cb65-9f55-3d05-bcf0-a9e70810f027",
    "name": "San Bruno",
  },
  "san-francisco": {
    "id": "535db153-2743-3375-9c51-49c5ea4afee1",
    "name": "San Francisco",
  },
  "san-jose": {
    "id": "7a0be019-1c54-360b-a995-9561aad49a81",
    "name": "San Jose",
  },
  "palo-alto": {
    "id": "9236cff1-b0bc-320d-aeeb-9f6793a0b973",
    "name": "Palo Alto",
  },
  "tamien": {
    "id": "c27b13e9-558e-3d01-9abc-96ac1d2fb866",
    "name": "Tamien",
  },
  "california-ave": {
    "id": "c4770033-f771-37b0-ab63-688dccb4125a",
    "name": "California Ave",
  },
  "san-mateo": {
    "id": "c35b46ca-3f1e-3039-bb15-b30ce3fb5125",
    "name": "San Mateo",
  },
  "burlingame": {
    "id": "7607692e-1aab-3b1b-9358-3d6837f3ae55",
    "name": "Burlingame",
  },
  "san-antonio": {
    "id": "7e157b4e-4301-3af1-be49-d3b02340f351",
    "name": "San Antonio",
  },
  "broadway": {
    "id": "960d701c-b0f7-3372-9b64-23b44ac88396",
    "name": "Broadway",
  },
  "college-park": {
    "id": "9b67234d-57b1-38a1-9857-eeec6fa64d0f",
    "name": "College Park",
  },
  "menlo-park": {
    "id": "abffb3b7-7130-3f25-97f4-0e6d7edb6ec6",
    "name": "Menlo Park",
  },
  "lawrence": {
    "id": "e6fe1c4d-266c-38de-8abe-b28eca6eca07",
    "name": "Lawrence",
  },
  "bayshore": {
    "id": "f3de2d1a-cabb-35c2-9288-e6a50093792c",
    "name": "Bayshore",
  },
  "hillsdale": {
    "id": "50e60126-385c-36b9-835a-ce2c1f44988e",
    "name": "Hillsdale",
  },
  "redwood-city": {
    "id": "a829a204-7d91-34a6-a160-7c25f6d6250d",
    "name": "Redwood City",
  },
  "san-jose-diridon": {
    "id": "ef6bc96e-6d0f-3a65-b78a-7ee7dd5c36d5",
    "name": "San Jose Diridon",
  }
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
  'san-jose'
];

// Add the slug to each
Object.keys(STATIONS_BY_SLUG).forEach(function(slug) {
  STATIONS_BY_SLUG[slug].slug = slug;
});

var STATIONS = [];
stationOrder.forEach(function(stationSlug) {
  STATIONS.push(STATIONS_BY_SLUG[stationSlug]);
});

module.exports = STATIONS;
