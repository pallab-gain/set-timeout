'use strict';
// eslint-disable-next-line no-unused-vars,no-redeclare
/* global global, expect, SetTimeout, chai, expect, describe, it, before, afterEach, beforeEach  */

const expect = chai.expect;

describe('SetTimeout test suit', function () {
  // eslint-disable-next-line no-undef
  it('should initialize setTimeout successfully', () => {
    let err;
    try {
      // eslint-disable-next-line no-unused-vars
      let _ = new SetTimeout();
    } catch (e) {
      err = e;
    }
    // eslint-disable-next-line no-unused-expressions
    expect(err).to.be.undefined;
  });
});
