var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  LinkingIOS,
} = React;

var GITHUB_URL = 'https://github.com/pcottle/MinCalTrain';

var Colors = require('../constants/Colors');
var Emoji = require('../constants/Emoji');
var BackgroundCoverView = require('../views/BackgroundCoverView');
var BackgroundCoverImageView = require('../views/BackgroundCoverImageView');

var AboutView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <View style={styles.metaContainer}>
        <BackgroundCoverView imageName="singapore">
          <View style={styles.mainText}>
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
                <Text style={styles.boldText}>
                  GitHub Link
                </Text>
              </View>
            </TouchableHighlight>
            <Text style={styles.subText}>
              This project is Open Source! Feel free to fork it
              and send improvements :D
            </Text>
          </View>
        </BackgroundCoverView>
      </View>
    );
  },

  renderAuthor: function(authorName) {
    return (
      <Text style={styles.authorNameText} key={authorName}>
        {authorName}
      </Text>
    );
  },

});

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
  mainText: {
    backgroundColor: Colors.SHE_DRESSED_ME,
    padding: 12
  },
});

module.exports = AboutView;
