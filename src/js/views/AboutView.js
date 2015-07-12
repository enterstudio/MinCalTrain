var React = require('react-native');
var {
  Component,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  LinkingIOS,
  PanResponder,
  Animated,
} = React;

var GITHUB_URL = 'https://github.com/pcottle/MinCalTrain';

var Colors = require('../constants/Colors');
var Emoji = require('../constants/Emoji');
var BackgroundCoverView = require('../views/BackgroundCoverView');
var BackgroundCoverImageView = require('../views/BackgroundCoverImageView');

var DECISION_THRESHOLD = 120;

class AboutView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
    };
    this.state.pan.addListener(() => { this.forceUpdate(); });
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, {dx, dy}) => {
        this.state.pan.setOffset({x: dx, y: dy});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: (e, {dx, dy}) => {
        this.state.pan.setValue({
          x: dx,
          y: dy,
        });
      },

      onPanResponderRelease: (e, {dx, vx, vy}) => {
        Animated.spring(this.state.pan, {
          toValue: {x: 0, y: 0},
          friction: 3,
        }).start();
      },
    });
  }

  _resetState() {
    this.state.pan.setValue({x: 0, y: 0});
  }

  render() {
    var pan = this.state.pan;
    let [translateX, translateY] = [pan.x.__getValue(), pan.y.__getValue()];

    let rotate = pan.x.interpolate(
      {inputRange: [-200, 0, 200], outputRange: ['-30deg', '0deg', '30deg']}
    ).__getValue();
    let opacity = pan.x.interpolate(
      {inputRange: [-200, 0, 200], outputRange: [0.7, 1, 0.7]}
    ).__getValue();
    let scale = pan.x.interpolate(
      {inputRange: [-200, 0, 200], outputRange: [1.5, 1, 1.5], extrapolate: 'clamp'}
    ).__getValue();

    var animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    return (
      <View style={styles.metaContainer}>
        <BackgroundCoverView imageName="singapore">
          <Animated.View style={[styles.mainText, animatedCardStyles]} {...this._panResponder.panHandlers}>
            <View style={styles.centeredText}>
              <Text>
                {Emoji.TEARS_OF_JOY}
                {Emoji.TEARS_OF_JOY}
                {Emoji.TEARS_OF_JOY}
              </Text>
            </View>
            <View style={styles.centeredText}>
              <Text style={styles.aboutText}>
                A B O U T
              </Text>
            </View>
            <View style={styles.centeredText}>
              <Text>
                {Emoji.NAIL_POLISH}
                {Emoji.NAIL_POLISH}
                {Emoji.NAIL_POLISH}
              </Text>
            </View>
            <Text style={styles.leftText}>
              Engineering:
            </Text>
            <View style={styles.centeredText}>
              <Text style={styles.boldText}>
                Peter Cottle
              </Text>
            </View>
            <Text style={[styles.leftText, styles.textMargin]}>
              Data Scientist and Logo Designer:
            </Text>
            <View style={styles.centeredText}>
              <Text style={styles.boldText}>
                Connie Qian
              </Text>
            </View>
            <Text style={styles.leftText}>
              Photos:
            </Text>
            <View style={styles.centeredText}>
              {BackgroundCoverImageView.getImageAuthors().map(
                author => this.renderAuthor(author)
              )}
            </View>
            <Text style={styles.leftText}>
              Feedback:
            </Text>
            <TouchableHighlight
              onPress={() => {
                LinkingIOS.openURL(GITHUB_URL);
              }}
              underlayColor={Colors.LIOHUA}>
              <View style={styles.centeredText}>
                <Text style={[styles.boldText, styles.link]}>
                  GitHub
                </Text>
              </View>
            </TouchableHighlight>
            <Text style={styles.subText}>
              This project is Open Source! Feel free to fork it
              and send improvements :D
            </Text>
          </Animated.View>
        </BackgroundCoverView>
      </View>
    );
  }

  renderAuthor(authorName) {
    return (
      <Text style={styles.authorNameText} key={authorName}>
        {authorName}
      </Text>
    );
  }

}

var styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  leftText: {
    fontSize: 14,
  },
  authorNameText: {
    fontSize: 14,
  },
  textMargin: {
    marginTop: 4,
    marginBottom: 4
  },
  aboutText: {
    padding: 4,
    fontSize: 20,
    color: '#111'
  },
  centeredText: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  metaContainer: {
    flex: 1,
  },
  subText: {
    paddingTop: 8,
    fontSize: 10,
    color: '#333'
  },
  link: {
    textDecorationLine: 'underline'
  },
  mainText: {
    backgroundColor: Colors.SHE_DRESSED_ME,
    padding: 12
  },
});

module.exports = AboutView;
