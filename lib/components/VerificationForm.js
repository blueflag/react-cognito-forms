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

var _aws = require('../aws');

var _Errors = require('./Errors');

var _Errors2 = _interopRequireDefault(_Errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VerificationForm = function (_React$Component) {
    (0, _inherits3.default)(VerificationForm, _React$Component);

    function VerificationForm(props) {
        (0, _classCallCheck3.default)(this, VerificationForm);

        var _this = (0, _possibleConstructorReturn3.default)(this, (VerificationForm.__proto__ || (0, _getPrototypeOf2.default)(VerificationForm)).call(this, props));

        _this.state = {
            errors: []
        };

        _this.onVerify = _this.onVerify.bind(_this);
        _this.onResendVerificationCode = _this.onResendVerificationCode.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(VerificationForm, [{
        key: 'onVerify',
        value: function onVerify(e) {
            var _this2 = this;

            e.preventDefault();

            var verification = this.refs.verification.value;

            (0, _aws.confirmRegistration)(this.props.username, verification).then(function () {
                _this2.props.onVerified();
            }).catch(function (err) {
                _this2.setState({ errors: [err.message] });
            });
        }
    }, {
        key: 'onResendVerificationCode',
        value: function onResendVerificationCode(e) {
            var _this3 = this;

            e.preventDefault();

            (0, _aws.resendConfirmationCode)(this.props.username).then(function () {
                _this3.setState({ verificationCodeSent: true });
            }).catch(function (err) {
                _this3.setState({ errors: [err.message] });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'Login' },
                _react2.default.createElement(
                    'div',
                    { className: 'Login_wrapper' },
                    _react2.default.createElement(
                        'div',
                        { className: 'Login_form' },
                        _react2.default.createElement(
                            'form',
                            { onSubmit: this.onVerify },
                            _react2.default.createElement('input', { className: 'Input Input-text', type: 'text', name: 'verification', ref: 'verification', placeholder: 'Verification Code' }),
                            _react2.default.createElement(
                                'button',
                                { className: 'Button w100', type: 'submit' },
                                'Confirm'
                            )
                        ),
                        _react2.default.createElement(
                            'small',
                            { className: 't-muted block margin-row' },
                            _react2.default.createElement(
                                'a',
                                { href: '', onClick: this.onResendVerificationCode },
                                'Resend verification code'
                            )
                        ),
                        this.state.verificationCodeSent ? _react2.default.createElement(
                            'div',
                            null,
                            'Verification code has been sent!'
                        ) : null,
                        _react2.default.createElement(_Errors2.default, { errors: this.state.errors })
                    )
                )
            );
        }
    }]);
    return VerificationForm;
}(_react2.default.Component);

VerificationForm.propTypes = {
    username: _react2.default.PropTypes.string.isRequired,
    onVerified: _react2.default.PropTypes.func.isRequired
};
exports.default = VerificationForm;