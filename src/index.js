'use strict';

const {
  DEFAULT_INTERVAL_TIME_IN_MS,
  DEFAULT_RUN_IMMEDIATE
} = require('./constants');

/**
 * SetTimeout main class holder
 * It will hold all necessary methods that will be available
 */
class SetTimeout {
  /**
   * SetTimeout constructor
   */
  constructor () {
    this._name = 'SetTimeout';
    this._requestAnimationFrame = undefined;
    this._cancelAnimationFrame = undefined;
    if (!this.isSupported()) {
      throw new Error(`requestAnimationFrame is missing. This library will not be supported!`);
    }

    // application specific variables
    this._running = false;
    this._runId = undefined;
    this._lastUpdate = null;
    this._runnable = undefined;
    this._intervalDurationInMs = DEFAULT_INTERVAL_TIME_IN_MS;
    this._delta = 0;
    this.runInternal = this.runInternal.bind(this);
  }

  /**
   * @private
   * Check whether the library is supported or not.
   * This is actually a wrapper of requestAnimationFrame function. So, application that does not
   * support requestAnimationFrame, will also not support this library
   */
  isSupported () {
    // eslint-disable-next-line no-undef
    const refRequestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    const refCancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
      window.cancelAnimationFrame || window.cancelAnimationFrame;

    if (refRequestAnimationFrame && refCancelAnimationFrame &&
      typeof refRequestAnimationFrame === 'function' && typeof refCancelAnimationFrame === 'function') {
      this._requestAnimationFrame = refRequestAnimationFrame.bind(window);
      this._cancelAnimationFrame = refCancelAnimationFrame.bind(window);
      return true;
    }
    return false;
  }

  /**
   * @private
   * @return {number} returns current time in millisecond
   */
  getTimeInMs () {
    if (window.performance && typeof window.performance.now === 'function') {
      return window.performance.now();
    }
    return Date.now();
  }

  /**
   * @private
   * Internal function runner. It will take care of running the repeated work
   */
  runInternal (iterationCount = -1) {
    if (iterationCount === 0) {
      this.stop();
      return;
    }
    const now = this.getTimeInMs();
    const diff = now - this._lastUpdate;
    if (diff >= this._intervalDurationInMs - this._delta) {
      this._runnable();
      this._lastUpdate = now;
      this._delta = diff - this._intervalDurationInMs;
    }
    if (!this._running) {
      return;
    }
    if (iterationCount === -1) {
      this._runId = this._requestAnimationFrame(this.runInternal);
    } else {
      this._runId = this._requestAnimationFrame(this.runInternal.bind(iterationCount - 1));
    }
  }

  /**
   * @public
   * Calling this function will start the timer
   * @param {Function|undefined} runnable The function that you would like to run. Default is undefined. And a must have parameter
   * @param {Number} intervalDurationInMs Execute frequently in millisecond. Minimum value is DEFAULT_INTERVAL_TIME_IN_MS
   * @param {Number} iterationCount Total number of iteration it will execute before stopped default is unlimited
   * @param {Boolean} runImmediate It determines whether you want to execute your function immediately, or after given interval. Default if false
   */
  start (
    runnable = undefined,
    intervalDurationInMs = DEFAULT_INTERVAL_TIME_IN_MS,
    runImmediate = DEFAULT_RUN_IMMEDIATE,
    iterationCount = -1
  ) {
    if (!(runnable && typeof runnable === 'function')) {
      throw new Error(`expecting a function type as 'runnable' param.`);
    }
    if (this._running) {
      throw new Error(`already running. call stop to return`);
    }
    this._runnable = runnable;
    this._intervalDurationInMs = Math.max(intervalDurationInMs, DEFAULT_INTERVAL_TIME_IN_MS);

    this._lastUpdate = runImmediate ? 0 : this.getTimeInMs();
    this._running = true;
    this._delta = 0;
    this.runInternal(iterationCount);
  }

  /**
   * @public
   * Calling this function will stop the timer
   * You can call stop method at any time during the application lifecycle
   * That means, it can also be called to cancel an ongoing setTimeout call
   */
  stop () {
    if (this._runId) {
      this._running = false;
      this._delta = 0;
      this._cancelAnimationFrame(this._runId);
    }
  }
}

module.exports = SetTimeout;
