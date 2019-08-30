'use strict';
// eslint-disable-next-line no-unused-vars,no-redeclare
/* global global, describe, it, before, afterEach, beforeEach  */

// eslint-disable-next-line no-undef
const expect = chai.expect;

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

describe('SetTimeout test suit', () => {
  describe('Check SetTimeout', () => {
    it('should create SetTimeout object with proper configuration', () => {
      // eslint-disable-next-line no-undef
      const setTimeout = new SetTimeout();
      expect(setTimeout._intervalDurationInMs).to.be.equal(100);
    });

    it('should run every 100 milliseconds', async () => {
      // eslint-disable-next-line no-undef
      const setTimeout = new SetTimeout();
      let now = Date.now();
      let totalTime = 0;
      let times = 15;
      const runnable = () => {
        const cur = Date.now();
        totalTime += cur - now;
        now = cur;
      };
      setTimeout.start(
        runnable,
        100,
        false
      );
      await sleep(times * 100);
      setTimeout.stop();
      expect(totalTime - (times - 1) * 100).to.be.at.most(100, totalTime);
    });

    it('should run every 100 milliseconds for 5 time', async () => {
      // eslint-disable-next-line no-undef
      const setTimeout = new SetTimeout();
      let now = Date.now();
      let totalTime = 0;
      let times = 5;
      const runnable = () => {
        const cur = Date.now();
        totalTime += cur - now;
        now = cur;
      };
      setTimeout.start(
        runnable,
        100,
        false,
        times
      );
      await sleep(times * 100);
      setTimeout.stop();
      expect(totalTime - (times - 1) * 100).to.be.at.most(100, totalTime);
    });

    it('should run every 100 milliseconds for 15 time', async () => {
      // eslint-disable-next-line no-undef
      const setTimeout = new SetTimeout();
      let now = Date.now();
      let totalTime = 0;
      let times = 15;
      const runnable = () => {
        const cur = Date.now();
        totalTime += cur - now;
        now = cur;
      };
      setTimeout.start(
        runnable,
        100,
        false,
        times
      );
      await sleep(times * 100);
      setTimeout.stop();
      expect(totalTime - (times - 1) * 100).to.be.at.most(100, totalTime);
    });
  });
});
