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

var _VerificationForm = require('./VerificationForm');

var _VerificationForm2 = _interopRequireDefault(_VerificationForm);

var _Errors = require('./Errors');

var _Errors2 = _interopRequireDefault(_Errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoginForm = function (_React$Component) {
    (0, _inherits3.default)(LoginForm, _React$Component);

    function LoginForm(props) {
        (0, _classCallCheck3.default)(this, LoginForm);

        var _this = (0, _possibleConstructorReturn3.default)(this, (LoginForm.__proto__ || (0, _getPrototypeOf2.default)(LoginForm)).call(this, props));

        _this.state = {
            errors: [],
            token: (0, _aws.getJwtToken)(),
            loading: true
        };

        _this.onLogin = _this.onLogin.bind(_this);
        _this.onVerified = _this.onVerified.bind(_this);
        _this.onTokenChange = _this.onTokenChange.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(LoginForm, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            (0, _aws.subscribeTokenChange)(this.onTokenChange);

            // Force update token after subscription
            (0, _aws.updateJwtToken)();

            if (this.state.token && this.props.onTokenChange) {
                this.props.onTokenChange(this.state.token);
            }
        }
    }, {
        key: 'onLogin',
        value: function onLogin(e) {
            var _this2 = this;

            e.preventDefault();

            var username = this.refs.username.value;
            var password = this.refs.password.value;

            this.setState({
                username: username,
                loading: true
            });

            (0, _aws.signIn)(username, password).then(function (t) {
                _this2.onTokenChange(t);
            }).catch(function (err) {
                _this2.setState({
                    errors: [err.message],
                    verify: err.message === 'User is not confirmed.',
                    loading: false
                });
            });
        }
    }, {
        key: 'onVerified',
        value: function onVerified() {
            this.setState({
                errors: [],
                verify: false
            });
        }
    }, {
        key: 'onTokenChange',
        value: function onTokenChange(token) {
            this.setState({
                token: token,
                loading: false
            });

            if (this.props.onTokenChange) {
                this.props.onTokenChange(token);
            }
        }
    }, {
        key: 'shouldExcludePath',
        value: function shouldExcludePath() {
            var _props = this.props,
                pathname = _props.location.pathname,
                exclude = _props.exclude;


            if (!exclude) {
                return false;
            }

            var shouldExcldue = exclude.find(function (path) {

                return pathname.startsWith(path);
            });

            return !!shouldExcldue;
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                token = _state.token,
                verify = _state.verify,
                username = _state.username,
                loading = _state.loading;
            var _props$className = this.props.className,
                className = _props$className === undefined ? '' : _props$className;

            // User has yet to be verified

            if (verify === true) {
                return _react2.default.createElement(_VerificationForm2.default, { username: username, onVerified: this.onVerified, className: className });
            }

            // Only allow authenticated users
            if (!token && !this.shouldExcludePath()) {
                return _react2.default.createElement(
                    'div',
                    { className: 'Login ' + className },
                    _react2.default.createElement(
                        'div',
                        { className: 'Login_wrapper' },
                        loading ? this.renderLoading() : this.renderForm()
                    )
                );
            }

            return _react2.default.createElement(
                'div',
                { className: className },
                this.props.children
            );
        }
    }, {
        key: 'renderForm',
        value: function renderForm() {
            var _props2 = this.props,
                forgotPasswordPath = _props2.forgotPasswordPath,
                signUpPath = _props2.signUpPath;


            return _react2.default.createElement(
                'div',
                { className: 'Login_form' },
                this.props.logo,
                _react2.default.createElement(
                    'form',
                    { onSubmit: this.onLogin },
                    _react2.default.createElement(
                        'label',
                        null,
                        'Email'
                    ),
                    _react2.default.createElement('input', { className: 'Input Input-text', type: 'email', name: 'username', ref: 'username', placeholder: 'Email' }),
                    _react2.default.createElement(
                        'label',
                        null,
                        'Password'
                    ),
                    _react2.default.createElement('input', { className: 'Input Input-text', type: 'password', name: 'password', ref: 'password', placeholder: 'Password' }),
                    _react2.default.createElement(
                        'button',
                        { className: 'Button w100', type: 'submit' },
                        'Sign In'
                    )
                ),
                _react2.default.createElement(
                    'small',
                    { className: 't-muted block margin-row' },
                    signUpPath ? _react2.default.createElement(
                        'a',
                        { href: signUpPath, className: 'float-right' },
                        'Create an account'
                    ) : null,
                    forgotPasswordPath ? _react2.default.createElement(
                        'a',
                        { href: forgotPasswordPath },
                        'Forgot your password?'
                    ) : null
                ),
                _react2.default.createElement(_Errors2.default, { errors: this.state.errors })
            );
        }
    }, {
        key: 'renderLoading',
        value: function renderLoading() {
            if (this.props.loader) {
                return this.props.loader();
            }

            return _react2.default.createElement(
                'div',
                null,
                'Loading...'
            );
        }
    }]);
    return LoginForm;
}(_react2.default.Component);

LoginForm.propTypes = {
    location: _react2.default.PropTypes.object.isRequired,
    exclude: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string).isRequired,
    onTokenChange: _react2.default.PropTypes.func,
    loader: _react2.default.PropTypes.func,
    signUpPath: _react2.default.PropTypes.string,
    forgotPasswordPath: _react2.default.PropTypes.string
};
exports.default = LoginForm;