/**
 * @jest-environment jsdom
 */

const { mockConsole, removeConsoleMock } = require('../__testHelper__/ijsContext');

const UtilFunctions = require('../svg_utilityFunctions');

global.describe('svg_utilityFunctions', () => {
  global.beforeEach(() => {
    // prepareWindow();
    mockConsole();
  });
  global.afterEach(() => {
    // restoreWindow();
    removeConsoleMock();
  });
  global.describe('animationFrameCalls', () => {
    global.it('can get the animation calls', () => {
    });
    global.it('has requestAnimationFrame', () => {
      const result = UtilFunctions.animationFrameCalls();
      global.expect(result).toHaveProperty('requestAnimationFrame');
    });
    global.it('has cancelAnimationFrame', () => {
      const result = UtilFunctions.animationFrameCalls();
      global.expect(result).toHaveProperty('cancelAnimationFrame');
    });
    global.it('has resetAllAnimations', () => {
      const result = UtilFunctions.animationFrameCalls();
      global.expect(result).toHaveProperty('resetAllAnimations');
    });
    global.it('has allowAnimations', () => {
      const result = UtilFunctions.animationFrameCalls();
      global.expect(result).toHaveProperty('allowAnimations');
    });
    global.it('has nextAnimationFrame', () => {
      const result = UtilFunctions.animationFrameCalls();
      global.expect(result).toHaveProperty('nextAnimationFrame');
    });
    global.it('has checkAnimationsAllowed', () => {
      const result = UtilFunctions.animationFrameCalls();
      global.expect(result).toHaveProperty('checkAnimationsAllowed');
    });
    global.describe('stopAllOtherAnimations', () => {
      global.it('clears the animation if an animation is set', () => {
        const result = UtilFunctions.animationFrameCalls();

        global.window.animation = 14;
        result.stopOtherAnimations();

        // global.expect(global.window.cancelAnimationFrame).toHaveBeenCalled();
        global.expect(global.window.animation).toBeFalsy();
      });
      global.it('works fine if no animation is set', () => {
        const result = UtilFunctions.animationFrameCalls();
        global.expect(() => result.stopOtherAnimations()).not.toThrow();
      });
    });
    global.describe('resetAllAnimations', () => {
      global.it('can stop animations', () => {
        const result = UtilFunctions.animationFrameCalls();
        global.window.stopAnimation = false;

        jest.useFakeTimers();

        result.resetAllAnimations();

        global.expect(global.window.stopAnimation).toBe(true);

        jest.runAllTimers();
      });
      global.it('can starts timers again afterwards', () => {
        const result = UtilFunctions.animationFrameCalls();
        global.window.stopAnimation = false;

        jest.useFakeTimers();

        result.resetAllAnimations();

        global.expect(global.window.stopAnimation).toBe(true);

        jest.runAllTimers();

        global.expect(global.window.stopAnimation).toBe(false);
      });
    });
    global.describe('allowAnimations', () => {
      global.it('can allow animations', () => {
        const result = UtilFunctions.animationFrameCalls();
        global.window.stopAnimation = false;
        result.allowAnimations(true);
        global.expect(global.window.stopAnimation).toBe(true);
      });
      global.it('can allow animations by default', () => {
        const result = UtilFunctions.animationFrameCalls();
        global.window.stopAnimation = false;
        result.allowAnimations();
        global.expect(global.window.stopAnimation).toBe(true);
      });
      global.it('can disallow animations', () => {
        const result = UtilFunctions.animationFrameCalls();
        global.window.stopAnimation = true;
        result.allowAnimations(false);
        global.expect(global.window.stopAnimation).toBe(false);
      });
    });
    global.describe('nextAnimationFrame', () => {
      beforeEach(() => {
        jest.spyOn(global.window, 'requestAnimationFrame').mockImplementation((callToRun) => {
          callToRun();
          return 100;
        });
      });
      afterEach(() => {
        global.window.requestAnimationFrame.mockRestore();
      });

      global.it('can set a next animation frame', () => {
        const result =  UtilFunctions.animationFrameCalls();
        global.window.animation = null;
        const fn = () => {};
        result.nextAnimationFrame(fn);
        global.expect(global.window.animation).toBeTruthy();
      });
      global.it('runs the animation if the element is still attached', () => {
        const result = UtilFunctions.animationFrameCalls();
        
        const domEl = global.window.document.createElement('div');
        global.window.document.body.appendChild(domEl);

        const fn = jest.fn();
        result.nextAnimationFrame(fn, domEl);

        global.expect(fn).toHaveBeenCalled();
      });
      global.it('halts the animation if the element is not on DOM anymore', () => {
        const result = UtilFunctions.animationFrameCalls();
        
        const domEl = global.window.document.createElement('div');
        // global.window.document.body.appendChild(domEl);

        const fn = jest.fn();
        result.nextAnimationFrame(fn, domEl);

        global.expect(fn).not.toHaveBeenCalled();
      });
    });
    global.describe('can check if animations are allowed', () => {
      global.it('returns true if animations are allowed', () => {
        const result =  UtilFunctions.animationFrameCalls();
        global.window.stopAnimation = false;
        const isAllowed = result.checkAnimationsAllowed();
        global.expect(isAllowed).toBe(true);
      });
      global.it('returns false if animations are not allowed', () => {
        const result =  UtilFunctions.animationFrameCalls();
        global.window.stopAnimation = true;
        const isAllowed = result.checkAnimationsAllowed();
        global.expect(isAllowed).toBe(false);
      });
    });
  });

  global.describe('different browsers', () => {
    global.describe('legacy mozilla', () => {
      const originalRequest = global.window.requestAnimationFrame;
      const originalCancel = global.window.cancelAnimationFrame;

      global.beforeAll(() => {
        global.window.requestAnimationFrame = null;
        global.window.cancelAnimationFrame = null;

        global.window.mozRequestAnimationFrame = jest.fn();
        global.window.mozCancelAnimationFrame = jest.fn();
      });
      global.afterAll(() => {
        global.window.requestAnimationFrame = originalRequest;
        global.window.cancelAnimationFrame = originalCancel;

        global.window.mozRequestAnimationFrame = null;
        global.window.mozCancelAnimationFrame = null;
      });
      global.it('with request animation', () => {
        const result = UtilFunctions.animationFrameCalls();
        
        const fn = jest.fn();

        result.nextAnimationFrame(fn);

        global.expect(global.window.mozRequestAnimationFrame).toHaveBeenCalled();
      });
      global.it('with cancel animation', () => {
        const result = UtilFunctions.animationFrameCalls();
        
        // const fn = jest.fn();

        global.window.animation = 100;
        result.stopOtherAnimations();

        global.expect(global.window.mozCancelAnimationFrame).toHaveBeenCalled();
      });
    });
    global.describe('webkit', () => {
      const originalRequest = global.window.requestAnimationFrame;
      const originalCancel = global.window.cancelAnimationFrame;

      global.beforeAll(() => {
        global.window.requestAnimationFrame = null;
        global.window.cancelAnimationFrame = null;

        global.window.webkitRequestAnimationFrame = jest.fn();
        global.window.mozCancelAnimationFrame = jest.fn();
      });
      global.afterAll(() => {
        global.window.requestAnimationFrame = originalRequest;
        global.window.cancelAnimationFrame = originalCancel;

        global.window.webkitRequestAnimationFrame = null;
        global.window.mozCancelAnimationFrame = null;
      });
      global.it('with request animation', () => {
        const result = UtilFunctions.animationFrameCalls();
        
        const fn = jest.fn();

        result.nextAnimationFrame(fn);

        global.expect(global.window.webkitRequestAnimationFrame).toHaveBeenCalled();
      });
      global.it('with cancel animation', () => {
        const result = UtilFunctions.animationFrameCalls();
        
        // const fn = jest.fn();

        global.window.animation = 100;
        result.stopOtherAnimations();

        global.expect(global.window.mozCancelAnimationFrame).toHaveBeenCalled();
      });
    });
  });
});
