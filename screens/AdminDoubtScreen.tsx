import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://api-dentinho-feliz.onrender.com/advice';

interface Advice {
  id: number;
  category: string;
  advice: string;
}

const categories = [
  { label: 'Escovação', value: 'toothCare' },
  { label: 'Bons Hábitos', value: 'goodHabits' },
  { label: 'Fio Dental', value: 'dentalFloss' },
  { label: 'Dor de Dente', value: 'toothache' },
];

export default function AdminDoubtScreen() {
  const [adviceList, setAdviceList] = useState<Advice[]>([]);
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchAdvice();
  }, []);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setAdviceList(res.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as dúvidas.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!category || !text) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    const data = { category, advice: text };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
        Alert.alert('Dúvida atualizada!');
      } else {
        await axios.post(API_URL, data);
        Alert.alert('Dúvida cadastrada!');
      }
      resetForm();
      fetchAdvice();
    } catch {
      Alert.alert('Erro ao salvar a dúvida.');
    }
  };

  const resetForm = () => {
    setCategory('');
    setText('');
    setEditingId(null);
  };

  const handleEdit = (item: Advice) => {
    setCategory(item.category);
    setText(item.advice);
    setEditingId(item.id);
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirmar', 'Deseja remover esta dúvida?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${id}`);
            fetchAdvice();
          } catch {
            Alert.alert('Erro ao remover');
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Administração de Dúvidas</Text>

        <View style={styles.form}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {category
                ? categories.find((c) => c.value === category)?.label
                : 'Selecione a categoria'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Texto da dúvida/conselho"
            value={text}
            onChangeText={setText}
            multiline
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Dúvidas Cadastradas</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#e06666" />
        ) : (
          <FlatList
            data={adviceList}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>
                  <Text style={{ fontWeight: 'bold' }}>{item.category}:</Text> {item.advice}
                </Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Text style={styles.edit}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={styles.delete}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {/* Modal de seleção de categoria */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setCategory(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 20,
    fontWeight: 'bold',
    color: '#444',
  },
  form: {
    gap: 12,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f8f8f8',
  },
  saveButton: {
    backgroundColor: '#e06666',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemText: {
    flex: 1,
    color: '#333',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 10,
  },
  edit: {
    fontSize: 20,
  },
  delete: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 30,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalClose: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#e06666',
    borderRadius: 8,
    alignItems: 'center',
  },
});
