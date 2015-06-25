var assign = require('object-assign');
var moment = require('moment');
var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var formatTimeAmount = require('../util/formatTimeAmount');
var Colors = require('../constants/Colors');
var Emoji = require('../constants/Emoji');
var TrainTypes = require('../constants/TrainTypes');
var TripStore = require('../stores/TripStore');
var TimeTables = require('../time_tables/TimeTables');
var EmojiRowEndView = require('../views/EmojiRowEndView');
var CallToActionRowView = require('../views/CallToActionRowView');
var ListRowView = require('../views/ListRowView');
var BackgroundCoverView = require('../views/BackgroundCoverView');

var TimesView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    var stopOneID = TripStore.getDepartureStationID();
    var stopTwoID = TripStore.getArrivalStationID();
    // Key by stops so this will refresh in case we change.
    // Another thing to keep in mind is if we have departure
    // time offsets.
    var key = stopOneID + stopTwoID;

    return (
      <View key={key}>
        {this.renderImpl()}
      </View>
    );
  },

  renderImpl: function() {
    var stopOneID = TripStore.getDepartureStationID();
    var stopTwoID = TripStore.getArrivalStationID();
    var routes = TimeTables.getRoutesForTrip(
      new Date(),
      stopOneID,
      stopTwoID
    );

    // TODO -- scared emoji
    if (!routes) {
      return (
        <View>
          <Text>
            Oh no! We didn{"'"}t find any
            routes for the stations you selected.
            This usually doesn{"'"}t happen --
            are you sure CalTrain stops at those
            stations?
          </Text>
        </View>
      );
    }

    // TODO -- some kind of: header like
    // Heading FROM xx TO xx
    // List of times
    // Details view that expands
    // Make sure to key by maybe the routeInfo?
    return (
      <BackgroundCoverView imageName="jun_seita">
        <CallToActionRowView
          label="Sweet! Great ready for your trip">
          <EmojiRowEndView>
            {Emoji.HORIZONTAL_TRAFFIC_LIGHT}
            {Emoji.STATION}
            {Emoji.RUNNER}
          </EmojiRowEndView>
        </CallToActionRowView>
        <ScrollView style={styles.scrollView}>
          <View style={styles.scrollContainer}>
            {routes.map(route => this.renderRoute(route))}
          </View>
        </ScrollView>
      </BackgroundCoverView>
    );
  },

  renderRoute: function(route) {
    var trainType = route.train.type;
    // TODO -- colors for only the falsest routes
    return (
      <ListRowView
        nonText={true}
        style={styles.timeContainer}
        key={route.timeLeaving.getTime()}>
        <View style={[
            styles.rowContainer,
            this.getStyleForTrainType(trainType)
          ]}>
          <Text style={styles.trainHeader}>
            Train
            {' '}
            {route.train.id}
            <Text style={styles.boldText}>
              {this.renderTrainLabel(trainType)}
            </Text>
          </Text>
          <Text style={styles.infoText}>
            Departs
            {' '}
            <Text style={styles.boldText}>
              {moment(route.timeArriving).format('h:mm a')}
            </Text>
            {' '}
            taking
            {' '}
            <Text style={styles.boldText}>
              {formatTimeAmount(
                route.timeArriving - route.timeLeaving
              )}
            </Text>
          </Text>
          <Text style={styles.subText}>
            Leaves 
            {' '}
            {moment(route.timeArriving).fromNow()},
            arrives at
            {' '}
            {moment(route.timeArriving).format('h:mm a')}
          </Text>
        </View>
      </ListRowView>
    );
  },

  getStyleForTrainType: function(trainType) {
    switch (trainType) {
      case TrainTypes.LIMITED_STOP:
        return styles.limitedStop;
      case TrainTypes.BABY_BULLET:
      case TrainTypes.WEEKEND_BABY_BULLET:
        return styles.babyBullet;
    }
    return null;
  },

  renderTrainLabel: function(trainType) {
    switch (trainType) {
      case TrainTypes.LIMITED_STOP:
        return ' Limited Stop';
      case TrainTypes.BABY_BULLET:
        return ' Baby Bullet!';
      case TrainTypes.WEEKEND_BABY_BULLET:
        return ' Weekend Baby Bullet!';
    }
    return '';
  },
  
});

var styles = StyleSheet.create({
  babyBullet: {
    backgroundColor: Colors.SHE_DRESSED_ME,
  },
  limitedStop: {
    backgroundColor: Colors.DEEPER,
  },
  trainHeader: {
    fontSize: 10,
    color: '#CCC'
  },
  infoText: {
    color: '#EEE'
  },
  subText: {
    fontSize: 10,
    color: '#CCC'
  },
  rowContainer: {
    padding: 8,
    flex: 1,
  },
  timeContainer: {
    backgroundColor: Colors.GREY,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
  }
});

module.exports = TimesView;
