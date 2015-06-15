var React = require('react-native');
var {
  ScrollView,
  Text,
  View,
} = React;

var Emoji = require('../constants/Emoji');
var Routes = require('../constants/Routes');
var StationSelectView = require('../views/StationSelectView');
var TripActions = require('../actions/TripActions');
var TripStore = require('../stores/TripStore');
var EmojiRowEndView = require('../views/EmojiRowEndView');
var CallToActionRowView = require('../views/CallToActionRowView');
var BackgroundCoverView = require('../views/BackgroundCoverView');

var DepartureSelectView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <BackgroundCoverView imageName="smif">
        <CallToActionRowView
          label="Departing from?">
          <EmojiRowEndView>
            {Emoji.TRAIN}
            {Emoji.RIGHT_ARROW}
          </EmojiRowEndView>
        </CallToActionRowView>
        <StationSelectView
          onStationSelect={(stationID) => {
            TripActions.selectDeparture(stationID);
            this.props.navigator.push(
              Routes.getRouteForID(Routes.SELECT_ARRIVAL)
            );
          }}
        />
      </BackgroundCoverView>
    );
  },
});

module.exports = DepartureSelectView;
