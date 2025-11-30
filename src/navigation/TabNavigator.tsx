import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '@/screens/HomeScreen';
import SearchScreen from '@/screens/SearchScreen';
import RewardsScreen from '@/screens/RewardsScreen';
import BookingsScreen from '@/screens/BookingsScreen';
import UpdatesScreen from '@/screens/UpdatesScreen';

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Rewards: undefined;
  Bookings: undefined;
  Updates: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#DA3743',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({focused, color}) => {
          let iconName: string;
          
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Rewards':
              iconName = 'stars';
              break;
            case 'Bookings':
              iconName = 'calendar-today';
              break;
            case 'Updates':
              iconName = 'notifications-none';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <View style={styles.iconContainer}>
              {focused && route.name === 'Home' && <View style={styles.activeDot} />}
              <Icon name={iconName} size={24} color={color} />
            </View>
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Updates" component={UpdatesScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    paddingBottom: 8,
    height: 64,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
  },
  activeDot: {
    position: 'absolute',
    top: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DA3743',
  },
});

export default TabNavigator;

