'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _aws = require('../aws');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Logout = function (_React$Component) {
    (0, _inherits3.default)(Logout, _React$Component);

    function Logout() {
        (0, _classCallCheck3.default)(this, Logout);
        return (0, _possibleConstructorReturn3.default)(this, (Logout.__proto__ || (0, _getPrototypeOf2.default)(Logout)).apply(this, arguments));
    }

    (0, _createClass3.default)(Logout, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            (0, _aws.signOut)();

            // Send user to homepage
            _reactRouter.browserHistory.push('/');
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                'Logging out...'
            );
        }
    }]);
    return Logout;
}(_react2.default.Component);

exports.default = Logout;