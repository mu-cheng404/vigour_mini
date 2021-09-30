"use strict";
Object.defineProperty(exports, "__esModule", {
  value: !0
}), Object.defineProperty(exports, "$wuxCountDown", {
  enumerable: !0,
  get: function () {
    return _index.default
  }
}), Object.defineProperty(exports, "$wuxCountUp", {
  enumerable: !0,
  get: function () {
    return _index2.default
  }
}), exports.$wuxToptips = exports.$wuxToast = exports.$wuxSelect = exports.$stopWuxLoader = exports.$stopWuxRefresher = exports.$startWuxRefresher = exports.$wuxNotification = exports.$wuxLoading = exports.$wuxKeyBoard = exports.$wuxGallery = exports.$wuxForm = exports.$wuxDialog = exports.$wuxCalendar = exports.$wuxBackdrop = exports.$wuxActionSheet = exports.version = exports.getCtx = void 0;
var _index = _interopRequireDefault(require("./countdown/index")),
  _index2 = _interopRequireDefault(require("./countup/index"));

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var getCtx = function (e, t) {
  var r = (1 < arguments.length && void 0 !== t ? t : getCurrentPages()[getCurrentPages().length - 1]).selectComponent(e);
  if (!r) throw new Error("无法找到对应的组件，请按文档说明使用组件");
  return r
};
exports.getCtx = getCtx;
var version = "3.8.7";
exports.version = version;
var $wuxActionSheet = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-actionsheet", 1 < arguments.length ? t : void 0)
};
exports.$wuxActionSheet = $wuxActionSheet;
var $wuxBackdrop = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-backdrop", 1 < arguments.length ? t : void 0)
};
exports.$wuxBackdrop = $wuxBackdrop;
var $wuxCalendar = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-calendar", 1 < arguments.length ? t : void 0)
};
exports.$wuxCalendar = $wuxCalendar;
var $wuxDialog = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-dialog", 1 < arguments.length ? t : void 0)
};
exports.$wuxDialog = $wuxDialog;
var $wuxForm = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-form", 1 < arguments.length ? t : void 0)
};
exports.$wuxForm = $wuxForm;
var $wuxGallery = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-gallery", 1 < arguments.length ? t : void 0)
};
exports.$wuxGallery = $wuxGallery;
var $wuxKeyBoard = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-keyboard", 1 < arguments.length ? t : void 0)
};
exports.$wuxKeyBoard = $wuxKeyBoard;
var $wuxLoading = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-loading", 1 < arguments.length ? t : void 0)
};
exports.$wuxLoading = $wuxLoading;
var $wuxNotification = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-notification", 1 < arguments.length ? t : void 0)
};
exports.$wuxNotification = $wuxNotification;
var $startWuxRefresher = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-refresher", 1 < arguments.length ? t : void 0).triggerRefresh()
};
exports.$startWuxRefresher = $startWuxRefresher;
var $stopWuxRefresher = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-refresher", 1 < arguments.length ? t : void 0).finishPullToRefresh()
};
exports.$stopWuxRefresher = $stopWuxRefresher;
var $stopWuxLoader = function (e, t, r) {
  var o = 2 < arguments.length ? r : void 0;
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-refresher", 1 < arguments.length ? t : void 0).finishLoadmore(o)
};
exports.$stopWuxLoader = $stopWuxLoader;
var $wuxSelect = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-select", 1 < arguments.length ? t : void 0)
};
exports.$wuxSelect = $wuxSelect;
var $wuxToast = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-toast", 1 < arguments.length ? t : void 0)
};
exports.$wuxToast = $wuxToast;
var $wuxToptips = function (e, t) {
  return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-toptips", 1 < arguments.length ? t : void 0)
};
exports.$wuxToptips = $wuxToptips;