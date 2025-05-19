import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-datepicker/dist/react-datepicker.css';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'; // ⬅️ Importação adicionada
import TabsNavigator from './navigation/TabsNavigator';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined; // ⬅️ Adicionado
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
  >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Cadastro' }}
        />
        <Stack.Screen
          name="Main"
          component={TabsNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
