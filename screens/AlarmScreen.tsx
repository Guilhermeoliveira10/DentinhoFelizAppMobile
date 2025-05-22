import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Alarme {
  id: string;
  horario: string;
}

const AlarmScreen = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [alarmes, setAlarmes] = useState<Alarme[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

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
    setShowPicker(false);
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
    setShowPicker(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.innerWrapper}>
        <Text style={styles.title}>{editingId ? 'Editar Alarme' : 'Agendar Alarme'}</Text>

        <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.dateButtonText}>Selecionar Data e Hora</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.redButton} onPress={definirAlarme}>
          <Text style={styles.buttonText}>
            {editingId ? 'Salvar Alterações' : 'Agendar Alarme'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Alarmes Agendados</Text>

        {alarmes.length === 0 && (
          <Text style={styles.emptyText}>Nenhum alarme agendado.</Text>
        )}

        {alarmes.map((item) => (
          <View key={item.id} style={styles.alarmeItem}>
            <Text style={styles.alarmeText}>{item.horario}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editarAlarme(item)}>
                <Ionicons name="create-outline" size={20} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removerAlarme(item.id)}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {showPicker && (
          <Modal animationType="slide" transparent={true} visible={showPicker}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Escolha a data e hora</Text>
                <DateTimePicker
                  value={selectedDateTime}
                  mode="datetime"
                  display="default"
                  onChange={(_, date) => {
                    if (date) setSelectedDateTime(date);
                  }}
                  style={{ width: '100%' }}
                />
                <TouchableOpacity style={styles.modalClose} onPress={() => setShowPicker(false)}>
                  <Text style={styles.modalCloseText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#fefefe',
  },
  innerWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: '#e06666',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 10,
    width: '90%',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  alarmeItem: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  alarmeText: {
    fontSize: 16,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  emptyText: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#888',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalClose: {
    marginTop: 20,
    backgroundColor: '#e06666',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AlarmScreen;
