var {
  Tracking: GATracking,
  Hits: GAHits,
} = require('react-native-google-analytics');

var TRACKING_ID = 'UA-37500646-6';
var _clientID = null;

var APP_KEY = 'com.mincaltrain.app'
var APP_VERSION = 1;

function _sendHit(hit) {
  hit.set({
    v: APP_VERSION,
    tid: TRACKING_ID,
    cid: _clientID
  });

  fetch('https://ssl.google-analytics.com/collect', {
    method: 'post',
    body: hit.toQueryString()
  })
  .catch((data) => console.warn('analytics failed with', data))
  .then(() => console.log('analytics send succeed'));
  console.log('analytics sent ', hit.toQueryString());
}

var _pending = [];

function _sendScreenView(screenName) {
  if (!_clientID) {
    throw new Error('GA not ready yet');
    return;
  }

  var screenView = new GAHits.ScreenView(
    screenName,
    APP_VERSION,
    APP_KEY
  );
  _sendHit(screenView);
}

GATracking.getClientId(function(err, clientID) {
  if (err) {
    console.warn('GA failed');
  }

  _clientID = clientID;
  _pending.forEach((screenName) => _sendScreenView(screenName));
  _pending = [];
});

function _logScreenView(screenName) {
  if (_clientID) {
    _sendScreenView(screenName);
  } else {
    _pending.push(screenName);
  }
}

var Analytics = {

  logOpen: function() {
    _logScreenView('open');
  },

  logChoseTrip: function() {
    _logScreenView('timefucntions_view');
  },
  
};

module.exports = Analytics;
