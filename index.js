'use strict'
var React = require('react')
var useState = React.useState
var useEffect = React.useEffect
var _throttle = require('lodash.throttle')

var supportsPassive = false
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true
    },
  })
  window.addEventListener('testPassive', null, opts)
  window.removeEventListener('testPassive', null, opts)
} catch (e) {}

var getPosition = function() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset,
  }
}

var defaultOptions = {
  throttle: 100,
}

function useWindowScrollPosition(options) {
  var opts = Object.assign({}, defaultOptions, options)

  var state = useState(getPosition())
  var position = state[0]
  var setPosition = state[1]

  useEffect(function() {
    var handleScroll = _throttle(function() {
      setPosition(getPosition())
    }, opts.throttle)

    window.addEventListener(
      'scroll',
      handleScroll,
      supportsPassive ? { passive: true } : false
    )

    return function() {
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return position
}

module.exports = useWindowScrollPosition

