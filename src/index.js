'use strict';

import {
  DEFAULT_INTERVAL_TIME_IN_MS,
  DEFAULT_RUN_IMMEDIATE
} from './constants';

/**
 * SetTimeout main class holder
 * It will hold all necessary methods that will be available
 */
class SetTimeout {
  /**
   * SetTimeout constructor
   */
  constructor () {
    this.name = 'SetTimeout';
    this.requestAnimationFrame = undefined;
    this.cancelAnimationFrame = undefined;
    if (!this.isSupported()) {
      throw new Error(`requestAnimationFrame is missing. This library will not be supported!`);
    }

    // application specific variables
    this.canceled = true;
    this.runId = undefined;
    this.lastUpdate = null;
    this.runnable = undefined;
    this.intervalDurationInMs = DEFAULT_INTERVAL_TIME_IN_MS;
  }

  /**
   * @private
   * Check whether the library is supported or not.
   * This is actually a wrapper of requestAnimationFrame function. So, application that does not
   * support requestAnimationFrame, will also not support this library
   */
  isSupported () {
    // eslint-disable-next-line no-undef
    this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    this.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    if (this.requestAnimationFrame && this.cancelAnimationFrame &&
      typeof this.requestAnimationFrame === 'function' && typeof this.cancelAnimationFrame === 'function') {
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
  runInternal () {
    const now = this.getTimeInMs();
    if (now - this.lastUpdate > this.intervalDurationInMs) {
      this.runnable();
      this.lastUpdate = now;
    }
    if (this.canceled) {
      return;
    }
    this.runId = this.requestAnimationFrame(this.runInternal);
  }

  /**
   * @public
   * Calling this function will start the timer
   * @param {Function|undefined} runnable The function that you would like to run. Default is undefined. And a must have parameter
   * @param {Number} intervalDurationInMs Execute frequently in millisecond. Minimum value is DEFAULT_INTERVAL_TIME_IN_MS
   * @param {Boolean} It determines whether you want to execute your function immediately, or after given interval. Default if false
   */
  start ({
    runnable = undefined,
    intervalDurationInMs = DEFAULT_INTERVAL_TIME_IN_MS,
    runImmediate = DEFAULT_RUN_IMMEDIATE
  }) {
    if (!(runnable && typeof runnable === 'function')) {
      throw new Error(`expecting a function type as 'runnable' param.`);
    }
    if (!this.canceled) {
      throw new Error(`already running. call stop to return`);
    }
    this.runnable = runnable;
    this.intervalDurationInMs = Math.max(intervalDurationInMs, DEFAULT_INTERVAL_TIME_IN_MS);

    this.lastUpdate = runImmediate ? 0 : this.getTimeInMs();
    this.canceled = false;
    this.runId = this.requestAnimationFrame(this.runInternal);
  }

  /**
   * @public
   * Calling this function will stop the timer
   * You can call stop method at any time during the application lifecycle
   * That means, it can also be called to cancel an ongoing setTimeout call
   */
  stop () {
    if (this.runId) {
      this.canceled = true;
      this.cancelAnimationFrame(this.runId);
    }
  }
}

export { SetTimeout };
