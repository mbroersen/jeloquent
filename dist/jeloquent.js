!function webpackUniversalModuleDefinition(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Jeloquent",[],t):"object"==typeof exports?exports.Jeloquent=t():e.Jeloquent=t()}(window,(function(){return function(e){var t={};function __webpack_require__(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,__webpack_require__),n.l=!0,n.exports}return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.d=function(e,t,r){__webpack_require__.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},__webpack_require__.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.t=function(e,t){if(1&t&&(e=__webpack_require__(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(__webpack_require__.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)__webpack_require__.d(r,n,function(t){return e[t]}.bind(null,n));return r},__webpack_require__.n=function(e){var t=e&&e.__esModule?function getDefault(){return e.default}:function getModuleExports(){return e};return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=0)}([function(e,t,r){"use strict";function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}r.r(t),r.d(t,"Database",(function(){return y})),r.d(t,"Store",(function(){return h})),r.d(t,"Table",(function(){return p})),r.d(t,"Model",(function(){return f})),r.d(t,"Field",(function(){return n})),r.d(t,"Relation",(function(){return o})),r.d(t,"BelongsTo",(function(){return s})),r.d(t,"HasOne",(function(){return c})),r.d(t,"HasMany",(function(){return i})),r.d(t,"HasManyThrough",(function(){return a})),r.d(t,"MorphOne",(function(){return u})),r.d(t,"MorphTo",(function(){return l}));var n=function(){function Field(e,t){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Field),this.isPrimary=null!=t&&t,this.$name=e,this.fieldValue=null,this.previousValue=void 0,this.$parent=null}return function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}(Field,[{key:"setName",value:function setName(){return this}},{key:"setup",value:function setup(e){return this.$parent=e,this.setName().setParentProperties()}},{key:"setParentProperties",value:function setParentProperties(){var e=this;return Object.defineProperty(this.$parent,this.$name,{get:function get(){return e.value},set:function set(t){e.previousValue=JSON.parse(JSON.stringify(e.value)),e.value=t}}),this.setFillPropertyOnParent(),this}},{key:"setFillPropertyOnParent",value:function setFillPropertyOnParent(){var e=this;Object.defineProperty(this.$parent,"_".concat(this.$name),{set:function set(t){e.fieldValue=t}})}},{key:"value",get:function get(){return this.fieldValue},set:function set(e){this.fieldValue=e}}]),Field}();function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(e){return typeof e}:function _typeof(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Relation_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){return e.__proto__=t,e})(e,t)}function _createSuper(e){var t=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var r,n=_getPrototypeOf(e);if(t){var o=_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return _possibleConstructorReturn(this,r)}}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var o=function(e){!function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}(Relation,e);var t=_createSuper(Relation);function Relation(e,r){var n;!function Relation_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Relation);var o=e.className().toLowerCase();return(n=t.call(this,o)).model=e,n.foreignKey=r,n}return function Relation_createClass(e,t,r){return t&&Relation_defineProperties(e.prototype,t),r&&Relation_defineProperties(e,r),e}(Relation,[{key:"setFillPropertyOnParent",value:function setFillPropertyOnParent(){var e=this;Object.defineProperty(this.$parent,"_".concat(this.$name),{set:function set(t){Array.isArray(t)||(t=[t]),t.forEach((function(t){e.model.ids().includes(t.id)||e.model.insert(t)}))}})}}]),Relation}(n);function HasManyThrough_typeof(e){return(HasManyThrough_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(e){return typeof e}:function _typeof(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _toConsumableArray(e){return function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}(e)||function _iterableToArray(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function _unsupportedIterableToArray(e,t){if(!e)return;if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return _arrayLikeToArray(e,t)}(e)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function HasManyThrough_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _get(e,t,r){return(_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function _get(e,t,r){var n=function _superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=HasManyThrough_getPrototypeOf(e)););return e}(e,t);if(n){var o=Object.getOwnPropertyDescriptor(n,t);return o.get?o.get.call(r):o.value}})(e,t,r||e)}function HasManyThrough_setPrototypeOf(e,t){return(HasManyThrough_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){return e.__proto__=t,e})(e,t)}function HasManyThrough_createSuper(e){var t=function HasManyThrough_isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var r,n=HasManyThrough_getPrototypeOf(e);if(t){var o=HasManyThrough_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return HasManyThrough_possibleConstructorReturn(this,r)}}function HasManyThrough_possibleConstructorReturn(e,t){return!t||"object"!==HasManyThrough_typeof(t)&&"function"!=typeof t?function HasManyThrough_assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function HasManyThrough_getPrototypeOf(e){return(HasManyThrough_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var a=function(e){!function HasManyThrough_inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&HasManyThrough_setPrototypeOf(e,t)}(HasManyThrough,e);var t=HasManyThrough_createSuper(HasManyThrough);function HasManyThrough(e,r,n,o){var a;return function HasManyThrough_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,HasManyThrough),(a=t.call(this,e,n)).throughModel=r,a.localKey=null!=o?o:"id",a}return function HasManyThrough_createClass(e,t,r){return t&&HasManyThrough_defineProperties(e.prototype,t),r&&HasManyThrough_defineProperties(e,r),e}(HasManyThrough,[{key:"setName",value:function setName(){return this._lcThroughModelClassName=this.throughModel.className().toLowerCase(),this._lcModelClassName=this.model.className().toLowerCase(),this._lcParentClassName=this.$parent.constructor.className().toLowerCase(),this.foreignKey="".concat(this._lcThroughModelClassName,"_id"),this.$name="".concat(this._lcModelClassName,"s"),this}},{key:"setParentProperties",value:function setParentProperties(){_get(HasManyThrough_getPrototypeOf(HasManyThrough.prototype),"setParentProperties",this).call(this)}},{key:"indexName",get:function get(){return"".concat(this._lcThroughModelClassName,".").concat(this._lcParentClassName,"_id")}},{key:"value",get:function get(){var e,t=this.model.className(),r=Store.database().indexes(t);if(r.hasOwnProperty(this.indexName))return Store.database().find(t,null!==(e=r[this.indexName][this.$parent[this.localKey]])&&void 0!==e?e:[]);var n="".concat(this._lcModelClassName,"s"),o="".concat(this._lcThroughModelClassName,"s");return this.$parent[o].reduce((function(e,t){return e.push.apply(e,_toConsumableArray(t[n])),e}),[])}}]),HasManyThrough}(o);function HasMany_typeof(e){return(HasMany_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(e){return typeof e}:function _typeof(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function HasMany_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function HasMany_get(e,t,r){return(HasMany_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function _get(e,t,r){var n=function HasMany_superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=HasMany_getPrototypeOf(e)););return e}(e,t);if(n){var o=Object.getOwnPropertyDescriptor(n,t);return o.get?o.get.call(r):o.value}})(e,t,r||e)}function HasMany_setPrototypeOf(e,t){return(HasMany_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){return e.__proto__=t,e})(e,t)}function HasMany_createSuper(e){var t=function HasMany_isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var r,n=HasMany_getPrototypeOf(e);if(t){var o=HasMany_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return HasMany_possibleConstructorReturn(this,r)}}function HasMany_possibleConstructorReturn(e,t){return!t||"object"!==HasMany_typeof(t)&&"function"!=typeof t?function HasMany_assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function HasMany_getPrototypeOf(e){return(HasMany_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var i=function(e){!function HasMany_inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&HasMany_setPrototypeOf(e,t)}(HasMany,e);var t=HasMany_createSuper(HasMany);function HasMany(e,r,n){var o;return function HasMany_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,HasMany),(o=t.call(this,e,r)).localKey=null!=n?n:"id",o}return function HasMany_createClass(e,t,r){return t&&HasMany_defineProperties(e.prototype,t),r&&HasMany_defineProperties(e,r),e}(HasMany,[{key:"setName",value:function setName(){var e=this.$parent.constructor.className().toLowerCase(),t=this.model.className().toLowerCase();return this.foreignKey="".concat(e,"_id"),this.$name="".concat(t,"s"),this}},{key:"setParentProperties",value:function setParentProperties(){var e=this;return HasMany_get(HasMany_getPrototypeOf(HasMany.prototype),"setParentProperties",this).call(this),Object.defineProperty(this.$parent,"".concat(this.$name,"Count"),{get:function get(){return e.count}}),Object.defineProperty(this.$parent,"has".concat(this.model.className(),"s"),{get:function get(){return e.count>0}}),this}},{key:"count",get:function get(){var e,t,r;return null!==(t=null===(r=(null!==(e=Store.database().indexes(this.model.className())[this.foreignKey])&&void 0!==e?e:{})[this.$parent[this.localKey]])||void 0===r?void 0:r.length)&&void 0!==t?t:0}},{key:"value",get:function get(){var e,t=this,r=this.model.className(),n=Store.database().indexes(r);return n.hasOwnProperty(this.foreignKey)?Store.database().find(r,null!==(e=n[this.foreignKey][this.$parent[this.localKey]])&&void 0!==e?e:[]):Store.database().all(this.model.className()).filter((function(e){return e[t.foreignKey]===t.$parent[t.localKey]}))},set:function set(e){}}]),HasMany}(o);function BelongTo_typeof(e){return(BelongTo_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(e){return typeof e}:function _typeof(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function BelongTo_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function BelongTo_get(e,t,r){return(BelongTo_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function _get(e,t,r){var n=function BelongTo_superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=BelongTo_getPrototypeOf(e)););return e}(e,t);if(n){var o=Object.getOwnPropertyDescriptor(n,t);return o.get?o.get.call(r):o.value}})(e,t,r||e)}function BelongTo_setPrototypeOf(e,t){return(BelongTo_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){return e.__proto__=t,e})(e,t)}function BelongTo_createSuper(e){var t=function BelongTo_isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var r,n=BelongTo_getPrototypeOf(e);if(t){var o=BelongTo_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return BelongTo_possibleConstructorReturn(this,r)}}function BelongTo_possibleConstructorReturn(e,t){return!t||"object"!==BelongTo_typeof(t)&&"function"!=typeof t?function BelongTo_assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function BelongTo_getPrototypeOf(e){return(BelongTo_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var s=function(e){!function BelongTo_inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&BelongTo_setPrototypeOf(e,t)}(BelongsTo,e);var t=BelongTo_createSuper(BelongsTo);function BelongsTo(e,r){return function BelongTo_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,BelongsTo),t.call(this,e,r)}return function BelongTo_createClass(e,t,r){return t&&BelongTo_defineProperties(e.prototype,t),r&&BelongTo_defineProperties(e,r),e}(BelongsTo,[{key:"setName",value:function setName(){var e=this.model.className().toLowerCase();return this.$name="".concat(e),this.foreignKey="".concat(e,"_id"),this}},{key:"setParentProperties",value:function setParentProperties(){var e=this;return BelongTo_get(BelongTo_getPrototypeOf(BelongsTo.prototype),"setParentProperties",this).call(this),Object.defineProperty(this.$parent,"has".concat(this.model.className()),{get:function get(){return void 0!==e.value}}),this}},{key:"value",get:function get(){return this.model.select(this.$parent[this.foreignKey])},set:function set(e){}}]),BelongsTo}(o);function MorphOne_typeof(e){return(MorphOne_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(e){return typeof e}:function _typeof(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function MorphOne_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function MorphOne_setPrototypeOf(e,t){return(MorphOne_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){return e.__proto__=t,e})(e,t)}function MorphOne_createSuper(e){var t=function MorphOne_isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var r,n=MorphOne_getPrototypeOf(e);if(t){var o=MorphOne_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return MorphOne_possibleConstructorReturn(this,r)}}function MorphOne_possibleConstructorReturn(e,t){return!t||"object"!==MorphOne_typeof(t)&&"function"!=typeof t?function MorphOne_assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function MorphOne_getPrototypeOf(e){return(MorphOne_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var u=function(e){!function MorphOne_inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&MorphOne_setPrototypeOf(e,t)}(MorphOne,e);var t=MorphOne_createSuper(MorphOne);function MorphOne(e){return function MorphOne_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,MorphOne),t.call(this,e)}return function MorphOne_createClass(e,t,r){return t&&MorphOne_defineProperties(e.prototype,t),r&&MorphOne_defineProperties(e,r),e}(MorphOne,[{key:"value",get:function get(){var e=this.$parent.constructor.className(),t=this.$parent.primaryKey,r="".concat(this.$name,"_id"),n="".concat(this.$name,"_type"),o={};return o[r]=t,o[n]=e,this.model.find(o)}}]),MorphOne}(o);function HasOne_typeof(e){return(HasOne_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(e){return typeof e}:function _typeof(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function HasOne_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function HasOne_get(e,t,r){return(HasOne_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function _get(e,t,r){var n=function HasOne_superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=HasOne_getPrototypeOf(e)););return e}(e,t);if(n){var o=Object.getOwnPropertyDescriptor(n,t);return o.get?o.get.call(r):o.value}})(e,t,r||e)}function HasOne_setPrototypeOf(e,t){return(HasOne_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){return e.__proto__=t,e})(e,t)}function HasOne_createSuper(e){var t=function HasOne_isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var r,n=HasOne_getPrototypeOf(e);if(t){var o=HasOne_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return HasOne_possibleConstructorReturn(this,r)}}function HasOne_possibleConstructorReturn(e,t){return!t||"object"!==HasOne_typeof(t)&&"function"!=typeof t?function HasOne_assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function HasOne_getPrototypeOf(e){return(HasOne_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var c=function(e){!function HasOne_inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&HasOne_setPrototypeOf(e,t)}(HasOne,e);var t=HasOne_createSuper(HasOne);function HasOne(e){return function HasOne_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,HasOne),t.call(this,e)}return function HasOne_createClass(e,t,r){return t&&HasOne_defineProperties(e.prototype,t),r&&HasOne_defineProperties(e,r),e}(HasOne,[{key:"setName",value:function setName(){return this.foreignKey="".concat(this.$parent.constructor.className().toLowerCase(),"_id"),this}},{key:"setParentProperties",value:function setParentProperties(){var e=this;return HasOne_get(HasOne_getPrototypeOf(HasOne.prototype),"setParentProperties",this).call(this),Object.defineProperty(this.$parent,"has".concat(this.model.className()),{get:function get(){return null!==e.value}}),this}},{key:"value",get:function get(){var e,t=this.model.className(),r=Store.database().indexes(t);return r.hasOwnProperty(this.foreignKey)?Store.database().find(t,null!==(e=r[this.foreignKey][this.$parent.primaryKey][0])&&void 0!==e?e:null):null}}]),HasOne}(o);function MorphTo_typeof(e){return(MorphTo_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(e){return typeof e}:function _typeof(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function MorphTo_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function MorphTo_setPrototypeOf(e,t){return(MorphTo_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){return e.__proto__=t,e})(e,t)}function MorphTo_createSuper(e){var t=function MorphTo_isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var r,n=MorphTo_getPrototypeOf(e);if(t){var o=MorphTo_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return MorphTo_possibleConstructorReturn(this,r)}}function MorphTo_possibleConstructorReturn(e,t){return!t||"object"!==MorphTo_typeof(t)&&"function"!=typeof t?function MorphTo_assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function MorphTo_getPrototypeOf(e){return(MorphTo_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var l=function(e){!function MorphTo_inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&MorphTo_setPrototypeOf(e,t)}(MorphTo,e);var t=MorphTo_createSuper(MorphTo);function MorphTo(e){return function MorphTo_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,MorphTo),t.call(this,e)}return function MorphTo_createClass(e,t,r){return t&&MorphTo_defineProperties(e.prototype,t),r&&MorphTo_defineProperties(e,r),e}(MorphTo,[{key:"value",get:function get(){var e=this.$parent.constructor.className().toLowerCase(),t=this.$parent["".concat(e,"_type")],r=this.$parent["".concat(e,"_id")];return Store.classInstances[t].constructor.find(r)}}]),MorphTo}(n);function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Model_toConsumableArray(e){return function Model_arrayWithoutHoles(e){if(Array.isArray(e))return Model_arrayLikeToArray(e)}(e)||function Model_iterableToArray(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function Model_unsupportedIterableToArray(e,t){if(!e)return;if("string"==typeof e)return Model_arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return Model_arrayLikeToArray(e,t)}(e)||function Model_nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Model_arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function Model_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var f=function(){function Model(e){!function Model_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Model),this.setFields(e),this._tmpId="_".concat(++Store.numberOfModelCreated)}return function Model_createClass(e,t,r){return t&&Model_defineProperties(e.prototype,t),r&&Model_defineProperties(e,r),e}(Model,[{key:"save",value:function save(){var e=this.constructor.className(),t=Store.database(),r=t.ids(e);this.setPrimaryKey(),"_"!==this.primaryKey[0]&&r.includes(this._tmpId)&&t.delete(e,this._tmpId),r.includes(this.primaryKey)?t.update(e,this):t.insert(e,this)}},{key:"fill",value:function fill(e){for(var t in e)this.hasOwnProperty(t)&&(this["_".concat(t)]=e[t]);this.setPrimaryKey()}},{key:"setPrimaryKey",value:function setPrimaryKey(){var e=this,t=[];this.primaryFields.forEach((function(r){t.push(e[r.$name])})),this.primaryKeyValue=t.join("-")}},{key:"belongsTo",value:function belongsTo(e,t){var r;t=null!==(r=t)&&void 0!==r?r:"".concat(e.className().toLowerCase(),"_id");var belongsTo=new s(e,t);return belongsTo.setup(this),belongsTo}},{key:"hasMany",value:function hasMany(e,t){var r;t=null!==(r=t)&&void 0!==r?r:"".concat(this.constructor.className().toLowerCase(),"_id");var hasMany=new i(e,t);return hasMany.setup(this),hasMany}},{key:"setFields",value:function setFields(e){var t=this;return this.originalFields=e,e.forEach((function(e){e.setup(t)})),Object.defineProperty(this,"indexedFields",{get:function get(){return e.filter((function(e){return e instanceof s})).reduce((function(e,t){return e.push(t.foreignKey),e}),[])}}),this.primaryFields=this.originalFields.filter((function(e){return e.isPrimary})),this}},{key:"toJson",value:function toJson(e){for(var t={},r=0;r<this.originalFields.length;r++){var n=this.originalFields[r];n instanceof o&&e||(t[n.$name]=n.value,t[n.$name]instanceof Model?t[n.$name]=t[n.$name].toJson(!0):t[n.$name]instanceof Array&&(t[n.$name]=Model_toConsumableArray(t[n.$name].map((function(e){var t;return null!==(t=null==e?void 0:e.toJson(!0))&&void 0!==t?t:e})))))}return function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach((function(t){_defineProperty(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},t)}},{key:"primaryKey",get:function get(){var e;return null!==(e=this.primaryKeyValue)&&void 0!==e?e:this._tmpId}},{key:"primaryKeyName",get:function get(){return this.originalFields.filter((function(e){return e.isPrimary})).map((function(e){return e.$name}))}}],[{key:"className",value:function className(){return this.name}},{key:"addIndex",value:function addIndex(e){window.Store.database().addIndex(this.className(),e)}},{key:"getInstance",value:function getInstance(){var e,t=null!==(e=window.Store.classInstances[this.className()])&&void 0!==e?e:window.Store.classInstances[this.className()]=new this,r=t.originalFields.reduce((function(e,t){return e.push(Object.assign(Object.create(Object.getPrototypeOf(t)),t)),e}),[]);return Object.create(Object.getPrototypeOf(t)).setFields(r)}},{key:"insert",value:function insert(e){var t=this;return(e=Array.isArray(e)?e:[e]).map((function(e){var r=t.getInstance();return r.fill(e),window.Store.database().insert(t.className(),r),r})),e}},{key:"update",value:function update(e){var t=new this;return t.fill(e),window.Store.database().update(this.className(),t),t}},{key:"find",value:function find(e){return window.Store.database().find(this.className(),e)}},{key:"select",value:function select(e){try{return window.Store.database().select(this.className(),e)}catch(e){}}},{key:"delete",value:function _delete(e){window.Store.database().delete(this.className(),e)}},{key:"all",value:function all(){return window.Store.database().all(this.className())}},{key:"ids",value:function ids(){return window.Store.database().ids(this.className())}}]),Model}();function Table_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var p=function(){function Table(e){!function Table_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Table),this.setup(e.getInstance())}return function Table_createClass(e,t,r){return t&&Table_defineProperties(e.prototype,t),r&&Table_defineProperties(e,r),e}(Table,[{key:"setup",value:function setup(e){var t=this;this.indexedFields=e.indexedFields,this.name=e.constructor.className(),this.models={},this.indexes={},this.primaryKeyFieldNames=e.primaryKeyName,this.indexedFields.forEach((function(e){t.indexes[e]={}}))}},{key:"allModels",value:function allModels(){return this.models}},{key:"ids",value:function ids(){return Object.keys(this.models)}},{key:"all",value:function all(){return Object.values(this.models)}},{key:"insert",value:function insert(e){var t=this;if(this.models.hasOwnProperty(e.primaryKey))throw new Error("Record already exists");if(!(e instanceof f))throw new Error("Record should be instance of model");this.indexedFields.forEach((function(r){var n,o=r.split(".").reduce((function(e,t){return e[t]}),e),a=null!==(n=t.indexes[r][o])&&void 0!==n?n:[];a.push(e.primaryKey),t.indexes[r][o]=a})),this.models[e.primaryKey]=e}},{key:"update",value:function update(e){if(!this.models.hasOwnProperty(e.primaryKey))throw new Error("Record doesn't exists");if(!(e instanceof f))throw new Error("Record should be instance of model");this.models[e.primaryKey]=e}},{key:"getKey",value:function getKey(e){for(var t=[],r=0;r<this.primaryKeyFieldNames.length;r++){var n;t.push(null!==(n=e[this.primaryKeyFieldNames[r]])&&void 0!==n?n:"")}return t.join("-")}},{key:"find",value:function find(e){var t,r;if(Array.isArray(e)){for(var n=[],o=0;o<e.length;o++){var a,i;if(this.primaryKeyFieldNames.length>1)n.push(null!==(i=this.models[this.getKey(e[o])])&&void 0!==i?i:null);else n.push(null!==(a=this.models[o])&&void 0!==a?a:null)}return n}return this.primaryKeyFieldNames.length>1?null!==(r=this.models[this.getKey(e)])&&void 0!==r?r:null:null!==(t=this.models[e])&&void 0!==t?t:null}},{key:"select",value:function select(e){if(!this.models.hasOwnProperty(e))throw new Error("Record doesn't exists");return this.models[e]}},{key:"delete",value:function _delete(e){if(!this.models.hasOwnProperty(e))throw new Error("Record doesn't exists");delete this.models[e]}},{key:"removeFromIndex",value:function removeFromIndex(e,t,r){var n=this.indexes[e][t].indexOf(r);delete this.indexes[e][t][n]}},{key:"addIndex",value:function addIndex(e){e in this.indexes==!1&&(this.indexedFields.push(e),this.indexes[e]={})}},{key:"selectModelsByIndex",value:function selectModelsByIndex(e){}}]),Table}();function Database_toConsumableArray(e){return function Database_arrayWithoutHoles(e){if(Array.isArray(e))return Database_arrayLikeToArray(e)}(e)||function Database_iterableToArray(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function Database_unsupportedIterableToArray(e,t){if(!e)return;if("string"==typeof e)return Database_arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return Database_arrayLikeToArray(e,t)}(e)||function Database_nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Database_arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function Database_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var y=function(){function Database(e,t){var r=this;!function Database_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Database),this.name=e,this.tables={},this.hasManyThroughRelations=[],t.forEach((function(e){var t,n=new p(e);r.tables[n.name]=n,(t=r.hasManyThroughRelations).push.apply(t,Database_toConsumableArray(e.getInstance().originalFields.filter((function(e){return e instanceof a}))))})),this.hasManyThroughRelations.forEach((function(e){r.addIndex(e.model.className(),e.indexName)}))}return function Database_createClass(e,t,r){return t&&Database_defineProperties(e.prototype,t),r&&Database_defineProperties(e,r),e}(Database,[{key:"showTables",value:function showTables(){return Object.keys(this.tables)}},{key:"ids",value:function ids(e){return this.tables[e].ids()}},{key:"all",value:function all(e){return this.tables[e].all()}},{key:"allModels",value:function allModels(e){return this.tables[e].allModels()}},{key:"addIndex",value:function addIndex(e,t){return this.tables[e].addIndex(t)}},{key:"removeFromIndex",value:function removeFromIndex(e,t,r,n){return this.tables[e].removeFromIndex(t,r,n)}},{key:"indexes",value:function indexes(e){return this.tables[e].indexes}},{key:"insert",value:function insert(e,t){return this.tables[e].insert(t)}},{key:"update",value:function update(e,t){return this.tables[e].update(t)}},{key:"find",value:function find(e,t){return this.tables[e].find(t)}},{key:"select",value:function select(e,t){return this.tables[e].select(t)}},{key:"delete",value:function _delete(e,t){return this.tables[e].delete(t)}},{key:"query",value:function query(e){var t=e.match(/^((SELECT)|(INSERT)|(DELETE))\s+(.*)\s+FROM\s+([^\s]+)(\s+WHERE\s+([^\s]+)\s+(\=)\s+([^\s+]))?((\s+)|;)?$/i);if(0===t.length)return null;var r=t[1],n=(t[5].split(","),t[6]),o=t[8],a=t[10];return"id"===o?this[r.toLowerCase()](n,a):void 0===o&&"SELECT"===r?this.all(n):null}}]),Database}();function Store_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var h=function(){function Store(){!function Store_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Store),this.classInstances={},this.databases={},this.numberOfModelCreated=0,window.Store=this}return function Store_createClass(e,t,r){return t&&Store_defineProperties(e.prototype,t),r&&Store_defineProperties(e,r),e}(Store,[{key:"use",value:function use(e){this.use=e}},{key:"add",value:function add(e){this.databases[e.name]=e}},{key:"database",value:function database(){return this.databases[this.use]}}]),Store}()}])}));