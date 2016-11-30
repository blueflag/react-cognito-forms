'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var SignUpForm = function (_React$Component) {
    (0, _inherits3.default)(SignUpForm, _React$Component);

    function SignUpForm(props) {
        (0, _classCallCheck3.default)(this, SignUpForm);

        var _this = (0, _possibleConstructorReturn3.default)(this, (SignUpForm.__proto__ || (0, _getPrototypeOf2.default)(SignUpForm)).call(this, props));

        _this.state = {
            isSaving: false,
            errors: []
        };

        _this.getValues = _this.getValues.bind(_this);
        _this.onSubmit = _this.onSubmit.bind(_this);
        _this.onValidate = _this.onValidate.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(SignUpForm, [{
        key: 'getValues',
        value: function getValues() {
            var refs = this.refs;


            return this.props.fields.filter(function (f) {
                if (f.required) {
                    return true;
                }

                // Ignore fields that are empty and not required
                return !!refs[f.name].value;
            }).map(function (f) {
                return (0, _defineProperty3.default)({}, f.name, refs[f.name].value);
            }).reduce(function (acc, val) {
                return (0, _assign2.default)(acc, val);
            }, {});
        }
    }, {
        key: 'onSubmit',
        value: function onSubmit(e) {
            var _this2 = this;

            e.preventDefault();

            var attributes = this.getValues();
            var isValid = this.onValidate(attributes);

            if (isValid) {
                var username = attributes[this.props.usernameKey];
                var password = attributes[this.props.passwordKey];

                // Exclude password from attributes
                delete attributes[this.props.passwordKey];
                delete attributes[this.props.passwordConfirmKey];

                (0, _aws.signUp)(username, password, attributes).then(function (x) {
                    console.log('Created attributes...', x);
                    _this2.setState({ newUser: true });
                }).catch(function (err) {
                    _this2.setState({ errors: _this2.state.errors.concat([err.message]) });
                    console.error(err.stack);
                });

                // Clear errors
                this.setState({ errors: [] });
            }
        }
    }, {
        key: 'onValidate',
        value: function onValidate(attributes) {
            var validationErrors = [];

            // Passwords must match
            if (attributes[this.props.passwordKey] !== attributes[this.props.passwordConfirmKey]) {
                validationErrors.push('Paswords do not match');
            }

            if (validationErrors.length > 0) {
                this.setState({ errors: this.state.errors.concat(validationErrors) });
                return false;
            }

            return true;
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
                        this.state.newUser ? this.renderCompleted() : this.renderForm()
                    )
                )
            );
        }
    }, {
        key: 'renderForm',
        value: function renderForm() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'form',
                    { onSubmit: this.onSubmit },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'Sign Up'
                    ),
                    this.renderFields(),
                    this.renderSubmitButton()
                ),
                _react2.default.createElement(_Errors2.default, { errors: this.state.errors })
            );
        }
    }, {
        key: 'renderFields',
        value: function renderFields() {
            var fields = this.props.fields;


            return fields.map(function (field) {
                return _react2.default.createElement(
                    'div',
                    { className: 'marginRow2' },
                    _react2.default.createElement(
                        'label',
                        { htmlFor: '' },
                        field.title
                    ),
                    _react2.default.createElement('input', (0, _extends3.default)({
                        key: field.name,
                        ref: field.name,
                        type: field.type || 'text',
                        className: 'Input Input-text',
                        placeholder: field.placeholder
                    }, field))
                );
            });
        }
    }, {
        key: 'renderSubmitButton',
        value: function renderSubmitButton() {
            return this.state.isSaving ? null : _react2.default.createElement(
                'button',
                { className: 'Button w100', type: 'submit' },
                'Sign Up'
            );
        }
    }, {
        key: 'renderCompleted',
        value: function renderCompleted() {
            return _react2.default.createElement(
                'h1',
                null,
                'User created successfully. User can now login.'
            );
        }
    }]);
    return SignUpForm;
}(_react2.default.Component);

SignUpForm.propTypes = {
    fields: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object).isRequired,
    usernameKey: _react2.default.PropTypes.string.isRequired,
    passwordKey: _react2.default.PropTypes.string.isRequired,
    passwordConfirmKey: _react2.default.PropTypes.string.isRequired
};
exports.default = SignUpForm;