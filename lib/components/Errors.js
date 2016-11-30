"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Errors;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Errors(props) {
    var errors = props.errors;


    if (errors.length === 0) {
        return null;
    }

    return _react2.default.createElement(
        "ul",
        { className: "margin-row" },
        errors.map(function (msg, i) {
            return _react2.default.createElement(
                "li",
                { className: "Message Message-fail", key: i },
                msg
            );
        })
    );
}