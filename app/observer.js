const global = window;

(function () {
    'use strict';

    let instance;

    /**
     * Function-constructor which creates only one instance of object
     * which used for saving triggering and listening of custom events
     * */
    function EventObserver() {
        if (instance) {
            return instance;
        }

        instance = this;

        this.eventCollection = [];
    }

    /**
     * Add event listener which will reacts on certain events using function-handlers
     * @param eventType {String} sets event name(type)
     * @param eventHandler {Function} function which will be used when event happens
     * */
    EventObserver.prototype.addEventListener = function (eventType, eventHandler) {
        this.eventCollection.push({
            eventType: eventType,
            eventHandler: eventHandler
        });
    };

    /**
     * Trigger event of certain type
     * @param eventType {String} checks event name(type)
     * @param arg {any} parameters which will be given to handler
     * */
    EventObserver.prototype.triggerEvent = function (eventType, arg) {
        let _this = this;

        for (let i = _this.eventCollection.length - 1; i >= 0; i--) {
            if (_this.eventCollection[i].eventType === eventType) {
                _this.eventCollection[i].eventHandler(arg);
            }
        }
    };

    /**
     * Remove event listener
     * @param eventType {String} checks event name(type) to be removed
     * @param eventHandler {Function} checks function handler to be removed
     * */
    EventObserver.prototype.removeEventListener = function (eventType, eventHandler) {
        let _this = this;

        for (let i = _this.eventCollection.length - 1; i >= 0; i--) {
            if (_this.eventCollection[i].eventType === eventType && _this.eventCollection[i].eventHandler === eventHandler) {
                _this.eventCollection.splice(i, 1);
            }
        }
    };

    /**
     * Remove all event listeners
     */
    EventObserver.prototype.removeAllListeners = function removeAllListeners() {

        this.eventCollection = [];
    };

    global.EventObserver = new EventObserver();

})();