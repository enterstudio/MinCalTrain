var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var Colors = require('../constants/Colors');

var HeaderSpacer = React.createClass({
  render: function() {
    return (
      <View style={styles.headerSpacer} />
    );
  }

});

var styles = StyleSheet.create({
  headerSpacer: {
    backgroundColor: Colors.SHE_DRESSED_ME,
    height: 22,
  },
});

exports.HeaderSpacer = HeaderSpacer;
