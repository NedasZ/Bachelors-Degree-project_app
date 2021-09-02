import React, { useContext } from 'react';

import { View, StyleSheet, Text,TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import {SQL, UserContext} from "../controllers/DatabaseController";
import * as EventController from '../controllers/EventController';
import * as userController from '../controllers/UserController';



function MainScreen({navigation}) {
    const user = useContext(UserContext);
    let checkEvent = true;
    if(checkEvent)
    {
        //console.log("checking event data");
        checkEvent = false;
        SQL.GetEvent().then((DBData) => {
            if(DBData.length > 0){
                let data = DBData[0];
                data.map = JSON.parse(data.map);
                //console.log(data);
                navigation.navigate('Event Live Screen', {data,navigation});
            }
        });
    }

    const EventList = async () => {
        //console.log(user);
        await EventController.UserEvents(user.data.userid,user.data.token).then((data) => {
            //console.log(data);
            navigation.navigate('My Events', {data, navigation})
        });
    }

    const Logout = () => {
        const defaultUserData = {
            name: 'user',
            userid: 0,
            token: 0
        }
        userController.LogoutUser();
        user.setData(defaultUserData);
    }

    return (
        <View style={styles.container}>
            <Text style={globalStyles.titleText}>Main screen</Text>  
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Join Event')}>
                <Text style={globalStyles.loginText}>Join Event</Text>
            </TouchableOpacity>   
            <TouchableOpacity style={styles.loginBtn} onPress={() => {EventList()}}>
                <Text style={globalStyles.loginText}>My events</Text>
            </TouchableOpacity>     
            <TouchableOpacity style={styles.loginBtn} onPress={() => {Logout()}}>
                <Text style={globalStyles.loginText}>Logout</Text>
            </TouchableOpacity>    
        </View>

        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch', //cross axis
        
        justifyContent: 'center', //main axis
        textAlign: 'center',
        //marginHorizontal: 16,
        padding: 20,

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
})
export default MainScreen;