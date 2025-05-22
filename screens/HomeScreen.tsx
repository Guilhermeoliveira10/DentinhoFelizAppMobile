import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type TabParamList = {
  Home: undefined;
  Quiz: undefined;
  Help: undefined;
  Alarm: undefined;
  Profile: undefined;
};

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadUsername = async () => {
      const email = await AsyncStorage.getItem('email');
      if (email) {
        const userData = await AsyncStorage.getItem(`user:${email}`);
        if (userData) {
          const parsed = JSON.parse(userData);
          setUsername(parsed.username);
        }
      }
    };
    loadUsername();
  }, []);

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Deseja realmente sair da sua conta?');
      if (!confirmed) return;

      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('senha');
      navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
    } else {
      Alert.alert('Deseja sair?', 'Você tem certeza que deseja fazer logout?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('senha');
            navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
          },
        },
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Image source={require('../assets/logout.png')} style={styles.logoutIcon} />
        </TouchableOpacity>

        <Image source={require('../assets/img.png')} style={styles.logo} />

        {username && (
          <Text style={styles.welcomeText}>Bem-vindo(a), {username}!</Text>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
            <Image source={require('../assets/icon_profile.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Quiz')}>
            <Image source={require('../assets/quizzes.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Quizzes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Help')}>
            <Image source={require('../assets/duvidas.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Dúvidas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Alarm')}>
            <Image source={require('../assets/alarme.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Alarme</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    padding: 16,
    position: 'relative',
    minHeight: height * 0.9,
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
    tintColor: '#444',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#e06666',
    width: '47%',
    height: 140,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
  },
  buttonImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
