/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';

exports.__esModule = true;
exports.default = void 0;

var _AnimatedNode = _interopRequireDefault(require("./AnimatedNode"));

var _AnimatedWithChildren2 = _interopRequireDefault(require("./AnimatedWithChildren"));

var _NativeAnimatedHelper = _interopRequireDefault(require("../NativeAnimatedHelper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AnimatedTransform = /*#__PURE__*/function (_AnimatedWithChildren) {
  _inheritsLoose(AnimatedTransform, _AnimatedWithChildren);

  function AnimatedTransform(transforms) {
    var _this;

    _this = _AnimatedWithChildren.call(this) || this;
    _this._transforms = transforms;
    return _this;
  }

  var _proto = AnimatedTransform.prototype;

  _proto.__makeNative = function __makeNative() {
    this._transforms.forEach(function (transform) {
      for (var key in transform) {
        var value = transform[key];

        if (value instanceof _AnimatedNode.default) {
          value.__makeNative();
        }
      }
    });

    _AnimatedWithChildren.prototype.__makeNative.call(this);
  };

  _proto.__getValue = function __getValue() {
    return this._transforms.map(function (transform) {
      var result = {};

      for (var key in transform) {
        var value = transform[key];

        if (value instanceof _AnimatedNode.default) {
          result[key] = value.__getValue();
        } else {
          result[key] = value;
        }
      }

      return result;
    });
  };

  _proto.__getAnimatedValue = function __getAnimatedValue() {
    return this._transforms.map(function (transform) {
      var result = {};

      for (var key in transform) {
        var value = transform[key];

        if (value instanceof _AnimatedNode.default) {
          result[key] = value.__getAnimatedValue();
        } else {
          // All transform components needed to recompose matrix
          result[key] = value;
        }
      }

      return result;
    });
  };

  _proto.__attach = function __attach() {
    var _this2 = this;

    this._transforms.forEach(function (transform) {
      for (var key in transform) {
        var value = transform[key];

        if (value instanceof _AnimatedNode.default) {
          value.__addChild(_this2);
        }
      }
    });
  };

  _proto.__detach = function __detach() {
    var _this3 = this;

    this._transforms.forEach(function (transform) {
      for (var key in transform) {
        var value = transform[key];

        if (value instanceof _AnimatedNode.default) {
          value.__removeChild(_this3);
        }
      }
    });

    _AnimatedWithChildren.prototype.__detach.call(this);
  };

  _proto.__getNativeConfig = function __getNativeConfig() {
    var transConfigs = [];

    this._transforms.forEach(function (transform) {
      for (var key in transform) {
        var value = transform[key];

        if (value instanceof _AnimatedNode.default) {
          transConfigs.push({
            type: 'animated',
            property: key,
            nodeTag: value.__getNativeTag()
          });
        } else {
          transConfigs.push({
            type: 'static',
            property: key,
            value: _NativeAnimatedHelper.default.transformDataType(value)
          });
        }
      }
    });

    _NativeAnimatedHelper.default.validateTransform(transConfigs);

    return {
      type: 'transform',
      transforms: transConfigs
    };
  };

  return AnimatedTransform;
}(_AnimatedWithChildren2.default);

var _default = AnimatedTransform;
exports.default = _default;
module.exports = exports.default;