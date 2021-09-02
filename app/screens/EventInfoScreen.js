import React, { useContext,useEffect,useState }  from 'react';
import { View, StyleSheet, Text,TouchableOpacity, Dimensions , ScrollView} from 'react-native';
import { globalStyles } from '../styles/global';
import {UserContext} from "../controllers/DatabaseController";
import * as EventController from '../controllers/EventController';
import * as userController from '../controllers/UserController';

function EventInfoScreen({route, navigation}) {
    const user = useContext(UserContext);
    
    const [eventArray, setEventArray] = useState([]);
    //console.log(route.params.data);
    const [userData, setUserData] = useState(route.params.data.userData);
    
    const [eventData, setEventData] = useState(JSON.parse(route.params.data).eventData);
    
    const [userLocations, setUserLocations] = useState(route.params.data.locations);
    // useEffect(() => {
    //     //setEventArray(JSON.parse(route.params.data).eventData);
    //     //console.log('array set');
    // }, [] );  

    //console.log(eventData);
   //console.log(userLocations);
    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.titleText}>Event Info</Text>
                <View>
                    <Text>Name: {eventData.name}</Text>
                    <Text>Description: {eventData.description}</Text>
                </View>
                
                <Text style={styles.titleText}>Result</Text>
                {eventData.results != null ? (   
                    // console.log(eventData.results)          
                    eventData.results.map((res, index) => {
                        return(
                            <View key={index} style={styles.ListBox}>
                                
                                <Text style={styles.ListText}>{res.time_between}</Text>
                                <Text style={styles.ListText}>{res.time_total}</Text>
                                <Text style={styles.ListText}>{res.date}</Text>
                                <Text style={styles.ListText}>{res.code}</Text>
                            </View>
                        )}
                    )
                ) : (null)}
                
            </ScrollView>
            
        </View>

        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch', //cross axis
        justifyContent: 'flex-start', //main axis
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    ListText: {
        padding: 5,
        fontSize: 16

    },
    ListBox:{
        flex: 1,
        flexDirection: "row-reverse",

    },
    
    titleText: {
        paddingTop: 20,
        height: 60,
        fontSize: 30,
        fontWeight: 'bold',
    },
})
export default EventInfoScreen;