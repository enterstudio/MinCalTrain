/**
 * Modified from NavigatorBreadcrumbNavigationBar
 */
'use strict';

var BreadcrumbNavigationBarStyles = require('../views/BreadcrumbNavigationBarStyles');
var React = require('react-native');
var {
  StaticContainer,
  StyleSheet,
  View,
} = React;
var StaticContainer = require('StaticContainer.react');

var Interpolators = BreadcrumbNavigationBarStyles.Interpolators;
var PropTypes = React.PropTypes;

function invariant(test, msg) {
  if (!test) {
    throw new Error(msg);
  }
}

/**
 * Reusable props objects.
 */
var CRUMB_PROPS = Interpolators.map(() => {return {style: {}};});
var ICON_PROPS = Interpolators.map(() => {return {style: {}};});
var TITLE_PROPS = Interpolators.map(() => {return {style: {}};});
var RIGHT_BUTTON_PROPS = Interpolators.map(() => {return {style: {}};});
var CONTAINER_PROPS = Interpolators.map(() => {return {style: {}}; });

var navStatePresentedIndex = function(navState) {
  if (navState.presentedIndex !== undefined) {
    return navState.presentedIndex;
  }
  // TODO: rename `observedTopOfStack` to `presentedIndex` in `NavigatorIOS`
  return navState.observedTopOfStack;
};

var STARTING_HEIGHT = 20;
var EXPANDED_HEIGHT = 44;

/**
 * The first route is initially rendered using a different style than all
 * future routes.
 *
 * @param {number} index Index of breadcrumb.
 * @return {object} Style config for initial rendering of index.
 */
var initStyle = function(index, presentedIndex) {
  return index === presentedIndex ? BreadcrumbNavigationBarStyles.Center[index] :
    index < presentedIndex ? BreadcrumbNavigationBarStyles.Left[index] :
    BreadcrumbNavigationBarStyles.Right[index];
};

var BreadcrumbNavigationBar = React.createClass({
  propTypes: {
    navigator: PropTypes.shape({
      push: PropTypes.func,
      pop: PropTypes.func,
      replace: PropTypes.func,
      popToRoute: PropTypes.func,
      popToTop: PropTypes.func,
    }),
    routeMapper: PropTypes.shape({
      rightContentForRoute: PropTypes.func,
      titleContentForRoute: PropTypes.func,
      iconForRoute: PropTypes.func,
    }),
    navState: React.PropTypes.shape({
      routeStack: React.PropTypes.arrayOf(React.PropTypes.object),
      idStack: React.PropTypes.arrayOf(React.PropTypes.number),
      presentedIndex: React.PropTypes.number,
    }),
    style: View.propTypes.style,
  },

  statics: {
    Styles: BreadcrumbNavigationBarStyles,
  },

  _updateIndexProgress: function(progress, index, fromIndex, toIndex) {
    var amount = toIndex > fromIndex ? progress : (1 - progress);
    var oldDistToCenter = index - fromIndex;
    var newDistToCenter = index - toIndex;
    var interpolate;
    invariant(
      Interpolators[index],
      'Cannot find breadcrumb interpolators for ' + index
    );
    if (oldDistToCenter > 0 && newDistToCenter === 0 ||
        newDistToCenter > 0 && oldDistToCenter === 0) {
      interpolate = Interpolators[index].RightToCenter;
    } else if (oldDistToCenter < 0 && newDistToCenter === 0 ||
               newDistToCenter < 0 && oldDistToCenter === 0) {
      interpolate = Interpolators[index].CenterToLeft;
    } else if (oldDistToCenter === newDistToCenter) {
      interpolate = Interpolators[index].RightToCenter;
    } else {
      interpolate = Interpolators[index].RightToLeft;
    }

    if (interpolate.Crumb(CRUMB_PROPS[index].style, amount)) {
      this.refs['crumb_' + index].setNativeProps(CRUMB_PROPS[index]);
    }
    if (interpolate.Icon(ICON_PROPS[index].style, amount)) {
      this.refs['icon_' + index].setNativeProps(ICON_PROPS[index]);
    }
    if (interpolate.Title(TITLE_PROPS[index].style, amount)) {
      this.refs['title_' + index].setNativeProps(TITLE_PROPS[index]);
    }
    var right = this.refs['right_' + index];
    if (right &&
        interpolate.RightItem(RIGHT_BUTTON_PROPS[index].style, amount)) {
      right.setNativeProps(RIGHT_BUTTON_PROPS[index]);
    }
  },

  updateProgress: function(progress, fromIndex, toIndex) {
    var max = Math.max(fromIndex, toIndex);
    var min = Math.min(fromIndex, toIndex);
    for (var index = min; index <= max; index++) {
      this._updateIndexProgress(progress, index, fromIndex, toIndex);
    }

    // animate height for meta bar, but only if its not the about view
    var foundAbout = this.props.navState && this.props.navState.routeStack.filter(
      route => route.id === 'ABOUT'
    ).length > 0;
    if (fromIndex == 0 || toIndex == 0) {
      var amount = toIndex > fromIndex ? progress : (1 - progress);
      if (foundAbout) {
        this.refs['container'].setNativeProps({
          style: {
            opacity: 1 - amount,
          }
        });
      } else {
        this.refs['container'].setNativeProps({
          style: {
            height: STARTING_HEIGHT + amount * EXPANDED_HEIGHT,
          }
        });
      }
    }
  },

  onAnimationStart: function(fromIndex, toIndex) {
    var max = Math.max(fromIndex, toIndex);
    var min = Math.min(fromIndex, toIndex);
    for (var index = min; index <= max; index++) {
      this._setRenderViewsToHardwareTextureAndroid(index, true);
    }
  },

  onAnimationEnd: function() {
    var max = this.props.navState.routeStack.length - 1;
    for (var index = 0; index <= max; index++) {
      this._setRenderViewsToHardwareTextureAndroid(index, false);
    }
  },

  _setRenderViewsToHardwareTextureAndroid: function(index, renderToHardwareTexture) {
    return;
    var props = {
      renderToHardwareTextureAndroid: renderToHardwareTexture,
    };

    this.refs['icon_' + index].setNativeProps(props);
    this.refs['title_' + index].setNativeProps(props);
    var right = this.refs['right_' + index];
    if (right) {
      right.setNativeProps(props);
    }
  },

  render: function() {
    var navBarRouteMapper = this.props.routeMapper;
    var navState = this.props.navState;
    var icons = navState && navState.routeStack.map(this._renderOrReturnBreadcrumb);
    var titles = navState.routeStack.map(this._renderOrReturnTitle);

    return (
      <View ref="container" style={[styles.breadCrumbContainer, this.props.style]}>
        {titles}
        {icons}
      </View>
    );
  },

  _renderOrReturnBreadcrumb: function(route, index) {
    var uid = this.props.navState.idStack[index];
    var navBarRouteMapper = this.props.routeMapper;
    var navOps = this.props.navigator;
    var alreadyRendered = this.refs['crumbContainer' + uid];
    if (alreadyRendered) {
      // Don't bother re-calculating the children
      return (
        <StaticContainer
          ref={'crumbContainer' + uid}
          key={'crumbContainer' + uid}
          shouldUpdate={false}
        />
      );
    }
    var firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));
    return (
      <StaticContainer
        ref={'crumbContainer' + uid}
        key={'crumbContainer' + uid}
        shouldUpdate={false}>
        <View ref={'crumb_' + index} style={firstStyles.Crumb}>
          <View ref={'icon_' + index} style={firstStyles.Icon}>
            {navBarRouteMapper.iconForRoute(route, navOps)}
          </View>
        </View>
      </StaticContainer>
    );
  },

  _renderOrReturnTitle: function(route, index) {
    var navState = this.props.navState;
    var uid = navState.idStack[index];
    var alreadyRendered = this.refs['titleContainer' + uid];
    if (alreadyRendered) {
      // Don't bother re-calculating the children
      return (
        <StaticContainer
          ref={'titleContainer' + uid}
          key={'titleContainer' + uid}
          shouldUpdate={false}
        />
      );
    }
    var navBarRouteMapper = this.props.routeMapper;
    var titleContent = navBarRouteMapper.titleContentForRoute(
      navState.routeStack[index],
      this.props.navigator
    );
    var firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));
    return (
      <StaticContainer
        ref={'titleContainer' + uid}
        key={'titleContainer' + uid}
        shouldUpdate={false}>
        <View ref={'title_' + index} style={firstStyles.Title}>
          {titleContent}
        </View>
      </StaticContainer>
    );
  },

});

var styles = StyleSheet.create({
  breadCrumbContainer: {
    overflow: 'hidden',
    position: 'absolute',
    height: STARTING_HEIGHT,
    top: 0,
    left: 0,
    right: 0,
  },
});

module.exports = BreadcrumbNavigationBar;
