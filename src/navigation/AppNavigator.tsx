import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '@/screens/SplashScreen';
import TabNavigator from '@/navigation/TabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{gestureEnabled: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
