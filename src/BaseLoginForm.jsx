/* @flow */
import React, {PropTypes, Component} from 'react';
import {
    signIn,
    getToken,
    subscribeTokenChange,
    refreshToken,
    signUpConfirm,
    signUpConfirmResend
} from './aws';

export default class BaseLoginForm extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        exclude: PropTypes.arrayOf(PropTypes.string).isRequired,
        onTokenChange: PropTypes.func,
        loader: PropTypes.func,
        signUpPath: PropTypes.string,
        forgotPasswordPath: PropTypes.string,
        LoginComponent: PropTypes.func,
        VerificationComponent: PropTypes.func,
        LoadingComponent: PropTypes.func
    };

    static defaultProps = {
        renderForm: props => props.children,
        LoginComponent: () => <div>loginComponent</div>,
        VerificationComponent: () => <div>verificationComponent</div>,
        LoadingComponent: () => <div>Loading...</div>
    };

    onLogin: (e: Event) => void;
    onResendVerificationCode: (e: Event) => void;
    onTokenChange: () => void;
    onVerified: () => void;
    onVerify: (e: Event) => void;
    state: Object;

    constructor(props: Object) {
        super(props);

        this.state = {
            errors: [],
            token: getToken(),
            loading: false
        };

        this.onChange = this.onChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onResendVerificationCode = this.onResendVerificationCode.bind(this);
        this.onTokenChange = this.onTokenChange.bind(this);
        this.onVerified = this.onVerified.bind(this);
        this.onVerify = this.onVerify.bind(this);
    }
    componentDidMount() {
        subscribeTokenChange(this.onTokenChange);

        // Force update token after subscription
        refreshToken();

        if (this.state.token && this.props.onTokenChange) {
            this.props.onTokenChange(this.state.token);
        }
    }
    onChange(key: string): Function {
        return (newValue: Object) => {
            this.setState({[key]: newValue});
        }
    }
    onLogin(e: Event) {
        e.preventDefault();

        const {username, password} = this.state;

        this.setState({
            username,
            loading: true
        });

        signIn(username, password)
            .then((token: string) => {
                this.onTokenChange(token);
            })
            .catch((err: Error) => {
                this.setState({
                    errors: [err.body.message],
                    verify: err.body.code === 'UserNotConfirmedException',
                    loading: false
                });
            });
    }
    onResendVerificationCode(e: Event) {
        e.preventDefault();

        signUpConfirmResend(this.state.username)
            .then(() => {
                this.setState({verificationCodeSent: true});
            })
            .catch((err: Error) => {
                this.setState({errors: [err.message]});
            });
    }
    onTokenChange(token: string) {
        this.setState({
            token,
            loading: false
        });

        if (this.props.onTokenChange) {
            this.props.onTokenChange(token);
        }
    }
    onVerified() {
        this.setState({
            errors: [],
            verify: false
        });
    }
    onVerify(e: Event) {
        e.preventDefault();

        signUpConfirm(this.state.username, this.state.verification)
            .then(() => {
                this.onVerified();
            })
            .catch((err: Error) => {
                this.setState({errors: [err.message]});
            })
    }
    shouldExcludePath(): bool {
        const {location: {pathname}, exclude} = this.props;

        if (!exclude) {
            return false;
        }

        const shouldExcldue = exclude.find((path: string): bool => {
            return pathname.startsWith(path);
        });

        return !!shouldExcldue;
    }
    render(): React.Element {
        const {token, verify, loading} = this.state;
        const {
            renderForm,
            LoginComponent,
            VerificationComponent,
            LoadingComponent
        } = this.props;

        const componentProps = {
            ...this.props,
            ...this.state,
            onChange: this.onChange,
            onLogin: this.onLogin,
            onResendVerificationCode: this.onResendVerificationCode,
            onTokenChange: this.onTokenChange,
            onVerified: this.onVerified,
            onVerify: this.onVerify,
            shouldExcludePath: this.shouldExcludePath
        };

        // User has yet to be verified
        if (verify === true) {
            return renderForm({
                view: 'verification',
                children: <VerificationComponent {...componentProps} />
            });
        }
        // Only allow authenticated users
        if (!token && !this.shouldExcludePath()) {
            if(!loading) {
                return renderForm({
                    view: 'login',
                    children: <LoginComponent {...componentProps} />
                });

            } else {
                return renderForm({
                    view: 'loading',
                    children: <LoadingComponent {...componentProps} />
                });
            }
        }

        return <div>{this.props.children}</div>;
    }
}
