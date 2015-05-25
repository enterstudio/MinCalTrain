var assign = require('object-assign');
var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  View,
} = React;

var AppViews = require('../views/AppViews');
var {
  HeaderSpacer,
} = AppViews;
var Colors = require('../constants/Colors');
var Emoji = require('../constants/Emoji');
var TripStore = require('../stores/TripStore');

var TimesView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <View>
        <HeaderSpacer />
      </View>
    );
  },
  
});

module.exports = TimesView;
