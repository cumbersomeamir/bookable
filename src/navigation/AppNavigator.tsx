import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '@/screens/SplashScreen';
import TabNavigator from '@/navigation/TabNavigator';
import RestaurantDetailScreen from '@/screens/RestaurantDetailScreen';

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  Home: undefined;
  RestaurantDetail: {slug: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{gestureEnabled: false, animation: 'fade'}}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{gestureEnabled: false, animation: 'fade'}}
        />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
