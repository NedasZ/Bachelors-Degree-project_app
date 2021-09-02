import React, { useState, useContext}  from 'react';
import { View, StyleSheet, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import * as userController from '../controllers/UserController';
import {UserContext} from "../controllers/DatabaseController";



    
function RegisterScreen(props) {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [c_password, setC_Password] = React.useState('');

    const user = useContext(UserContext);

    function validateEmail(email){
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const Register = async () => {
        if(!validateEmail(email)){
            alert("Please use a valid email address.");
            return;
        }
        if(username.length < 5){
            alert("Passwords must be at least 5 symbols.");
            return;
        }
        if(password.length < 6){
            alert("Passwords must be at least 6 symbols.");
            return;
        }
        if(password != c_password){
            alert("Passwords must match.");
            return;
        }
        
        

        await userController.RegisterUser(username,email,password,c_password).then((data) => {
            //console.log("hello3");

            if(data != null){
                if(data.error != null) {
                    alert("Could not register. Please check your info");
                    return;
                }else{
                    user.setData(data);
                }
            }
        });
    }

    return (
        <View style={globalStyles.container}>
            <Text style={styles.inputTitle}>Username</Text>
            <View style={styles.inputView}>
                
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username."
                    placeholderTextColor="#003f5c"
                    onChangeText={(username) => setUsername(username)}
                />
            </View>
            <Text style={styles.inputTitle}>Email</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email."
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            <Text style={styles.inputTitle}>Password</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password."
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            <Text style={styles.inputTitle}>Repeat Password</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Repeat Password."
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(c_password) => setC_Password(c_password)}
                />
            </View>
            <TouchableOpacity style={styles.loginBtn}  onPress={() => {Register();}}>
                <Text style={styles.loginText}>REGISTER</Text>
            </TouchableOpacity>

            
        </View>
    );
}

const styles = StyleSheet.create({
    inputView: {
        backgroundColor: "lightcyan",
        borderRadius: 30,
        //width: "70%",
        height: 45,
        //marginBottom: 20,
        alignItems: "flex-start",
      },      
      TextInput: {
        height: 50,
        flex: 3,
        padding: 5,
        marginLeft: 20,
      },
      loginBtn:{
        alignSelf: 'center',
        width:"80%",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        backgroundColor:"#90ee90",
      },
      inputTitle: {
        alignSelf: 'flex-start',
        marginTop: 20,
        marginLeft: 20,
      },
})
export default RegisterScreen;