/* @flow */

import React from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import BaseLoginForm from '../../BaseLoginForm';
import auth from '../auth';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});

// import VerificationForm from './VerificationForm';
// import Errors from './Errors';
const VerificationComponent = () => <View><Text>Verification</Text></View>
const LoadingComponent = () => <View><Text>Loading...</Text></View>

function LoginComponent(props: Object): React.Element {

    const {forgotPasswordPath, signUpPath, onChange, onLogin, errors} = props;

    return <View style={{width: 200}}>
        <Text>Login</Text>
        <TextInput autoCapitalize="none" keyboardType="email-address" autoFocus={true} style={{height: 40, borderColor: 'gray', borderWidth: 1}} onChangeText={onChange('username')}/>
        <TextInput autoCapitalize="none" secureTextEntry={true} style={{height: 40, borderColor: 'gray', borderWidth: 1}} onChangeText={onChange('password')}/>
        <Button
            onPress={onLogin}
            title="Login"
            color="#841584"
        />
    </View>;
        // <form className="ReactCognitoForm" onSubmit={onLogin}>
        //     <label>Email</label>
        //     <Input type="email" name="email" placeholder="Email" onChange={onChange('username')}/>
        //     <label>Password</label>
        //     <Input type="password" name="password" placeholder="Password" onChange={onChange('password')}/>
        //     <Button type="submit">Sign In</Button>
        // </form>

        // <div>
        //     {signUpPath ? <a className="ReactCognitoLink ReactCognitoLink-signup" href={signUpPath}>Create an account</a> : null}
        //     {forgotPasswordPath ? <a className="ReactCognitoLink ReactCognitoLink-forgotPassword" href={forgotPasswordPath}>Forgot your password?</a> : null}
        // </div>

        // <Errors errors={errors} />
}

export default class LoginFormWrapper extends React.Component {
    render(): React.Element {
        return <BaseLoginForm
            auth={auth}
            LoginComponent={LoginComponent}
            VerificationComponent={VerificationComponent}
            LoadingComponent={LoadingComponent}
            {...this.props}
        />;
    }
}
