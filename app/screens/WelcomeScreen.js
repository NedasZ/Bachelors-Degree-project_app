import React, { useContext } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity} from 'react-native';
import { globalStyles } from '../styles/global';

function WelcomeScreen({navigation}) {
    

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Orientavimosi Programėlė</Text>
            {/* <View style={globalStyles.button}>
                <Button  title="Login" onPress={() => navigation.navigate('Login')}/>  
            </View>
            <View style={globalStyles.button}>
                <Button  title="Register" onPress={() => navigation.navigate('Register')}/>  
            </View>  */}
            <TouchableOpacity style={globalStyles.loginBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={globalStyles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.loginBtn} onPress={() => navigation.navigate('Register')}>
                <Text style={globalStyles.loginText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    
})
export default WelcomeScreen;