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

export default function SituacaoForm({ route, navigation }) {

  const editando = route.params?.situacao;

  const [paciente, setPaciente] = useState('');
  const [vacina, setVacina] = useState('');
  const [calendarioVacinal, setCalendarioVacinal] = useState('');
  const [status, setStatus] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {

    if (editando) {

      setPaciente(String(editando.paciente));
      setVacina(String(editando.vacina));
      setCalendarioVacinal(
        String(editando.calendario_vacinal)
      );

      setStatus(editando.status);

      setObservacao(editando.observacao);

    }

  }, []);

  const salvar = async () => {

    if (
      !paciente ||
      !vacina ||
      !calendarioVacinal ||
      !status
    ) {

      Alert.alert(
        'Atenção',
        'Preencha os campos obrigatórios'
      );

      return;

    }

    const dados = {
      paciente: parseInt(paciente),
      vacina: parseInt(vacina),
      calendario_vacinal: parseInt(calendarioVacinal),
      status,
      observacao
    };

    try {

      if (editando) {

        await api.put(
          `/situacao/${editando.id}/`,
          dados
        );

      } else {

        await api.post(
          '/situacao/',
          dados
        );

      }

      navigation.goBack();

    } catch (err) {

      Alert.alert(
        'Erro',
        'Não foi possível salvar'
      );

    }

  };

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.label}>
        Paciente ID
      </Text>

      <TextInput
        style={styles.input}
        value={paciente}
        onChangeText={setPaciente}
        keyboardType="numeric"
        placeholder="1"
      />

      <Text style={styles.label}>
        Vacina ID
      </Text>

      <TextInput
        style={styles.input}
        value={vacina}
        onChangeText={setVacina}
        keyboardType="numeric"
        placeholder="1"
      />

      <Text style={styles.label}>
        Calendário Vacinal ID
      </Text>

      <TextInput
        style={styles.input}
        value={calendarioVacinal}
        onChangeText={setCalendarioVacinal}
        keyboardType="numeric"
        placeholder="1"
      />

      <Text style={styles.label}>
        Status
      </Text>

      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="em_dia, pendente ou atrasado"
      />

      <Text style={styles.label}>
        Observação
      </Text>

      <TextInput
        style={styles.input}
        value={observacao}
        onChangeText={setObservacao}
        multiline
        numberOfLines={4}
        placeholder="Observações"
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