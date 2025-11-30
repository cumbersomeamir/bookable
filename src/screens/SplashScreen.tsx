import React, {useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#DA3743', '#C12E39', '#A82530']}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Icon name="menu-book" size={80} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Bookable</Text>
          <Text style={styles.subtitle}>Restaurant Reservations</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
});

export default SplashScreen;
