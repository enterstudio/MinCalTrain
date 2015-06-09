'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Navigator,
  StyleSheet,
  View,
} = React;

var Colors = require('../constants/Colors');
var Routes = require('../constants/Routes');
var DepartureSelectView = require('../views/DepartureSelectView');
var ArrivalSelectView = require('../views/ArrivalSelectView');
var TimesView = require('../views/TimesView');

var INITIAL_ROUTE = Routes.SELECT_DEPARTURE;

var MinCalTrain = React.createClass({

  _renderScene: function(route, navigator) {
    switch (route.id) {
      case Routes.SELECT_DEPARTURE:
        return <DepartureSelectView navigator={navigator} />;
      case Routes.SELECT_ARRIVAL:
        return <ArrivalSelectView navigator={navigator} />;
      case Routes.TIMES:
        return <TimesView navigator={navigator} />;
    }
    throw new Error('No route found for ' + route.id);
  },

  render: function() {
    return (
      <View style={styles.background}>
        <View style={styles.headerSpacer} />
        <Navigator
          initialRoute={Routes.getRouteForID(INITIAL_ROUTE)}
          renderScene={this._renderScene}
        />
      </View>
    );
  },

});

var styles = StyleSheet.create({
  headerSpacer: {
    height: 20,
    backgroundColor: Colors.SHE_DRESSED_ME,
  },
  background: {
    backgroundColor: Colors.GREY,
    flex: 1
  }
});

AppRegistry.registerComponent('MinCalTrain', () => MinCalTrain);
