import React, { useState, useContext }  from 'react';
import { View, StyleSheet, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import * as EventController from '../controllers/EventController';
import {UserContext} from "../controllers/DatabaseController";



function JoinEventScreen({navigation}) {
    const [eventName, setEventName] = useState('Bandomasis_ivykis');
    const user = useContext(UserContext);

    const JoinEvent = async () => {
        await EventController.JoinEvent(eventName,user).then((data) => {
            if(data.error != null) {
                alert("Could not join event. Check event name.");
                return;
            }
            navigation.navigate('Event Live Screen', {data});
        });
    }

    return (
        <View style={globalStyles.container}>
            {/* <View>
            <Text style={styles.inputTitle}>{user.data.name}</Text>
            
            </View> */}
            <Text style={globalStyles.inputTitle}>EventName</Text>
            <View style={globalStyles.inputView}>
                <TextInput
                    style={globalStyles.TextInput}
                    placeholder="name of event"
                    placeholderTextColor="#003f5c"
                    onChangeText={(event) => setEventName(event)}
                />
            </View>

            <TouchableOpacity style={globalStyles.loginBtn} onPress={() => {JoinEvent()}}>
                <Text style={globalStyles.loginText}>Join event</Text>
            </TouchableOpacity>

            
        </View>
    );
}

const styles = StyleSheet.create({
    
})
export default JoinEventScreen;