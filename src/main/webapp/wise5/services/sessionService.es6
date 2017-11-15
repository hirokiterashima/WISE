class SessionService {
  constructor($http,
              $rootScope,
              ConfigService
              //StudentDataService) {
  ) {
    this.$http = $http;
    this.$rootScope = $rootScope;
    this.ConfigService = ConfigService;
    this.initialized = false;

    /*
     * The amount of user inactive time (in milliseconds) before we display
     * a warning message asking if they want to stay logged in.
     */
    this.warningInterval = this.convertMinutesToMilliseconds(25);

    /*
     * The amount of time (in milliseconds) after the warning message is
     * displayed at which we automatically log out the user.
     */
    this.logOutInterval = this.convertMinutesToMilliseconds(5);

    /*
     * The amount of time (in milliseconds) before we check if there were
     * any mouse events.
     */
    this.checkMouseEventInterval = this.convertMinutesToMilliseconds(1);

    /*
     * the timestamp when the last mouse event occurred
     */
    this.lastMouseEventTimestamp = null;

    /*
     * boolean value used to determine if we need to log out the
     * user or just bring them back to the home page when we exit
     * the VLE
     */
    this.performLogOut = false;

    // the active warning ids
    this.warningIds = [];

    // the active log out ids
    this.logOutIds = [];

    /**
     * Listen for the 'componentDoneUnloading' event. When the user logs
     * out of the VLE, we will need to wait for certain components to
     * finish performing any necessary processing (such as saving) before
     * we actually log out. Once a component has completed their unloading
     * they will fire the 'componentDoneUnloading' event. We will listen
     * for this event and when there are no more components left to wait
     * for, we will then log out.
     */
    this.$rootScope.$on('doneExiting', () => {

      // check if all components are done unloading so we can exit
      // no longer needed.
      //this.attemptExit();
    });

    /**
     * Listen for the 'goHome' event. We will attempt to go home when
     * the 'goHome' even is fired. There may be components that have not
     * saved their data yet so we may not be able to go home right away.
     * If there are components that have not saved their data yet, we
     * will wait for those components to fire the 'componentDoneUnloading'
     * event and then try to go home again.
     */
    this.$rootScope.$on('goHome', () => {

      // let other components know that we are exiting
      this.$rootScope.$broadcast('exit');

      // check if all components are done unloading so we can exit
      this.attemptExit();
    });

    /**
     * Listen for the 'logOut' event. We will attempt to log out when
     * the 'logOut' even is fired. There may be components that have not
     * saved their data yet so we may not be able to log out right away.
     * If there are components that have not saved their data yet, we
     * will wait for those components to fire the 'componentDoneUnloading'
     * event and then try to log out again.
     */
    this.$rootScope.$on('logOut', () => {

      /*
       * set the perform log out boolean to true so that we know to
       * log out the user later
       */
      this.performLogOut = true;

      // let other components know that we are exiting
      this.$rootScope.$broadcast('exit');

      // check if all components are done unloading so we can exit
      this.attemptExit();
    });
  }

  /**
   * Start the timers, save session initialized event
   */
  initializeSession() {
    if (!this.initialized) {
      this.initialized = true;
      if (this.ConfigService.isPreview()) {
        // no session management for previewers
        return;
      }

      this.startWarningTimer();
      this.startCheckMouseEventTimer();
    }
  };

  /**
   * Start the warning timer. When the warning timer expires, we will display
   * a warning message to the user asking them if they want to stay logged in.
   */
  startWarningTimer() {
    // clear all the previous warning timers
    this.clearWarningTimers();
    var warningId = setTimeout(angular.bind(this, this.showWarning), this.warningInterval);
    this.warningIds.push(warningId);
  }

  /**
   * Clear the warning timers
   */
  clearWarningTimers() {
    // clear all the active warning timeouts
    for (var w = 0; w < this.warningIds.length; w++) {

      // get a warning id
      var warningId = this.warningIds[w];

      // clear the timeout for the warning id
      clearTimeout(warningId);

      // remove the warning id from the array
      this.warningIds.splice(w, 1);

      // move the counter back now that we have removed a warning id
      w--;
    }
  }

  /**
   * Restart the warning time so that it starts counting from 0 again.
   */
  restartWarningTimer() {
    this.clearWarningTimers();
    this.startWarningTimer();
  }

  /**
   * Start the auto log out timer
   */
  startLogOutTimer() {
    // clear all the previou log out timers
    this.clearLogOutTimers();
    var logOutId = setTimeout(angular.bind(this, this.forceLogOut), this.logOutInterval);
    this.logOutIds.push(logOutId);
  };

  /**
   * Clear the log out timers
   */
  clearLogOutTimers() {
    // clear all the active log out timeouts
    for (var l = 0; l < this.logOutIds.length; l++) {

      // get a log out id
      var logOutId = this.logOutIds[l];

      // clear the timeout for the log out id
      clearTimeout(logOutId);

      // remove the log out id from the array
      this.logOutIds.splice(l, 1);

      // move the counter back now that we have removed a log out id
      l--;
    }
  }

  /**
   * Start the check mouse event timer
   */
  startCheckMouseEventTimer() {
    setInterval(angular.bind(this, this.checkMouseEvent), this.checkMouseEventInterval);
  };

  /**
   * Fire the event that will show the warning message
   */
  showWarning() {
    if (this.checkMouseEvent()) {
      // a mouse event has occurred recently so we don't need to show the warning
    } else {
      // a mouse event has not occurred recently so we will show the warning
      this.$rootScope.$broadcast('showSessionWarning');
      this.startLogOutTimer();
    }
  };

  /**
   * Renew the session with the server and refresh the local timers
   */
  renewSession() {
    var renewSessionURL = this.ConfigService.getConfigParam('renewSessionURL');
    // make a request to the log out url
    this.$http.get(renewSessionURL).then((result) => {
      var renewSessionResult = result.data;

      if (renewSessionResult === 'true') {
        // the session is still active
        this.clearLogOutTimers();
        this.restartWarningTimer();
      } else if (renewSessionResult === "requestLogout") {
        // WISE server is requesting that we log out
        this.$rootScope.$broadcast('showRequestLogout');
      } else {
        // User is no longer logged in (session is inactive)
        this.forceLogOut();
      }
    });
  };

  /**
   * Delete the existing timers
   */
  clearTimers() {
    this.clearWarningTimers();
    this.clearLogOutTimers();
  };

  /**
   * Called when the user moves the mouse
   */
  mouseMoved() {
    // get the current timestamp
    var date = new Date();
    var timestamp = date.getTime();

    // remember this timestamp
    this.lastMouseEventTimestamp = timestamp;
  };

  /**
   * Check if there were any mouse events since the last time we checked.
   * Currently we check every 1 minute which is based on the value of the
   * checkMouseEventInterval variable.
   * @returns whether there was a mouse event recently
   */
  checkMouseEvent() {
    var eventOccurred = false;

    if (this.lastMouseEventTimestamp != null) {
      // there was a mouse event since the last time we checked

      // reset the timers
      this.renewSession();

      // clear the mouse event timestamp
      this.lastMouseEventTimestamp = null;

      eventOccurred = true;
    }

    return eventOccurred;
  };

  /**
   * Convert minutes to milliseconds
   * @param minutes the number of minutes
   * @return the number of milliseconds
   */
  convertMinutesToMilliseconds(minutes) {
    var milliseconds = null;

    if (minutes != null) {
      // get the number of seconds
      var seconds = minutes * 60;

      // get the number of milliseconds
      milliseconds = seconds * 1000;
    }

    return milliseconds;
  };

  /**
   * Log out the user
   */
  forceLogOut() {
    /*
     * make a final check to see if there were any mouse events recently
     * before we log out the user
     */
    if (this.checkMouseEvent()) {
      // a mouse event has occurred so we will not log out the user
    } else {
      // a mouse event has not occurred recently so we will log out the user
      this.clearTimers();
      this.$rootScope.$broadcast('logOut');
    }
  };

  /**
   * Check if there are components that are not ready to exit
   * because they have not saved their data yet. If there are no
   * components left to wait for, we can then exit.
   */
  attemptExit() {
    // get all the components listening for the exit event
    var exitListenerCount = this.$rootScope.$$listenerCount.exit;

    /*
     * Check how many exit listeners are still listening for the
     * exit event. Components such as nodes will finish saving their
     * data and then be removed from the listener count.
     */
    if (exitListenerCount != null && exitListenerCount > 0) {
      // don't log out yet because there are still listeners
    } else {
      // there are no more listeners so we will exit
      var mainHomePageURL = this.ConfigService.getMainHomePageURL();

      if (this.performLogOut) {
        // log out the user and bring them to the home page

        // get the url that will log out the user
        var sessionLogOutURL = this.ConfigService.getSessionLogOutURL();

        // take user to log out url
        window.location.href = sessionLogOutURL;
      } else {
        /*
         * bring the user to the student or teacher home page but
         * do not log them out
         */

        // Get the wiseBaseURL e.g. /wise
        var wiseBaseURL = this.ConfigService.getWISEBaseURL();

        var homePageURL = '';

        // get the user type
        var userType = this.ConfigService.getConfigParam('userType');

        if (userType === 'student') {
          // send the user to the student home page
          homePageURL = wiseBaseURL + '/student';
        } else if (userType === 'teacher') {
          // send the user to the teacher home page
          homePageURL = wiseBaseURL + '/teacher';
        } else {
          // send the user to the main home page
          homePageURL = mainHomePageURL;
        }

        window.location.href = homePageURL;
      }
    }
  };
}

SessionService.$inject = [
  '$http',
  '$rootScope',
  'ConfigService'
];

export default SessionService;
