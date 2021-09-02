import React, { useState, useContext , useEffect, useRef}  from 'react';
import { View, StyleSheet, Text, TextInput, Modal, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Overlay, Polyline} from 'react-native-maps';
import {  Menu,  MenuOptions,  MenuOption,  MenuTrigger,} from 'react-native-popup-menu';

import { globalStyles } from '../styles/global';
import * as Location from 'expo-location';
import {UserContext} from "../controllers/DatabaseController";
import * as Linking from 'expo-linking';

import * as EventController from "../controllers/EventController";

const { width } = Dimensions.get("window");

function EventLiveScreen({route, navigation}) {
    
   
    const [firstLoad, setfirstLoad] = useState(true);
    const user = useContext(UserContext);
    const [eventState, setEventState] = useState(route.params.data.status);
    const [userRole, setUserRole] = useState(route.params.data.role);
    const [isMap, setMapState] = useState(false);
    const [mapUrl, setMapUrl] = useState('');
   
    const [eventUsers, setEventUsers] = useState([]);
    const [markersState, setMarkersState] = useState([]);
    const [tailsState, setTailsState] = useState([]);

    var initialReg = {
      latitude: 54.89660130661465,
      longitude: 23.954401016235355,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    

    if(route.params.data.map != null){
      if(!isMap){
        setMapState(true);
        setMapUrl(route.params.data.map.url);
      }
      
      
      
      var map_position = JSON.parse(route.params.data.map.map_display_info);
      //console.log(map_position);
      var map_rotation = parseFloat(map_position.rotation);
      var fix_ratio = Math.sin(map_rotation* (Math.PI/180)) + Math.cos(map_rotation* (Math.PI/180));
      
      var map_height = parseFloat(map_position.height) * fix_ratio;
      var map_width = parseFloat(map_position.width) * fix_ratio;    
      var map_scale = parseFloat(map_position.scale);
      
      var map_lat = parseFloat(map_position.latitude);
      
      var map_lng = parseFloat(map_position.longitude);

      var map_fix_lat = (map_height * map_scale * 0.001 / 111111);
      var map_fix_lng = map_width*map_scale*0.001/(111111 * Math.cos(map_lat * (Math.PI/180)));
      map_lat = map_lat + map_fix_lat * Math.sin(map_rotation * (Math.PI/180)) / 2;
      map_lng = map_lng - map_fix_lng * Math.sin(map_rotation * (Math.PI/180)) / 2;
      
  
      var org_route = route.params.data.map.url;
      var n = org_route.indexOf('upload')+7;
      var new_route = org_route.substr(0,n) + 'a_'+map_rotation + '/' + org_route.substr(n, org_route.length);

  
      
      var map_topleft = [map_lat + (-map_height * map_scale * 0.001 / 111111), map_lng + map_width*map_scale*0.001/(111111 * Math.cos(map_lat * (Math.PI/180)) )];
      var map_botright = [map_lat, map_lng];
    }
    const [region, setRegion] = useState(initialReg);
    const [eventName, setEventName] = useState(route.params.data.name);
    const [eventID, setEventID] = useState(route.params.data.id);
    const [eventDescription, setEventDescription] = useState(route.params.data.description);

    //location tracking vars
    var numberOfLocationsToSend = 10;
    var locationRefreshTime = 10000; //ms
    var regionlatdelta = 0.0200;
    var regionlngdelta = 0.0200;

    
    const [location, setLocation] = useState(null);
    // const [lCount, setLCount] = useState(0);
    var lCount = 0;

    const [errorMsg, setErrorMsg] = useState("");

    const [startState, setStartState] = useState(false);
    const [recordingButtonText, setRecordingButtonText] = useState("Start recording");

    const [monitorState, setMonitorState] = useState(false);
    const [monitorButtonText, setMonitorButtonText] = useState("Monitor Event");
    

    
    const [isRoleInputVisible, setRoleInputVisible] = useState(false);
    const [isUserActionChoiceVisible, setUserActionChoiceVisible] = useState(false);
    const [isCommChoiceVisible, setCommChoiceVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [inputUser, setInputUser] = useState("");

    const EditUserRole = () => {
      
      if(inputValue == '2' || inputValue == '4' || inputValue == '3'){
        //console.log(eventUsers[inputUser]);
        if(eventUsers[inputUser].role != 1){
          EventController.EditUserRole(user.data.token, eventUsers[inputUser],inputValue).then((message) => {
            //console.log(message);
          })
          setRoleInputVisible(!isRoleInputVisible);
        }
        else{
          alert('Can\'t edit event creator.');
        }
      }
      else{
        alert('Wrong input');
      }
    };

    const [subsricption, setSubs] = useState();
    
    const toggleRecording = async () => {
      if(!startState){
        if(eventState < 1){
          alert('The event isnt live! You can not start.');
            return;
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            alert('Permission to access location while in background was denied');
            return;
          }

          setSubs(await Location.watchPositionAsync({accuracy: Location.Accuracy.Highest,timeInterval: locationRefreshTime, distanceInterval: 0}, (data) => {
            lCount = lCount + 1;
            //console.log('LCount:'+ lCount);
            setLocation(data);
            var statedup = markersState;
            statedup[0] = {
              name: 'me',
              timestamp: new Date(data.timestamp).toLocaleTimeString(),
              latlng: {latitude : data.coords.latitude,longitude : data.coords.longitude}                      
            };
            setMarkersState(statedup);
            
            if(lCount >= numberOfLocationsToSend)
            {  
              console.log("sent data");          
              EventController.ProcessLocation(data, true,user.data.userid, user.data.token).then((response) => {
                lCount = 0;
              });
            }else{
              console.log(lCount);
              EventController.ProcessLocation(data, false);
            }
          }));

          //console.log("starting location recording");
          setRecordingButtonText("Stop Recording");
          setStartState(true);

      }else{
        setStartState(false);
        setRecordingButtonText("Start Recording");
        //console.log("stopping location recording");
        subsricption.remove();
      }
    }

    const monitorEvent = async () => {
      
      if(!monitorState){
        if(eventState < 1){
          alert('The event isnt live! You can not monitor the event.');
            return;
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            alert('Permission to access location while in background was denied');
            return;
          }

          setSubs(await Location.watchPositionAsync({accuracy: Location.Accuracy.Highest,timeInterval: locationRefreshTime, distanceInterval: 0}, (data) => {
                        
            EventController.ProcessLocation(data, true,user.data.userid, user.data.token).then((response) => {
            });

            EventController.GetEventData(user.data.userid, user.data.token).then((freshEventData, eventchanged, role) => {
              //console.log(freshEventData); 
              //console.log(JSON.parse(freshEventData));  
              
              setEventName(freshEventData.eventData.name);
              setEventID(freshEventData.eventData.id);
              setEventDescription(freshEventData.eventData.description);
                

              setLocation(data); 
              var markerArray = [];
              var userArray = [];
              let allTailsArray = [];
              markerArray[markerArray.length] = {
                name: "me",
                timestamp: new Date(data.timestamp).toLocaleTimeString(),
                latlng: {latitude : data.coords.latitude,longitude : data.coords.longitude} 
              }

              // console.log('checked for data');
              for(var i = 0; i<freshEventData.users.length; i++){
                let userData = freshEventData.users[i];

                userArray[userArray.length] = {
                  name: userData.name,
                  role: userData.role,
                  id: userData.id,
                  phoneNumber: userData.phoneNr,
                }
                //console.log(userData);
                if(userData.id != user.data.userid && userData.location != null){
                  let allLocs = userData.location;
                  //console.log(allLocs[0]);
                  let locationData = JSON.parse(allLocs[0].location);
                  markerArray[markerArray.length] = {
                    name: userData.name,
                    timestamp: new Date(locationData.timestamp).toLocaleTimeString(),
                    latlng: {latitude : locationData.coords.latitude,longitude : locationData.coords.longitude}                      
                  }

                  if(allLocs.length > 1){
                      
                    let tailArray = [];
                    for(let u = 0; u < allLocs.length; u++){
                      let locPoint = JSON.parse(allLocs[u].location);
                      let tailPoint = {latitude: locPoint.coords.latitude, longitude: locPoint.coords.longitude}
                      
                      tailArray[tailArray.length] = tailPoint;
                      
                    }
                    allTailsArray[allTailsArray.length] = tailArray;
                    
                  }
                }
              }
              
              setEventUsers(userArray);
              setMarkersState(markerArray);
              setTailsState(allTailsArray);
            });  
            
          }));

          //console.log("starting event monitoring");
          setMonitorButtonText("Stop Monitoring");
          setMonitorState(true);
      }else{
        setMonitorState(false);
        setMonitorButtonText("Monitor Event");
        //console.log("stopping event monitoring");
        subsricption.remove();
      }
    }
    
    useEffect(() => {(async () => {
      if(firstLoad){
        setfirstLoad(false);
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location2 = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
          setLocation(location2);
          //console.log(location2);
          var statedup = markersState;
          statedup[0] = {
            name: 'me',
            timestamp: new Date(location2.timestamp).toLocaleTimeString(),
            latlng: {latitude : location2.coords.latitude,longitude : location2.coords.longitude}                      
          };
          if(markersState.length < 1){
            setMarkersState(statedup);
          }
          setRegion({
            latitude: location2.coords.latitude,
            longitude: location2.coords.longitude,
            latitudeDelta: regionlatdelta,
            longitudeDelta: regionlngdelta,
          });
    }})();
    }, []);
    
    const refreshLocation = () =>{
      if(eventState < 1){
        alert('The event isnt live! You can not refresh your location.');
          return;
      }
      
        Location.getCurrentPositionAsync({}).then((loc) => {
            setLocation(loc);
            var markerArray = [];
            let allTailsArray = [];
            //console.log("------------------------------------------------------------------");
            markerArray[0] = {
              name: 'me',
              timestamp: new Date(loc.timestamp).toLocaleTimeString(),
              latlng: {latitude : loc.coords.latitude,longitude : loc.coords.longitude}                      
            };
            if(markersState.length < 1){
              setMarkersState(markerArray);
            }
            // setRegion({
            //     latitude: loc.coords.latitude,
            //     longitude: loc.coords.longitude,
            //     latitudeDelta: regionlatdelta,
            //     longitudeDelta: regionlngdelta,
            // });
            
            EventController.ProcessLocation(loc, true,user.data.userid, user.data.token).then((response) => {
              lCount = 0;
            });
            
            EventController.GetEventData(user.data.userid, user.data.token).then((freshEventData, eventchanged, role) => {
              //console.log(freshEventData);
              
                setEventName(freshEventData.eventData.name);
                setEventID(freshEventData.eventData.id);
                setEventDescription(freshEventData.eventData.description);
                setEventState(freshEventData.eventData.status);
                //setUserRole(role);
              
                var userArray = [];
                for(var i = 0; i<freshEventData.users.length; i++){
                  let userData = freshEventData.users[i];
                  //console.log(userData);
                  userArray[userArray.length] = {
                    name: userData.name,
                    role: userData.role,
                    id: userData.id,
                    phoneNumber: userData.phoneNr,
                  }

                  //console.log(userData);
                  if(userData.id != user.data.userid && userData.location != null){
                    let allLocs = userData.location;
                    //console.log(allLocs);
                    let locationData = JSON.parse(allLocs[0].location);
                    //console.log(JSON.parse(allLocs.location[0]));
                    markerArray[markerArray.length] = {
                      name: userData.name,
                      timestamp: new Date(locationData.timestamp).toLocaleTimeString(),
                      latlng: {latitude : locationData.coords.latitude,longitude : locationData.coords.longitude}                      
                    }
                    if(allLocs.length > 1){
                      
                      let tailArray = [];
                      for(let u = 0; u < allLocs.length; u++){
                        let locPoint = JSON.parse(allLocs[u].location);
                        let tailPoint = {latitude: locPoint.coords.latitude, longitude: locPoint.coords.longitude}
                        
                        tailArray[tailArray.length] = tailPoint;
                        
                      }
                      allTailsArray[allTailsArray.length] = tailArray;
                      
                    }
                    
                  }
                  else{
                    
                    if(userRole != 1 && userRole != userData.role){
                      setUserRole(userData.role);
                    }
                  }
                  } 
                setEventUsers(userArray);
                
                if(userRole < 3){
                  setMarkersState(markerArray);
                  setTailsState(allTailsArray);
                  //console.log(allTailsArray);
                }
            });  
          
        });
      }

    const LeaveEvent = async () => {
        await EventController.LeaveEvent().then((data) => {
            //console.log("left event");
            navigation.navigate("Home");
        });
    }

    endEvent = async () => {
      if(eventState < 1){
        alert('The event has already ended.');
          return;
      }
      await EventController.EndEvent(eventID,user.data.token ).then((data) =>{
        var msg = JSON.parse(data).message;
        
        if(msg == "event has ended"){
          refreshLocation();
          alert(msg);
        }
        else{
          alert(msg);
        }
        

      });
    }
    const CallUser = () => {
      //console.log(eventUsers[inputUser].phoneNumber);

        var number = eventUsers[inputUser].phoneNumber;

        
        Linking.openURL(`tel:`+number);
    }
    const MessageUser = () => {


      var number = eventUsers[inputUser].phoneNumber;

      Linking.openURL(`sms:`+number);
  }


    return (
        <View style={globalStyles.container}>
                <Modal animationType="slide" 
                    transparent visible={isRoleInputVisible} 
                    presentationStyle="overFullScreen" 
                    >
                  <View style={styles.viewWrapper}>
                      <View style={styles.modalView}>
                          <Text style={{marginTop: 10}}>Modify user Role.</Text>
                          <Text >2-Event Admin</Text>
                          <Text >3-event user</Text>
                          <Text style={{marginBottom: 10}}>4-user cant see himself</Text>
                          <TextInput placeholder="Enter role 2-4..." 
                                    value={inputValue} style={styles.textInput} 
                                    onChangeText={(value) => setInputValue(value)} />
    
                          {/** This button is responsible to close the modal */}
                          <View style={styles.ModalMenuContainer}>
                            <TouchableOpacity style={styles.ModalLoginBtn} onPress={() => {EditUserRole()}}>
                                <Text style={globalStyles.loginText}>{'Save'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ModalLoginBtn} onPress={() => {setRoleInputVisible(!isRoleInputVisible)}}>
                                <Text style={globalStyles.loginText}>{'Cancel'}</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
                  </View>
                </Modal>
                <Modal animationType="slide" 
                    transparent visible={isUserActionChoiceVisible} 
                    presentationStyle="overFullScreen" 
                    >
                  <View style={styles.viewWrapper}>
                      <View style={styles.modalView}>
                          <Text style={{marginTop: 10}}>Choose what to do.</Text>
                          
                          {/** This button is responsible to close the modal */}
                          <View>
                            <TouchableOpacity style={styles.ModalLoginBtn} onPress={() => {setUserActionChoiceVisible(!isUserActionChoiceVisible);setCommChoiceVisible(!isCommChoiceVisible);}}>
                                <Text style={globalStyles.loginText}>{'Contact'}</Text>
                            </TouchableOpacity>
                            {userRole < 3 ? (
                              <TouchableOpacity style={styles.ModalLoginBtn} onPress={() => {setUserActionChoiceVisible(!isUserActionChoiceVisible);setRoleInputVisible(!isRoleInputVisible);}}>
                                <Text style={globalStyles.loginText}>{'Edit Role'}</Text>
                              </TouchableOpacity>
                            ) : (
                              null
                            )}
                            
                            <TouchableOpacity style={styles.ModalLoginBtn} onPress={() => {setUserActionChoiceVisible(!isUserActionChoiceVisible)}}>
                                <Text style={globalStyles.loginText}>{'Cancel'}</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
                  </View>
                </Modal>
                <Modal animationType="slide" 
                    transparent visible={isCommChoiceVisible} 
                    presentationStyle="overFullScreen" 
                    >
                  <View style={styles.viewWrapper}>
                      <View style={styles.modalView}>
                          <Text style={{marginTop: 10}}>How to contact user?</Text>
                          {/** This button is responsible to close the modal */}
                          <View >
                            <TouchableOpacity style={styles.ModalLoginBtn} onPress={() => {setCommChoiceVisible(!isCommChoiceVisible);CallUser();}}>
                                <Text style={globalStyles.loginText}>{'Call'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ModalLoginBtn} onPress={() => {setCommChoiceVisible(!isCommChoiceVisible);MessageUser()}}>
                                <Text style={globalStyles.loginText}>{'Message'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ModalLoginBtn} onPress={() => {setCommChoiceVisible(!isCommChoiceVisible)}}>
                                <Text style={globalStyles.loginText}>{'Cancel'}</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
                  </View>
                </Modal>
          <View style={styles.menuContainer}>                 
                <Menu >
                  <MenuTrigger text='Event Actions' customStyles={triggerStyles} />
                  <MenuOptions customStyles={optionStyles}>
                    <MenuOption onSelect={() => {refreshLocation()}} text='Refresh Event Data' />
                    <MenuOption onSelect={() => {Alert.alert(`Leave event?`, 'Do you really want to leave the event?',[{text: 'Yes', onPress: () => {LeaveEvent()}}, {text: 'No', style: "cancel"}])}} text='Leave Event' />
                    {userRole < 3 ? (
                      <MenuOption onSelect={() => {monitorEvent()}} text={monitorButtonText} />
                      
                    ) : (
                      null
                    )}
                    {userRole < 2 ? (
                      <MenuOption onSelect={() => {endEvent()}} text='End Event' />
                    ) : (
                      null
                    )}
                  </MenuOptions>
                </Menu>
                
                <Menu >
                  <MenuTrigger text='Event Users' customStyles={triggerStyles} />
                    <MenuOptions customStyles={optionStyles}>
                    { 
                      eventUsers.map((user, index) => {
                      return(
                          <MenuOption key={index} onSelect={() => {setUserActionChoiceVisible(!isUserActionChoiceVisible); setInputUser(index);}} text={user.name.concat(', Role: ').concat(user.role)} />
                      )})
                    }
                    {/* { 
                      eventUsers.map((user, index) => {
                      return(
                          <MenuOption key={index} onSelect={() => {CallUser()}} text={user.name.concat(', Role: ').concat(user.role)} />
                      )})
                    } */}
                    </MenuOptions>
                </Menu>
          </View>

          <View style={styles.container}>
            {eventState < 1 ? (
              <Text style={{fontSize: 25,fontWeight: 'bold'}}>The event has ended</Text>
            ) : (null)}
            <Text >Name: {eventName}</Text>
            {/* <Text >ID: {eventID}</Text> */}
            <Text >Description: {eventDescription}</Text>
            <Text >Role: {userRole}</Text>
            {/* <Text >{JSON.stringify(location)}</Text> */}
            
            
            <MapView style={styles.map} region={region}  onRegionChangeComplete={(region) => {setRegion(region)}}>
              { 
                userRole < 4 ? (
                markersState.map((marker, index) => {
                return(<Marker 
                  
                  key={index}
                  coordinate={marker.latlng}
                  title={marker.name}
                  description={marker.timestamp}
                />
                )})                
                ) : (null)
              }
              { 
                userRole < 3 ? (
                tailsState.map((array, index) => {
                return(<Polyline 
                  
                  key={index}
                  coordinates={array}
                  strokeWidth={8}
                  strokeColor='rgba(255,0,0,0.8)'

                />
                )})                
                ) : (null)
              }
                {/* <Marker 
                  coordinate={map_lat, map_lng}
                  title='map_anchor'
                />                 */}
                {isMap ? (<Overlay 
                image={new_route}
                
                // style={{transform: [{rotate: ' '+map_rotation+' deg'}],}}
                
                bounds={[ map_botright, map_topleft]}
              />) : (null)}
              
            </MapView>

            <TouchableOpacity style={styles.loginBtn} onPress={() => {toggleRecording()}}>
                <Text style={globalStyles.loginText}>{recordingButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
}


            {/* <Text >{props.route.params.data.map.url}</Text> */}
            {/* <Image source={url} style={{width: 400, height: 400}}/> */}
const optionStyles = {
  optionsContainer: {
    backgroundColor: '#62b562',
    
    borderRadius:15,
    //padding: 5,
  },
  optionsWrapper: {
    backgroundColor: '#62b562',
    
    borderRadius:15,
    padding:3
  },
  optionWrapper: {
    backgroundColor: '#90ee90',
    margin: 5,
    padding: 10,
    
    borderRadius:5,
    
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    color: 'black',
    textAlign: 'center'
  },
};

const triggerStyles = {
  triggerText: {
    color: 'black',
  },
  triggerOuterWrapper: {
    backgroundColor: '#90ee90',
    padding: 5,
    //flex: 1,
    borderRadius:15,
    
  },
  triggerWrapper: {
    backgroundColor: '#90ee90',
    alignItems: 'center',
    justifyContent: 'center',
    //flex: 1,
    height: 40,
    width: 130,
  },
  triggerTouchable: {
    //underlayColor: 'darkblue',
    activeOpacity: 90,
    
  },
};

const styles = StyleSheet.create({
    container: {
        flex: 10,
        backgroundColor: '#fff',
        alignItems: 'center', //cross axis
        justifyContent: 'flex-start', //main axis
        padding: 10,
    },
    titleText: {
        height: 100,
        position: "absolute",
        top: 100,
        fontSize: 30,
        fontWeight: 'bold',
    },
    map: {
        width: Dimensions.get('window').width*0.9,
        height: Dimensions.get('window').height*0.6,
      },

    menuContainer: {
      flex: 1,
      flexDirection: 'row-reverse',
      backgroundColor: '#fff',
      alignItems: 'stretch', //cross axis
      marginTop: 40,
      justifyContent: 'space-between', //main axis
      textAlign: 'center',
      //marginHorizontal: 16,
      //padding: 20,

    },
    
    triggerW:{
      //width:"200%",
      
      height:30,
      alignItems:"center",
      padding:20,
      justifyContent:"center",
      //marginTop:50,
      backgroundColor:"#90ee90",
    },
    optionsT:{
      //width:"80%",
      borderRadius:10,
      //height:45,
      padding: 10,
      //alignItems:"center",
      //justifyContent:"center",
      //marginTop:10,
      backgroundColor:"#acfaac",
    },
    optionsW:{
      //width:"80%",
      //borderRadius:10,
      //height:45,
      alignItems:"center",
      justifyContent:"center",
      //padding: 10,
      margin: 5,
      //marginTop:10,
      backgroundColor:"#acfaac",
    }
    ,
    loginBtn:{
      alignSelf: 'center',
      width:"80%",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      //padding: 10,
      marginTop:10,
      backgroundColor:"#90ee90",
    },
    viewWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  ModalMenuContainer: {
    flex: 1,
    flexDirection: 'row',
    //width: width * 0.8,
    //backgroundColor: '#fff',
    //alignItems: 'stretch', //cross axis
    marginTop: 0,
    justifyContent: 'space-between', //main axis
    textAlign: 'center',
    //marginHorizontal: 16,
    //padding: 20,

  },
  ModalLoginBtn:{
    alignSelf: 'center',
    width:width * 0.3,
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    //padding: 10,
    marginTop:10,
    backgroundColor:"#90ee90",
  },
  modalView: {
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      elevation: 5,
      transform: [{ translateX: -(width * 0.4) }, 
                  { translateY: -90 }],
      height: 220,
      width: width * 0.8,
      backgroundColor: "#fff",
      borderRadius: 7,
  },
  textInput: {
      width: "80%",
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderWidth: 1,
      marginBottom: 8,
  },

})
export default EventLiveScreen;