import React, {useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar, Dimensions, Image} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import {setLoading, setFirstLaunch} from '@/store/slices/appSlice';
import {RootStackParamList} from '@/navigation/AppNavigator';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const {width, height} = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        dispatch(setLoading(false));
        dispatch(setFirstLaunch(false));
        navigation.replace('Main');
      } catch (error) {
        console.error('Initialization error:', error);
        dispatch(setLoading(false));
        navigation.replace('Main');
      }
    };

    initializeApp();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/bookable-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Restaurant Reservations</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    maxWidth: 300,
    maxHeight: 300,
    marginBottom: 24,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
