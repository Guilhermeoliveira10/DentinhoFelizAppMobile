# 📱 Dentinho Feliz

**Dentinho Feliz** é um aplicativo educacional voltado para crianças com até 14 anos, com o objetivo de promover a conscientização sobre higiene bucal de forma lúdica, interativa e divertida. Através de quizzes, conselhos personalizados e alarmes, o app incentiva bons hábitos de escovação e cuidado dental.

## 🧩 Funcionalidades

- ✅ Tela de cadastro e login com persistência de dados usando `AsyncStorage`
- ✅ Login com opção de "Lembrar senha"
- ✅ Tela inicial com navegação para:
  - Perfil
  - Quizzes
  - Dúvidas (API externa)
  - Alarme de escovação
- ✅ Tela de **Perfil** com:
  - Edição de nome
  - Visualização de email
  - Alteração de senha
  - Upload de imagem de perfil
- ✅ Tela de **Quiz** com perguntas carregadas de API externa
- ✅ Tela de **Dúvidas** com categorias e conselhos específicos
- ✅ Tela de **Alarme** com CRUD completo e persistência em `AsyncStorage`
- ✅ Tela **Registrar Dúvida (CRUD completo)** para gerenciar dúvidas (conectada à API no Render)

---

## 🛠️ Tecnologias Utilizadas

- **React Native + Expo**
- **TypeScript**
- **React Navigation**
- **AsyncStorage**
- **Axios**
- **Expo ImagePicker**
- **JSON Server (API hospedada no Render)**

---

## 🌐 Estrutura da API (CRUD)

A API foi criada usando `JSON Server` e está publicada no [Render](https://render.com). Ela simula um backend para armazenar e manipular as dúvidas que aparecem no app.
