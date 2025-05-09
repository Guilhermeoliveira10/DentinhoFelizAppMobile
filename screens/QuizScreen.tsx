import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import apiQuiz from '../services/apiQuiz';

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

const QuizScreen = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const { data } = await apiQuiz.get('/questions');
      console.log('Perguntas carregadas:', data);
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        Alert.alert('Erro', 'Formato de resposta inválido.');
      }
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
      Alert.alert('Erro', 'Erro ao carregar perguntas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    if (selectedAnswer === questions[currentIndex].correct_answer) {
      setScore(score + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      Alert.alert(
        'Fim do Quiz',
        `Você acertou ${score + (selectedAnswer === questions[currentIndex].correct_answer ? 1 : 0)} de ${questions.length} perguntas.`,
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="red" />
        <Text style={styles.loadingText}>Carregando perguntas...</Text>
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Nenhuma pergunta disponível.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <View style={styles.container}>
      <Image source={require('../assets/img_mascot.png')} style={styles.logo} />
      <Text style={styles.question}>{currentQuestion.question}</Text>

      <FlatList
        data={currentQuestion.options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.option, selectedAnswer === item && styles.optionSelected]}
            onPress={() => setSelectedAnswer(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[styles.submitButton, !selectedAnswer && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!selectedAnswer}
      >
        <Text style={styles.submitText}>Enviar Resposta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#f0f0f0' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10 },
  errorText: { fontSize: 16, color: 'gray' },
  logo: { width: 100, height: 100, marginBottom: 20, resizeMode: 'contain' },
  question: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  option: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  optionSelected: {
    backgroundColor: '#d1d1d1',
    borderColor: '#888',
  },
  optionText: { fontSize: 16 },
  submitButton: {
    backgroundColor: 'purple',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  submitText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  disabledButton: {
    backgroundColor: 'gray',
  },
});

export default QuizScreen;
