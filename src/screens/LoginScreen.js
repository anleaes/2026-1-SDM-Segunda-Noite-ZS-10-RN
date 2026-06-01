import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { cores } from '../components/formStyles';
import { styles } from './LoginScreen.styles';

export default function LoginScreen() {
  const { entrar } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const fazerLogin = async () => {
    if (!username.trim() || !password) {
      setErro('Informe usuário e senha.');
      return;
    }
    setErro('');
    setEnviando(true);
    try {
      await entrar(username.trim(), password);
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        setErro('Usuário ou senha inválidos.');
      } else {
        setErro('Não foi possível conectar ao servidor.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.box}>
        <Text style={styles.titulo}>Sistema de Vacinas</Text>
        <Text style={styles.subtitulo}>Faça login para acessar</Text>

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Digite seu usuário"
          placeholderTextColor={cores.textoClaro}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!enviando}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha"
          placeholderTextColor={cores.textoClaro}
          secureTextEntry
          editable={!enviando}
          onSubmitEditing={fazerLogin}
        />

        <TouchableOpacity
          style={[styles.botao, enviando && styles.botaoDesabilitado]}
          onPress={fazerLogin}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color={cores.branco} />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.rodape}>Sistemas Distribuídos e Mobile — 2026/1</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
