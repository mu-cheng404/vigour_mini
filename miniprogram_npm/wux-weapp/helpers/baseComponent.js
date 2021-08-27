"use strict";
Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var _computedBehavior = _interopRequireDefault(require("./computedBehavior")),
  _relationsBehavior = _interopRequireDefault(require("./relationsBehavior")),
  _safeAreaBehavior = _interopRequireDefault(require("./safeAreaBehavior")),
  _safeSetDataBehavior = _interopRequireDefault(require("./safeSetDataBehavior")),
  _funcBehavior = _interopRequireDefault(require("./funcBehavior")),
  _compareVersion = _interopRequireDefault(require("./compareVersion"));

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}

function ownKeys(r, e) {
  var t = Object.keys(r);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(r);
    e && (o = o.filter(function (e) {
      return Object.getOwnPropertyDescriptor(r, e).enumerable
    })), t.push.apply(t, o)
  }
  return t
}

function _objectSpread(r) {
  for (var e = 1; e < arguments.length; e++) {
    var t = null != arguments[e] ? arguments[e] : {};
    e % 2 ? ownKeys(t, !0).forEach(function (e) {
      _defineProperty(r, e, t[e])
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(t)) : ownKeys(t).forEach(function (e) {
      Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(t, e))
    })
  }
  return r
}

function _defineProperty(e, r, t) {
  return r in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e
}

function _toConsumableArray(e) {
  return _arrayWithoutHoles(e) || _iterableToArray(e) || _nonIterableSpread()
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance")
}

function _iterableToArray(e) {
  if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
}

function _arrayWithoutHoles(e) {
  if (Array.isArray(e)) {
    for (var r = 0, t = new Array(e.length); r < e.length; r++) t[r] = e[r];
    return t
  }
}
var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
  platform = _wx$getSystemInfoSync.platform,
  SDKVersion = _wx$getSystemInfoSync.SDKVersion,
  libVersion = "2.6.6";
"devtools" === platform && (0, _compareVersion.default)(SDKVersion, libVersion) < 0 && wx && wx.showModal && wx.showModal({
  title: "提示",
  content: "当前基础库版本（".concat(SDKVersion, "）过低，无法使用 Wux Weapp 组件库，请更新基础库版本 >=").concat(libVersion, " 后重试。")
});
var baseComponent = function (e) {
    var r = 0 < arguments.length && void 0 !== e ? e : {};
    return r.externalClasses = ["wux-class", "wux-hover-class"].concat(_toConsumableArray(r.externalClasses = r.externalClasses || [])), r.behaviors = [_relationsBehavior.default, _safeSetDataBehavior.default].concat(_toConsumableArray(r.behaviors = r.behaviors || []), [_computedBehavior.default]), r.useSafeArea && (r.behaviors = [].concat(_toConsumableArray(r.behaviors), [_safeAreaBehavior.default]), delete r.useSafeArea), r.useFunc && (r.behaviors = [].concat(_toConsumableArray(r.behaviors), [_funcBehavior.default]), delete r.useFunc), r.useField && (r.behaviors = [].concat(_toConsumableArray(r.behaviors), ["wx://form-field"]), delete r.useField), r.useExport && (r.behaviors = [].concat(_toConsumableArray(r.behaviors), ["wx://component-export"]), r.methods = _objectSpread({
      export: function () {
        return this
      }
    }, r.methods), delete r.useExport), r.options = _objectSpread({
      multipleSlots: !0,
      addGlobalClass: !0
    }, r.options), Component(r)
  },
  _default = baseComponent;
exports.default = _default;