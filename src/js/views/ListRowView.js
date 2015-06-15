var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var Colors = require('../constants/Colors');

var ListRowView = React.createClass({

  render: function() {
    return (
      <View style={this.props.style}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {this.props.children}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }

});

var styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.DEEPER,
  },
  textContainer: {
    padding: 16,
  },
  text: {
    color: '#EEE'
  },
});

module.exports = ListRowView;
