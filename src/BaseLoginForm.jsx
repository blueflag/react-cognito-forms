/* @flow */
import React, {PropTypes, Component} from 'react';
import BaseFormHock from './BaseFormHock';

class BaseLoginForm extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        exclude: PropTypes.arrayOf(PropTypes.string),
        onTokenChange: PropTypes.func,
        forceLogin: PropTypes.bool,
        signUpPath: PropTypes.string,
        forgotPasswordPath: PropTypes.string,
        LoginComponent: PropTypes.func.isRequired,
        VerificationComponent: PropTypes.func.isRequired,
        LoadingComponent: PropTypes.func.isRequired,
        WrappingComponent: React.PropTypes.func.isRequired
    };

    static defaultProps = {
        renderForm: props => props.children,
        forceLogin: false
    };

    onLogin: (e: Event) => void;
    onTokenChange: () => void;
    onVerified: () => void;

    constructor(props: Object) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
        this.onTokenChange = this.onTokenChange.bind(this);
    }
    componentDidMount() {
        const {auth} = this.props;
        auth.subscribeTokenChange(this.onTokenChange);
        auth.getToken().then(this.props.onChange('token'));


        // Force update token after subscription
        auth
            .refreshToken()
            .catch(err => {
                if(process.env.NODE_ENV === 'development') {
                    console.warn('Fetching Refresh Token Failed', err);
                }
            });

        if (this.props.token && this.props.onTokenChange) {
            this.props.onTokenChange(this.props.token);
        }
    }
    onLogin(e: Event) {
        e.preventDefault();

        const {username, password} = this.props;
        this.props.onChange('username')(username);
        this.props.onChange('loading')(true);

        this.props.auth.signIn(username, password)
            .then((token: string) => {
                this.onTokenChange(token);
            })
            .catch(this.props.errorHandler);
    }
    onTokenChange(token: string) {
        this.props.onChange('token')(token);
        this.props.onChange('loading')(false);

        if (this.props.onTokenChange) {
            this.props.onTokenChange(token);
        }
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
        const {
            children,
            forceLogin,
            loading,
            LoadingComponent,
            LoginComponent,
            renderForm,
            token,
            VerificationComponent,
            verify,
            WrappingComponent
        } = this.props;

        const componentProps = {
            ...this.props,
            onLogin: this.onLogin,
            onTokenChange: this.onTokenChange,
            onVerify: this.props.onVerify('/?userConfirmed=true'),
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
        if (!token && !this.shouldExcludePath() || forceLogin) {
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

        return <WrappingComponent>{React.Children.map(children, cc => React.cloneElement(cc, {auth: this.props.auth}))}</WrappingComponent>;
    }
}


const withBaseForm = BaseFormHock();
export default withBaseForm(BaseLoginForm);
