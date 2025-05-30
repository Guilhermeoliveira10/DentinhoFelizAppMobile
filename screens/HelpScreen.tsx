import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import apiAdvice from '../services/apiAdvice';
import type { RootStackParamList, TabParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Help'>;

const HelpScreen = () => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const getAdvice = async (category: string) => {
    setLoading(true);
    try {
      const { data } = await apiAdvice.get(`/advice/${category}`);
      setAdvice(data.advice || 'Nenhum conselho disponível.');
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar o conselho.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: 'Escovação', key: 'toothCare' },
    { label: 'Bons Hábitos', key: 'goodHabits' },
    { label: 'Fio Dental', key: 'dentalFloss' },
    { label: 'Dor de Dente', key: 'toothache' },
  ];

  return (
    <View style={styles.container}>
      <Image source={require('../assets/img.png')} style={styles.image} />
      <Text style={styles.title}>Selecione sua dúvida, que o Super Dentinho irá ajudar!</Text>

      {categories.map(({ label, key }) => (
        <TouchableOpacity key={key} style={styles.button} onPress={() => getAdvice(key)}>
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
      ))}

      {loading ? (
        <ActivityIndicator size="large" color="red" style={{ marginTop: 20 }} />
      ) : (
        advice && <Text style={styles.advice}>{advice}</Text>
      )}

      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('Admin')}>
        <Text style={styles.adminButtonText}>Adicionar dúvida</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  image: { width: 150, height: 150, marginBottom: 20 },
  title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  button: {
    backgroundColor: 'red',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
  advice: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#333',
  },
  adminButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#e06666',
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HelpScreen;
