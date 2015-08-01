'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Navigator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} = React;

var Colors = require('../constants/Colors');
var Emoji = require('../constants/Emoji');
var Routes = require('../constants/Routes');
var DepartureSelectView = require('../views/DepartureSelectView');
var ArrivalSelectView = require('../views/ArrivalSelectView');
var TimesView = require('../views/TimesView');
var AboutView = require('../views/AboutView');

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
      case Routes.ABOUT:
        return <AboutView navigator={navigator} />;
    }
    throw new Error('No route found for ' + route.id);
  },

  componentWillMount: function() {
    this._navBarRouteMapper = {
      titleContentForRoute: function(route, navigator) {
        return null;
      },

      iconForRoute: function(route, navigator) {
        return (
          <TouchableOpacity onPress={() => {
              navigator.popToRoute(route);
            }}>
            <View style={styles.crumbIconPlaceholder}>
              <Text style={styles.iconText}>
                {Emoji.LOVE_HOTEL}
              </Text>
            </View>
          </TouchableOpacity>
        );
      },
    };
  },

  _configureScene: function(route) {
    switch (route.id) {
      case Routes.ABOUT:
        return Navigator.SceneConfigs.FloatFromBottom;
    }
    return Navigator.SceneConfigs.FloatFromRight;
  },

  render: function() {
    return (
      <View style={styles.background}>
        <Navigator
          initialRoute={Routes.getRouteForID(INITIAL_ROUTE)}
          renderScene={this._renderScene}
          configureScene={this._configureScene}
          navigationBar={
            <Navigator.BreadcrumbNavigationBar
              style={styles.navBar}
              routeMapper={this._navBarRouteMapper}
            />
          }
        />
      </View>
    );
  },

});

var styles = StyleSheet.create({
  iconText: {
    fontSize: 25,
  },
  background: {
    backgroundColor: Colors.GREY,
    flex: 1
  },
  navBar: {
    backgroundColor: Colors.SHE_DRESSED_ME,
  },
  crumbIconPlaceholder: {
    flex: 1,
  },
});

AppRegistry.registerComponent('MinCalTrain', () => MinCalTrain);
