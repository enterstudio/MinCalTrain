var React = require('react-native');
var {
  ScrollView,
  View,
  StyleSheet,
} = React;

var Colors = require('../constants/Colors');

var BorderedScrollView = React.createClass({

  propTypes: {
    justView: React.PropTypes.bool,
  },

  render: function() {
    if (this.props.justView) {
      return (
        <View
          style={[
            styles.scrollView,
            this.props.style
          ]}>
          {this.props.children}
        </View>
      );
    }
    return (
      <ScrollView 
        automaticallyAdjustContentInsets={false}
        style={[
          styles.scrollView,
          this.props.style
        ]}>
        {this.props.children}
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.DEEPER,
  },
});

module.exports = BorderedScrollView;
