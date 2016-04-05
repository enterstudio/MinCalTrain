var React = require('react-native');
var {
  StyleSheet,
  Image,
  View,
  Text,
} = React;

var IMAGES = {
  'smif': {
    source: require('../../img/smif.png'),
    attribution: 'Flickr user @smif '
  },
  'brian_tobin': {
    source: require('../../img/brian_tobin.png'),
    attribution: 'Brian Tobin',
    style: {
      color: '#CCC'
    },
  },
  'jun_seita': {
    source: require('../../img/jun_seita.png'),
    attribution: 'Jun Seita',
    style: {
      color: '#555'
    },
  },
  'singapore': {
    source: require('../../img/singapore.png'),
    attribution: 'Peter Cottle',
    style: {
      color: '#DDD'
    }
  }
};

var BackgroundCoverImageView = React.createClass({

  statics: {
    getImageAuthors: function() {
      return Object.keys(IMAGES).map(function(imageName) {
        return IMAGES[imageName].attribution;
      });
    },
  },

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
          style={[
            styles.backgroundImage,
            imageData.imageStyle || {}
          ]}
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
    right: 4,
    top: 4,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

module.exports = BackgroundCoverImageView;
