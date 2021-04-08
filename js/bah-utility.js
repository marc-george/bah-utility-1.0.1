(function () {
  'use strict';

  Polymer({

    is: 'bah-utility',

    properties: {
      globalKey: {
        type: String,
        value: '_apphub'
      },

      state: {
        type: String,
        value: 'state'
      },

      locations: {
        type: Array,
        value: ['main', 'settings', 'profile']
      }
    },

    /**
     * Given a microapp id, get the path to the microapp
     * If no id is supplied, returns the path to the current microapp
     * ```
     * let url = apphub.getPath('analytics');
     * ```
     */
    getPath: function (uappId) {
      let id = uappId ? uappId : this.getCurrentApp();
      return window.nav && window.nav.paths[id] ? window.nav.paths[id] : this.getContext();
    },

    /**
     * Return the id of the current microapp
     * ```
     * let url = apphub.getPath(apphub.getCurrentApp());
     * ```
     */
    getCurrentApp: function () {
      var id;
      let curPath = window.location.pathname.toLowerCase(); // this is how they appear in window.nav
      let navItems = window.nav && window.nav.paths ? window.nav.paths : {};

      for (let key in window.nav) {
        if (window.nav.hasOwnProperty(key) && this.locations.indexOf(key) !== -1) {
          let region = window.nav[key];
          for (let i = 0, len = region.items.length; i < len; i++) {
            let item = region.items[i];
            let nextId = item.id.substring(0, item.id.lastIndexOf('.'));
            let itemPath = new RegExp('^'+navItems[nextId] + '/', 'i');
            if(navItems.hasOwnProperty(nextId) && itemPath.test(curPath)) {
              id = nextId;
              break;
            }
          }
          if (id) {
            break;
          }
        }
      }
      return id ? id : null;
    },

    /**
     * Save some global (cross micro-app) state to local storage.
     * Merges passed object with current state.
     * @param {Object} value - an object holding the state to save
     * ```
     * apphub.setState(value);
     * ```
     */
    setState: function (value) {
      // require an object here
      if (typeof value === 'object') {
        let curState = this.getLocalStore(this.state, this.globalKey);
        // merge in new state
        for (let p in value) {
          if (value.hasOwnProperty(p)) {
            curState[p] = value[p];
          }
        }
        this.setLocalStore(this.state, curState, this.globalKey);
      } else {
        console.error('setState() called without an object to store');
      }
    },

    /**
     * Retrieve the global (cross-microapp) state from local storage.
     * @returns {Object} - if there is no local storage associated with
     * the passed key, an empty object is returned.
     * ```
     * let curState = apphub.getState();
     * ```
     */
    getState: function () {
      return this.getLocalStore(this.state, this.globalKey);
    },

    /**
     * Save some app-specific info to local storage
     * @param {string} key - the key used to store/retrieve the value
     * @param {Object} value - an object holding the value to save
     * @param {string=} appId - the appId to associate the key with.
     * Defaults to the current microapp.
     * ```
     * apphub.setLocalStore(key, value);
     * ```
     */
    setLocalStore: function (key, value, appId) {
      let k = (appId || this.getCurrentApp()) + ':' + key;
      window.sessionStorage.setItem(k, JSON.stringify(value));
    },

    /**
     * Tests to see if local storage exists for the key.
     * appId is optional - defaults to current app.
     * @param {string} key - the key used to store/retrieve the value
     * @param {string=} appId - the appId to associate the key with.
     * Defaults to the current microapp.
     * @returns {Boolean} - true if there is local storage associated with the passed key
     * ```
     * if (apphub.getLocalStore('prefs')) {...;
     * ```
     */
    hasLocalStore: function (key, appId) {
      let app = appId || this.getCurrentApp();
      return window.sessionStorage.getItem(app + ':' + key) ? true : false;
    },

    /**
     * Get app-specific info from local storage. appId is optional - defaults to current app.
     * @param {string} key - the key used to store/retrieve the value
     * @param {string=} appId - the appId to associate the key with.
     * Defaults to the current microapp.
     * @returns {Object} - if there is no local storage associated with
     * the passed key, an empty object is returned.
     * ```
     * let myvalue = apphub.getLocalStore('prefs');
     * ```
     */
    getLocalStore: function (key, appId) {
      let app = appId || this.getCurrentApp();
      let v = window.sessionStorage.getItem(app + ':' + key) || '{}';
      return JSON.parse(v);
    },

    /**
     * Remove app-specific info from local storage. appId is optional - defaults to current app.
     * @param {string} key - the key used to store/retrieve the value
     * @param {string=} appId - the appId to associate the key with.
     * Defaults to the current microapp.
     * @returns nothing
     * ```
     * apphub.removeLocalStore('prefs');
     * ```
     */
    removeLocalStore: function (key, appId) {
      let app = appId || this.getCurrentApp();
      window.sessionStorage.removeItem(app + ':' + key);
    },

    /**
     * Return true if the app for the passed appId is accessible by the current user
     * ```
     * let appAvailable = apphub.appAvailable('someMicroappId');
     * ```
     */
    appAvailable: function (uappId) {
      return this.getPath(uappId) !== this.getContext();
    },

    /**
     * Convenience function to get the current multi-tenant context
     */
    getContext: function () {
      return window.nav && window.nav.contextPath ? window.nav.contextPath : '';
    },

    /**
     * Send message to pxh chrome oasts and notifications,
     * this feature provides visual banner and notification queue list
     * to user for notification purpose. Toasts are little messages
     * for the user that appear at the bottom of the viewport
     * on mobile, and at the upper-right corner of the browser window
     * on tablet and mobile. Calling this method with required
     * message object will get pxh chrome to show the message banner
     * from top-down fashion, the same message will also be
     * added in the notification list section next to the bottom of the navigation bar.
     * @param {Object} configuration object containing your application
     * specific message plus several other
     * properties that you can configure:
     *   - icon : css class using font awesome (you can use all supported class see http://fontawesome.io/icons/)
     *   - type : color (blue,red,orange,green)
     *   - text : message text that you intend to notify user
     *   - persistence: boolean, if false, then banner dismisses in a few seconds
     *   - timestamp: time stamp(optional) if you choose to add this information
     *   - actionLabel: action button text(optional)
     * if you would like to provide button for other user interaction
     *   - actionCallback: call back function(optional)
     * when user clicks the action button on the toast banner
     *   - actionLink: href(optional) that it will navigate user to when clicked
     * Note: if you provide actionLink, do not provide actioinCallback as the same time.
     * ```
     * //In your controller, after you inject appHubService
     *
     *    let messageObj = {
     *      type: 'red',
     *      isPersistent: true,
     *      icon: 'exclamation-circle',
     *      text: 'Red Alert! System needs maintenance!',
     *      actionLabel: 'OK',
     *      timestamp: '9:55 AM',
     *      actionCallback:  function(){ } //your call back function
     *     };
     *
     *    this.$.bahUtility.notify(messageObj);
     *
     *
     *    let messageObjEx2 = {
     *      type: 'orange',
     *      isPersistent: false,
     *      icon: 'rocket',
     *      text: 'Calculation starting...'
     *     };
     *
     *    this.$.bahUtility.notify(messageObjEx2);
     *
     *
     *    let messageObjEx3 = {
     *      type: 'blue',
     *      isPersistent: false,
     *      icon: 'thumbs-o-up',
     *      text: 'Room temperature is rising by 2 degree',
     *      actionLabel: 'Go to google',
     *      actionLink: 'http://google.com'
     *     };
     *
     *    this.$.bahUtility.notify(messageObjEx3);
     * ```
     */
    notify: function (message) {
      var event = new CustomEvent('apphub.notify', {detail: {message: message}});
      window.dispatchEvent(event);
    },

    /**
     * Notifies an alert message
     * ```
     * this.$.bahUtility
     *  .alert('error', 'Error loading alert types');
     * ```
     * @param {String} type - type of message
     * @param {String} message - message to send
     */
    alert: function (type, message) {
      type = type.toUpperCase();
      let alert = {
        text: message,
        isPersistent: false
      };
      switch (type) {
        case 'ERROR':
          alert.type = 'red';
          alert.icon = 'warning';
          break;
        case 'INFO':
          alert.type = 'blue';
          alert.icon = 'info';
          break;
        case 'SUCCESS':
          alert.type = 'green';
          alert.icon = 'check';
          break;
        default:
          alert.type = 'blue';
          alert.icon = 'info';
          break;
      }
      this.notify(alert);
    },

    /**
     * Remove all pxh chrome notification list and toast messages on the page
     * ```
     * //In your controller, after you inject appHubService
     * this.$.bahUtility.removeAllNotification();
     *
     * ```
     * */
    removeAllNotification: function () {
      var event = new CustomEvent('apphub.notify', {detail: {message: null, action: 'removeAll'}});
      window.dispatchEvent(event);
    },

    /**
     * returns user preferred locale key if it is declared
     * If locale key is found, returns the empty string
     * ```
     * let localeKey = apphub.getPreferredLocale();
     * ```
     */
    getPreferredLocale: function () {
      return window.nav
        && window.nav.user
        && window.nav.user.preferredLocale ? window.nav.user.preferredLocale : '';
    }

  });
}());
