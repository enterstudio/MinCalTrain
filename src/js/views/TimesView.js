var moment = require('moment');
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var formatTimeAmount = require('../util/formatTimeAmount');
var Colors = require('../constants/Colors');
var Emoji = require('../constants/Emoji');
var TrainTypes = require('../constants/TrainTypes');
var TripStore = require('../stores/TripStore');
var TimeStore = require('../stores/TimeStore');
var TimeTables = require('../time_tables/TimeTables');
var EmojiRowEndView = require('../views/EmojiRowEndView');
var CallToActionRowView = require('../views/CallToActionRowView');
var ListRowView = require('../views/ListRowView');
var Stations = require('../constants/Stations');
var Analytics = require('../util/Analytics');
var BorderedScrollView = require('../views/BorderedScrollView');
var BackgroundCoverView = require('../views/BackgroundCoverView');

var TimesView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  componentDidMount: function() {
    Analytics.logChoseTrip();
  },

  render: function() {
    var departureID = TripStore.getDepartureStationID();
    var arrivalID = TripStore.getArrivalStationID();
    // Key by stops so this will refresh in case we change.
    // Another thing to keep in mind is if we have departure
    // time offsets.
    var key = departureID + arrivalID;

    return (
      <View style={styles.metaContainer} key={key}>
        <BackgroundCoverView imageName="jun_seita">
          <View style={styles.headerSpacer} />
          {this.renderImpl()}
        </BackgroundCoverView>
      </View>
    );
  },

  renderImpl: function() {
    var departureID = TripStore.getDepartureStationID();
    var arrivalID = TripStore.getArrivalStationID();
    var nowDate = TimeStore.getDesiredDepartureDate();
    var routes = TimeTables.getRoutesForTrip(
      nowDate,
      departureID,
      arrivalID
    );

    if (!routes.length) {
      // Check if this is just a rando error or we train
      // would have gone here earlier in the day
      var todayRoutes = TimeTables.getRoutesForTrip(
        new Date(moment(nowDate).startOf('day').format()),
        departureID,
        arrivalID
      );
      if (todayRoutes.length) {
        return (
          <View style={styles.noStopsText}>
            <Text>
              Ah
              {' '}
              {Emoji.DISAPPOINTED_FACE}
              {' '}
              There are no more trains running to
              {' '}
              {Stations.getStationName(arrivalID)}
              {' '}
              today. Seems like you missed the last one...
              try tomorrow?
            </Text>
          </View>
        );
      } 

      // Weird bug -- just explain it
      return (
        <View style={styles.noStopsText}>
          <Text>
            Oh no! 
            {Emoji.FACE_SCARED}
            We didn{"'"}t find any
            routes for the stations you selected.
            This usually doesn{"'"}t happen --
            are you sure CalTrain stops at those
            stations after this time?
          </Text>
        </View>
      );
    }

    var routeTimes = TimeTables.getSortedRouteTimes(routes);
    return (
      <View style={styles.metaContainer}>
        <CallToActionRowView
          label="Have fun on your trip!">
          <EmojiRowEndView>
            {Emoji.HORIZONTAL_TRAFFIC_LIGHT}
          </EmojiRowEndView>
        </CallToActionRowView>
        {this.renderHeader(routeTimes)}
        <View style={styles.divider} />
        <BorderedScrollView>
          <View style={styles.scrollContainer}>
            {routes.map(route => this.renderRoute(route, routeTimes))}
          </View>
        </BorderedScrollView>
      </View>
    );
  },

  renderRoute: function(route, routeTimes) {
    var trainType = route.train.type;
    var nowDate = TimeStore.getDesiredDepartureDate();
    return (
      <ListRowView
        nonText={true}
        style={styles.timeContainer}
        key={route.timeLeaving.getTime()}>
        <View style={[
            styles.rowContainer,
            this.getStyleForTrainDuration(route, routeTimes)
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
              {moment(route.timeLeaving).format('h:mm a')}
            </Text>
            {' '}
            taking
            {' '}
            <Text style={styles.boldText}>
              {formatTimeAmount.formatMilliseconds(
                route.timeArriving - route.timeLeaving
              )}
            </Text>
          </Text>
          <Text style={styles.subText}>
            Leaves 
            {' '}
            {moment(route.timeLeaving).from(nowDate)},
            arrives at
            {' '}
            {moment(route.timeArriving).format('h:mm a')}
          </Text>
        </View>
      </ListRowView>
    );
  },

  renderHeader: function(routeTimes) {
    var departureID = TripStore.getDepartureStationID();
    var arrivalID = TripStore.getArrivalStationID();
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          <Text style={styles.boldText}>
            {Stations.getStationName(departureID) + ' '}
          </Text>
          to
          <Text style={styles.boldText}>
            {' ' + Stations.getStationName(arrivalID)}
          </Text>
        </Text>
        {this.renderTimeRange(routeTimes)}
      </View>
    );
  },

  renderTimeRange: function(routeTimes) {
    if (routeTimes.length <= 1) {
      return (
        <Text style={styles.subHeaderText}>
          {formatTimeAmount.formatMinutesAbbrev(routeTimes[0])}
        </Text>
      );
    }
    return (
      <Text style={styles.subHeaderText}>
        {formatTimeAmount.formatMinutesAbbrev(routeTimes[0])}
        {' - '}
        {formatTimeAmount.formatMinutesAbbrev(routeTimes[routeTimes.length - 1])}
      </Text>
    );
  },

  getStyleForTrainDuration: function(route, routeTimes) {
    if (routeTimes.length === 1) {
      // Only one time, so dont bother
      return null;
    }

    var routeTime = TimeTables.getMinutesForRoute(route);
    var isBase = routeTimes.indexOf(routeTime) === routeTimes.length - 1;
    if (isBase) {
      // Dont bother highlighting the base
      return null;
    }

    var howMuchBetter = routeTimes.length - routeTimes.indexOf(routeTime);
    // We only have 4 colors though so cap against that.
    howMuchBetter = Math.max(
      howMuchBetter - Math.max(routeTimes.length - 4, 0),
      0,
    );
    switch (howMuchBetter) {
      case 4:
        return {
          backgroundColor: '#19bbd1'
        };
      case 3:
        return {
          backgroundColor: '#0090a3',
        };
      case 2:
        return {
          backgroundColor: '#006c7a',
        };
      case 1:
        return {
          backgroundColor: '#004851',
        };
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
  headerSpacer: {
    height: 60,
  },
  metaContainer: {
    flex: 1,
  },
  noStopsText: {
    backgroundColor: Colors.SHE_DRESSED_ME,
    padding: 12
  },
  trainHeader: {
    fontSize: 10,
    color: '#CCC'
  },
  infoText: {
    color: '#EEE',
    fontSize: 18,
  },
  subText: {
    fontSize: 12,
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
  boldText: {
    fontWeight: 'bold',
  },
  headerContainer: {
    backgroundColor: Colors.DEEPER,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  headerText: {
    fontSize: 20,
    color: '#EEE'
  },
  subHeaderText: {
    fontSize: 14,
    color: '#EEE'
  },
  divider: {
    height: 1,
    backgroundColor: '#000'
  }
});

module.exports = TimesView;
