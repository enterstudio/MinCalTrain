var React = require('react-native');
var {
  StyleSheet,
  Image,
  View,
  Text,
} = React;

var IMAGES = {
  'smif': {
    source: require('image!smif'),
    attribution: 'Flickr user @smif '
  },
  'brian_tobin': {
    source: require('image!brian_tobin'),
    attribution: 'Brian Tobin',
    style: {
      color: '#CCC'
    },
  },
  'jun_seita': {
    source: require('image!jun_seita'),
    attribution: 'Jun Seita',
    style: {
      color: '#555'
    },
  },
};

var BackgroundCoverImageView = React.createClass({

  propTypes: {
    imageName: React.PropTypes.string.isRequired,
  },

  render: function() {
    var imageData = IMAGES[this.props.imageName];
    if (!imageData) {
      throw new Error('did not find image ' + this.props.imageName);
    }

    return (
      <View>
        <Image 
          accessible={false}
          style={styles.backgroundImage}
          source={imageData.source}
        />
        <View style={styles.attribution}>
          <Text style={[
              styles.attributionText,
              imageData.style
            ]}>
            {imageData.attribution}
          </Text>
        </View>
      </View>
    );
  },

});

var styles = StyleSheet.create({
  attributionText: {
    color: '#333',
    fontSize: 10,
  },
  attribution: {
    position: 'absolute',
    right: 0,
  },
  backgroundImage: {
    width: 380,
    height: 650,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

module.exports = BackgroundCoverImageView;
