// stimulus-select2@0.0.4 downloaded from https://ga.jspm.io/npm:stimulus-select2@0.0.4/dist/index.js

import e from"stimulus";var t={};var r=e;function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||false;o.configurable=true;"value"in o&&(o.writable=true);Object.defineProperty(e,o.key,o)}}function _createClass(e,t,r){t&&_defineProperties(e.prototype,t);r&&_defineProperties(e,r);return e}function _inherits(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}});t&&_setPrototypeOf(e,t)}function _getPrototypeOf(e){_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)};return _getPrototypeOf(e)}function _setPrototypeOf(e,t){_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){e.__proto__=t;return e};return _setPrototypeOf(e,t)}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _possibleConstructorReturn(e,t){return!t||"object"!==typeof t&&"function"!==typeof t?_assertThisInitialized(e):t}let parseSelect2OptionName=e=>{e=e.slice(7);return e.charAt(0).toLowerCase()+e.slice(1)};let o=function(e){_inherits(_default,e);function _default(){_classCallCheck(this,_default);return _possibleConstructorReturn(this,_getPrototypeOf(_default).apply(this,arguments))}_createClass(_default,[{key:"connect",value:function connect(){this.select.select2(this.options)}},{key:"disconnect",value:function disconnect(){this.select.select2("destroy")}},{key:"select",get:function(){return $(this.element)}},{key:"options",get:function(){let e=this.select.data();let t={};for(let r in e)r.indexOf("select2")>-1&&(t={...t,[parseSelect2OptionName(r)]:e[r]});return t}}]);return _default}(r.Controller);t=o;var n=t;export default n;

