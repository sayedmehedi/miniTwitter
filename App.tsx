/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';



import AllTheProviders from '@src/providers/AllTheProviders';
import RootStackNavigator from '@src/navigators/RootStackNavigator';


function App(): JSX.Element {
  return (
    <AllTheProviders>
      <RootStackNavigator />
    </AllTheProviders>
  );
}



export default App;
