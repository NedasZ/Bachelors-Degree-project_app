import 'react-native-gesture-handler';
//import * as React from 'react';
import React, { } from 'react';

import NavigationContainerStack from './app/routes';

import {SQL, ContextProvider} from "./app/controllers/DatabaseController";



export default function App() {

  SQL.InitDatabase();

  return (
    <ContextProvider>
      <NavigationContainerStack />
    </ContextProvider> 
  );
}