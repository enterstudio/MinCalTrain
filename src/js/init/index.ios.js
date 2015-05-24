/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Navigator,
} = React;

var Routes = require('../constants/Routes');
// var SequenceSelectView = require('../native_react_views/SequenceSelectView');

var INITIAL_ROUTE = Routes.SELECT_DEPARTURE;

var MinCalTrain = React.createClass({

  _renderScene: function(route, navigator) {
    switch (route.id) {
      case Routes.SELECT_DEPATURE:
        return <SequenceSelectView navigator={navigator} />;
    }
    throw new Exception('No route found for ' + route.id);
  },

  render: function() {
    return (
      <Navigator
        initialRoute={Routes.getRouteForID(INITIAL_ROUTE)}
        renderScene={this._renderScene}
      />
    );
  },

});

AppRegistry.registerComponent('MinCalTrain', () => MinCalTrain);
