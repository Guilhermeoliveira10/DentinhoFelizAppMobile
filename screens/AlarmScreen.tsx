import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Alarme {
  id: string;
  horario: string; // Exemplo: 09/05/2025 às 22:07
}

const AlarmScreen = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [alarmes, setAlarmes] = useState<Alarme[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    carregarAlarmes();
  }, []);

  const carregarAlarmes = async () => {
    const json = await AsyncStorage.getItem('alarmes');
    if (json) setAlarmes(JSON.parse(json));
  };

  const salvarAlarmes = async (lista: Alarme[]) => {
    await AsyncStorage.setItem('alarmes', JSON.stringify(lista));
    setAlarmes(lista);
  };

  const definirAlarme = async () => {
    const data = selectedDateTime;
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    const horarioFormatado = `${dia}/${mes}/${ano} às ${hora}:${minuto}`;

    if (editingId) {
      const atualizados = alarmes.map(al =>
        al.id === editingId ? { ...al, horario: horarioFormatado } : al
      );
      await salvarAlarmes(atualizados);
      setEditingId(null);
    } else {
      const novo: Alarme = {
        id: Date.now().toString(),
        horario: horarioFormatado,
      };
      await salvarAlarmes([...alarmes, novo]);
    }

    setSelectedDateTime(new Date());
  };

  const removerAlarme = async (id: string) => {
    const confirmar = Platform.OS === 'web'
      ? window.confirm('Deseja remover este alarme?')
      : await new Promise<boolean>((resolve) =>
          Alert.alert('Remover Alarme', 'Deseja excluir este alarme?', [
            { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Remover', style: 'destructive', onPress: () => resolve(true) },
          ])
        );

    if (!confirmar) return;

    const atualizados = alarmes.filter(al => al.id !== id);
    await salvarAlarmes(atualizados);
  };

  const editarAlarme = (alarme: Alarme) => {
    const regex = /(\d{2})\/(\d{2})\/(\d{4}) às (\d{2}):(\d{2})/;
    const match = alarme.horario.match(regex);
    if (!match) return;

    const [, dia, mes, ano, hora, minuto] = match;
    const date = new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia),
      parseInt(hora),
      parseInt(minuto)
    );
    setSelectedDateTime(date);
    setEditingId(alarme.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? 'Editar Alarme' : 'Agendar Alarme'}
      </Text>

      <DateTimePicker
        value={selectedDateTime}
        mode="datetime"
        display="default"
        onChange={(_, date) => date && setSelectedDateTime(date)}
        style={{ width: 320, backgroundColor: 'white' }}
      />

      <TouchableOpacity style={styles.redButton} onPress={definirAlarme}>
        <Text style={styles.buttonText}>
          {editingId ? 'Salvar Alterações' : 'Agendar Alarme'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Alarmes Agendados</Text>

      <FlatList
        data={alarmes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.alarmeItem}>
            <Text style={styles.alarmeText}>{item.horario}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editarAlarme(item)}>
                <Text style={styles.edit}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removerAlarme(item.id)}>
                <Text style={styles.remove}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center',
  },
  subtitle: {
    fontSize: 18, marginTop: 30, marginBottom: 10, fontWeight: 'bold',
  },
  redButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', fontSize: 16, fontWeight: 'bold',
  },
  alarmeItem: {
    backgroundColor: '#eee',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alarmeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  edit: {
    color: 'blue',
    fontWeight: 'bold',
  },
  remove: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default AlarmScreen;
