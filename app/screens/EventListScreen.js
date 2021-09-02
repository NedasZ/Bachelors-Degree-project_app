import React, { useContext,useEffect,useState }  from 'react';
import { View, StyleSheet, Text,TouchableOpacity, Dimensions  , ScrollView} from 'react-native';
import { globalStyles } from '../styles/global';
import {UserContext} from "../controllers/DatabaseController";
import * as EventController from '../controllers/EventController';
import * as userController from '../controllers/UserController';


function EventListScreen({route, navigation}) {
    const user = useContext(UserContext);
    
    const [eventArray, setEventArray] = useState([]);

    useEffect(() => {
        setEventArray(JSON.parse(route.params.data).eventData);
        //console.log('array set');
    }, [] );  

    openEvent = async (index) => {
        //console.log(eventArray[index]);
        await EventController.UserEventData(user.data.userid,eventArray[index].id,user.data.token).then((data) => {
            //console.log(data);
            navigation.navigate('Event Info', {data, navigation})
        });
    }
    
    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.titleText}>Event List</Text>
                {eventArray.map((data, index) => {
                    return(
                        <View key={index}>
                            <TouchableOpacity style={styles.ListItem} onPress={() => {openEvent(index)}}>
                                <Text style={styles.ListText}>{data.name}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
        </View>

        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start', //cross axis
        justifyContent: 'flex-start', //main axis
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    ListText: {
        padding: 20,
        fontSize: 20

    },
    ListItem:{
        alignSelf: 'center',
        borderRadius:5,
        height:50,
        width: Dimensions.get('window').width*0.9,
        alignItems:"flex-start",
        justifyContent:"center",
        //padding: 10,
        marginTop:10,
        backgroundColor:"#90ee90",
      },

    titleText: {
        height: 60,
        fontSize: 30,
        fontWeight: 'bold',
    },
})
export default EventListScreen;