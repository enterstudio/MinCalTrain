var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var Emoji = require('../constants/Emoji');
var Colors = require('../constants/Colors');
var EmojiRowEndView = require('../views/EmojiRowEndView');

var CallToActionRowView = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
  },

  render: function() {
    return (
      <View style={styles.callToAction}>
        <Text style={styles.callToActionText}>
          {this.props.label}
        </Text>
        {this.props.children}
      </View>
    );
  },

});

var styles = StyleSheet.create({
  callToAction: {
    backgroundColor: Colors.DEEPER,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  callToActionText: {
    color: '#111'
  },
});

module.exports = CallToActionRowView;
