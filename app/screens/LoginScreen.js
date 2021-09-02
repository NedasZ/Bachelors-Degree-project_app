import React, { useState, useContext }  from 'react';
import { View, StyleSheet, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import * as userController from '../controllers/UserController';
import {UserContext} from "../controllers/DatabaseController";



function LoginScreen(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const user = useContext(UserContext);

    function validateEmail(email){
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const SignIn = async () => {

        if(!validateEmail(email)){
            alert("Please use a valid email address.");
            return;
        }
        
        await userController.LoginUser(email,password).then((data) => {
            //console.log("hello3");
            if(data != null){
                if(data.error != null) {
                    alert("Could not login. Check username and password.");
                    return;
                }else{
                    user.setData(data);
                }
            }
        });
    }

    return (
        <View style={globalStyles.container}>
            {/* <View>
            <Text style={styles.inputTitle}>{user.data.name}</Text>
            
            </View> */}
            <Text style={globalStyles.inputTitle}>Email</Text>
            <View style={globalStyles.inputView}>
                <TextInput
                    style={globalStyles.TextInput}
                    placeholder="Email."
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            <Text style={globalStyles.inputTitle}>Password</Text>
            <View style={globalStyles.inputView}>
                <TextInput
                    style={globalStyles.TextInput}
                    placeholder="Password."
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            {/* <TouchableOpacity>
                <Text style={styles.forgot_button}>Forgot Password?</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={globalStyles.loginBtn} onPress={() => {SignIn()}}>
                <Text style={globalStyles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            
        </View>
    );
}

const styles = StyleSheet.create({
    
})
export default LoginScreen;