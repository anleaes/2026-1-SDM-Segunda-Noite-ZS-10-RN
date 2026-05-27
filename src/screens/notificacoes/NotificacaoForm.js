import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';

import api from '../../services/api';

export default function NotificacaoForm({ route, navigation }) {

  const editando = route.params?.notificacao;

  const [paciente, setPaciente] = useState('');
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    if (editando) {
      setPaciente(String(editando.paciente));
      setTitulo(editando.titulo);
      setMensagem(editando.mensagem);
      setTipo(editando.tipo);
    }
  }, []);

  const salvar = async () => {

    if (!paciente || !titulo || !mensagem || !tipo) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    const dados = {
      paciente,
      titulo,
      mensagem,
      tipo
    };

    try {

      if (editando) {

        await api.put(
          `/notificacoes/notificacoes/${editando.id}/`,
          dados
        );

      } else {

        await api.post(
          '/notificacoes/notificacoes/',
          dados
        );

      }

      navigation.goBack();

    } catch (err) {

      Alert.alert(
        'Erro',
        'Não foi possível salvar a notificação'
      );

    }

  };

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.label}>Paciente ID</Text>

      <TextInput
        style={styles.input}
        value={paciente}
        onChangeText={setPaciente}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Título</Text>

      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Título da notificação"
      />

      <Text style={styles.label}>Mensagem</Text>

      <TextInput
        style={styles.input}
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Mensagem"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>
        Tipo (lembrete, alerta ou informativo)
      </Text>

      <TextInput
        style={styles.input}
        value={tipo}
        onChangeText={setTipo}
        placeholder="lembrete"
      />

      <TouchableOpacity
        style={styles.btnSalvar}
        onPress={salvar}
      >

        <Text style={styles.btnTexto}>
          {editando ? 'Atualizar' : 'Cadastrar'}
        </Text>

      </TouchableOpacity>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#333'
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },

  btnSalvar: {
    backgroundColor: '#6C3483',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center'
  },

  btnTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }

});