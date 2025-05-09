import React from 'react';
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
};

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Deseja realmente sair da sua conta?');
      if (!confirmed) return;

      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('senha');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      });
    } else {
      Alert.alert(
        'Deseja sair?',
        'Você tem certeza que deseja fazer logout?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: async () => {
              await AsyncStorage.removeItem('email');
              await AsyncStorage.removeItem('senha');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
              });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        {/* Botão logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Image source={require('../assets/logout.png')} style={styles.logoutIcon} />
        </TouchableOpacity>

        <Image source={require('../assets/img.png')} style={styles.logo} />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => alert('Perfil ainda não implementado')}
          >
            <Image source={require('../assets/icon_profile.png')} style={styles.icon} />
            <Text style={styles.buttonText}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Quiz')}
          >
            <Text style={styles.buttonText}>Quizzes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Help')}
          >
            <Image source={require('../assets/icon_help.png')} style={styles.icon} />
            <Text style={styles.buttonText}>Dúvidas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Alarm')}
          >
            <Image source={require('../assets/icon_alarm.png')} style={styles.icon} />
            <Text style={styles.buttonText}>Alarme</Text>
          </TouchableOpacity>
        </View>

        {/* Balão e mascote */}
        <View style={styles.mascotContainer}>
          <View style={styles.bubbleWrapper}>
            <Image source={require('../assets/bubble_background.png')} style={styles.bubble} />
            <Text style={styles.bubbleText}>
              Vamos brincar?{'\n'}Escolha uma das opções acima{'\n'}para o Super Dentinho te ajudar!
            </Text>
          </View>
          <Image source={require('../assets/img_mascot.png')} style={styles.mascot} />
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
    width: 60,
    height: 60,
    resizeMode: 'contain',
    tintColor: '#444',
  },
  logoutLabel: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
  },
  logo: {
    width: 350,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#e06666',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  mascotContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: 16,
    position: 'absolute',
    bottom: 50,
  },
  bubbleWrapper: {
    position: 'relative',
    width: 290,
    height: 190,
    marginBottom: -10,
  },
  bubble: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  bubbleText: {
    position: 'absolute',
    top: 32,
    left: 16,
    right: 16,
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
  },
  mascot: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
});
