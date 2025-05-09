import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const AlarmScreen = () => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState('');

  const handleTimeChange = (_: any, date?: Date) => {
    if (date) setSelectedTime(date);
  };

  const defineAlarm = () => {
    const formatted = selectedTime.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    Alert.alert('Alarme Definido', `O alarme foi definido para ${formatted}`);
  };

  const fetchCurrentTime = async () => {
    try {
      const { data } = await axios.get(
        'https://www.timeapi.io/api/Time/current/zone?timeZone=America/Sao_Paulo'
      );

      if (data?.hour != null && data?.minute != null && data?.seconds != null) {
        const formatted = `${data.hour.toString().padStart(2, '0')}:${data.minute
          .toString()
          .padStart(2, '0')}:${data.seconds.toString().padStart(2, '0')}`;
        setCurrentTime(formatted);
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Erro ao buscar horário:', error.message);
      } else {
        console.log('Erro ao buscar horário:', error);
      }

      const fallback = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(fallback);

      Alert.alert(
        'Atenção',
        'Não foi possível obter o horário da internet. Usando o horário do dispositivo.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Defina o horário do alarme</Text>

      <DateTimePicker
        value={selectedTime}
        mode="time"
        display="spinner"
        onChange={handleTimeChange}
        style={{ width: 320, backgroundColor: 'white' }}
      />

      <TouchableOpacity style={styles.redButton} onPress={defineAlarm}>
        <Text style={styles.buttonText}>Definir Alarme</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.blueButton} onPress={fetchCurrentTime}>
        <Text style={styles.buttonText}>Obter Horário Atual</Text>
      </TouchableOpacity>

      {currentTime !== '' && (
        <Text style={styles.timeText}>Horário atual: {currentTime}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  title: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'
  },
  redButton: {
    backgroundColor: 'red', padding: 12, borderRadius: 8,
    marginTop: 20, width: '80%', alignItems: 'center'
  },
  blueButton: {
    backgroundColor: 'blue', padding: 12, borderRadius: 8,
    marginTop: 12, width: '80%', alignItems: 'center'
  },
  buttonText: {
    color: 'white', fontSize: 16
  },
  timeText: {
    marginTop: 20, fontSize: 16, fontWeight: 'bold'
  },
});

export default AlarmScreen;
