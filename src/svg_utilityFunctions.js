/* globals window */

/**
 * JavaScript side function to use when embedding / creating svgs client side.
 * 
 * @module svg/utilityFunctions
 * @exports svg/utilityFunctions
 */
module.exports = {};
const SvgUtils = module.exports; // eslint-disable-line no-unused-vars

/**
 * @typedef {Object} AnimationFrame
 * @property {Function} requestAnimationFrame - one of the different
 *  [requestAnimationFrame implementations](https://caniuse.com/requestanimationframe)
 *     ( window.requestAnimationFrame
 *       || window.mozRequestAnimationFrame
 *       || window.webkitRequestAnimationFrame
 *       || window.msRequestAnimationFrame )
 * 
 * @property {Function} requestAnimationFrame - one of the different
 *  [cancelAnimationFrame implementations](https://caniuse.com/mdn-api_window_cancelanimationframe)
 *     ( window.cancelAnimationFrame || window.mozCancelAnimationFrame )
 * 
 * @property {Function} stopOtherAnimations - () => void - stops animations currently running, but still allows this one to run.
 * 
 * @property {Function} checkAnimationsAllowed - () => Boolean, true - unless all animations have been stopped
 * 
 * @property {Function} nextAnimationFrame - (function) => void - runs function on next animation frame
 * 
 * @property {Function} stopAllAnimations - () => void, stops all animations and disallows future animations.
 * 
 * @property {Function} allowAnimations - () => void, allows future animations
 */

/**
 * JavaScript to allow for simpler animations in browser
 * 
 * Example:
 * 
 * ```
 * utils.svg.embed({
 *     width: 200, height: 200, debug: false,
 *     
 *     //-- node functions to make available in javascript
 *     utilityFunctions: { ...utils.svg.utilityFunctions },
 *     
 *     //-- executed in javascript
 *     onReady: ({el, SVG, width, height, utilityFunctions }) => {
 *         const center = { x: width / 2, y: height / 2 };
 *         const period = 6000;
 *         const halfPeriod = period / 2;
 *         const bounceHeight = 100;
 *         
 *         const box = el.rect(100, 100)
 *             .center(center.x, center.y)
 *         
 *         const anim = utilityFunctions.animationFrameCalls();
 *         
 *         anim.stopOtherAnimations();
 *         
 *         const bounceBox = function bounceBox(timeElapsed) {
 *             const now = new Date().getTime() % period;
 *             const phase = (now / (period / 2)) * Math.PI;
 *             box.y(center.y + Math.sin(phase) * bounceHeight);
 *             
 *             if (anim.checkAnimationsAllowed()) {
 *                 anim.nextAnimationFrame(bounceBox);
 *             }
 *         }
 *         bounceBox(0);
 *     }
 * });
 * ```
 * 
 * * requestAnimationFrame - one of the different [requestAnimationFrame implementations](https://caniuse.com/requestanimationframe)
 *     * window.requestAnimationFrame
 *       || window.mozRequestAnimationFrame
 *       || window.webkitRequestAnimationFrame
 *       || window.msRequestAnimationFrame
 * 
 * * requestAnimationFrame - one of the different [cancelAnimationFrame implementations](https://caniuse.com/mdn-api_window_cancelanimationframe)
 *     * window.cancelAnimationFrame
 *       || window.mozCancelAnimationFrame
 * 
 * * {Function} stopOtherAnimations - () => void - stops animations currently running, but still allows this one to run.
 * 
 * * {Function} checkAnimationsAllowed - () => Boolean, true - unless all animations have been stopped
 * 
 * * {Function} nextAnimationFrame - (function) => void - runs function on next animation frame
 * 
 * * {Function} stopAllAnimations - () => void, stops all animations and disallows future animations.
 * 
 * * {Function} allowAnimations - () => void, allows future animations
 *  
 * @returns {AnimationFrame} - { requestAnimationFame, cancelAnimationFrame, stopOtherAnimations,
 *  nextAnimationFrame, checkStopAnimation, stopAllAnimations, allowAnimations }
 */
module.exports.animationFrameCalls = function animationFrameCalls() {
  const requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame;
  
  const cancelAnimationFrame = window.cancelAnimationFrame
      || window.mozCancelAnimationFrame;
  
  const stopOtherAnimations = () => {
    if (window.animation) {
      cancelAnimationFrame(window.animation);
      window.animation = null;
    }
  };

  const resetAllAnimations = () => {
    window.stopAnimation = true;
    window.setTimeout(() => {
      window.stopAnimation = false;
    }, 500);
  };

  const allowAnimations = (isAllowed = true) => {
    window.stopAnimation = isAllowed;
  };
  
  const nextAnimationFrame = (fn, el) => {
    const requestFn = (...rest) => {
      if (el && !window.document.contains(el)) {
        console.log('old nextAnimationFrame aborting, el has been removed from DOM');
      } else {
        fn.apply(globalThis, rest);
      }
    };
    const animationId = requestAnimationFrame(requestFn);
    window.animation = animationId;
  };
  
  const checkAnimationsAllowed = () => {
    if (window.stopAnimation) {
      console.log('stopping the animation');
      return (false);
    }
    return true;
  };
  
  return {
    requestAnimationFrame,
    cancelAnimationFrame,
    stopOtherAnimations,
    nextAnimationFrame,
    checkAnimationsAllowed,
    resetAllAnimations,
    allowAnimations
  };
};

module.exports.animation = module.exports.animationFrameCalls;
