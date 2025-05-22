import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import HelpScreen from '../screens/HelpScreen';
import AlarmScreen from '../screens/AlarmScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: route.name === 'Home'
          ? { display: 'none' }
          : {
              backgroundColor: '#fff',
              borderTopColor: '#ddd',
              paddingBottom: 5,
              height: 60,
            },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: '#e06666',
        tabBarInactiveTintColor: '#999',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Quiz':
              iconName = 'help-circle-outline';
              break;
            case 'Help':
              iconName = 'chatbox-ellipses-outline';
              break;
            case 'Alarm':
              iconName = 'alarm-outline';
              break;
            case 'Profile':
              iconName = 'person-circle-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quizzes' }} />
      <Tab.Screen name="Help" component={HelpScreen} options={{ title: 'Dúvidas' }} />
      <Tab.Screen name="Alarm" component={AlarmScreen} options={{ title: 'Alarme' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}