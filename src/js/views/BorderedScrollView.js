var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
} = React;

var Colors = require('../constants/Colors');

var BorderedScrollView = React.createClass({

  render: function() {
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
