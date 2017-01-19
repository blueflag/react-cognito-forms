/* @flow */

import React from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import BaseLoginForm from '../../BaseLoginForm';
import auth from '../auth';



const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

// import VerificationForm from './VerificationForm';
// import Errors from './Errors';
const VerificationComponent = () => <View><Text>Verification</Text></View>
const LoadingComponent = () => <View><Text>Loading...</Text></View>

const WrappingComponent = (props) => <View style={styles.container}>{props.children}</View>

function LoginComponent(props: Object): React.Element {

    const {forgotPasswordPath, signUpPath, onChange, onLogin, errors} = props;

    return <View style={styles.container}>
        <Text>Login</Text>
        <TextInput autoCapitalize="none" keyboardType="email-address" autoFocus={true} style={{height: 40, borderColor: 'gray', borderWidth: 1}} onChangeText={onChange('username')}/>
        <TextInput autoCapitalize="none" secureTextEntry={true} style={{height: 40, borderColor: 'gray', borderWidth: 1}} onChangeText={onChange('password')}/>
        <Button
            onPress={onLogin}
            title="Login"
            color="#841584"
        />
    </View>;
}

export default class LoginFormWrapper extends React.Component {
    render(): React.Element {
        return <BaseLoginForm
            auth={auth}
            LoginComponent={LoginComponent}
            VerificationComponent={VerificationComponent}
            LoadingComponent={LoadingComponent}
            WrappingComponent={WrappingComponent}
            {...this.props}
        />;
    }
}
