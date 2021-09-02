import React, { useContext , useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider } from 'react-native-popup-menu';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainScreen from './screens/MainScreen';
import JoinEventScreen from './screens/JoinEventScreen';
import EventListScreen from './screens/EventListScreen';
import EventInfoScreen from './screens/EventInfoScreen';
import EventLiveScreen from './screens/EventLiveScreen';

import {SQL, UserContext} from "./controllers/DatabaseController";



const RootNavigationStack = createStackNavigator();


const RootStackScreen = () => {

  const user = useContext(UserContext);
  
  const [checkToken, setCheckToken] = useState(false);

  const RestoreToken = () => {
    //console.log('data');
    SQL.GetUser().then((data) => {
      if(data.length > 0)
      {
        //console.log('data');
        let userData = {
          name: data[0].name,
          userid: data[0].userid,
          token: data[0].token
        }
        user.setData(userData);
      }
    })
  }


  if(!checkToken){
    if(!user.data.token || user.data.token == 0){
      RestoreToken();
      }
    setCheckToken(true);
  }
  
  
  return (
        <RootNavigationStack.Navigator>
          {!user.data.token || user.data.token == 0 ? (
            <>
                <RootNavigationStack.Screen name="Welcome" component={WelcomeScreen} />
                <RootNavigationStack.Screen name="Login" component={LoginScreen} />
                <RootNavigationStack.Screen name="Register" component={RegisterScreen} />
            </>
            ) : (
            <>
                <RootNavigationStack.Screen name="Home" component={MainScreen} />
                <RootNavigationStack.Screen name="Join Event" component={JoinEventScreen} />
                <RootNavigationStack.Screen name="My Events" component={EventListScreen} />
                <RootNavigationStack.Screen name="Event Info" component={EventInfoScreen} />
                <RootNavigationStack.Screen name="Event Live Screen" component={EventLiveScreen} options={{headerShown: false}}/>
            </>
            )}
        </RootNavigationStack.Navigator>
  );
};


const NavigationContainerStack = () => (
  <MenuProvider>
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  </MenuProvider>
);

export default NavigationContainerStack;
