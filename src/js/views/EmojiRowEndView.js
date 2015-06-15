var React = require('react-native');
var {
  Text,
  StyleSheet,
} = React;

var Emoji = require('../constants/Emoji');

var EmojiRowEndView = React.createClass({

  render: function() {
    return (
      <Text style={styles.emojiText}>
        {this.props.children}
      </Text>
    );
  },

});

var styles = StyleSheet.create({
  emojiText: {
    fontSize: 20,
    position: 'absolute',
    right: 10,
    top: 6
  },
});

module.exports = EmojiRowEndView;
