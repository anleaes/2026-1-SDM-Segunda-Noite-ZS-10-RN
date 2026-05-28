import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../../services/api';

export default function AtendimentoForm({ route, navigation }) {
  const editando = route.params?.atendimento;
  const [paciente, setPaciente] = useState('');
  const [unidadeSaude, setUnidadeSaude] = useState('');
  const [profissional, setProfissional] = useState('');
  const [dataAtendimento, setDataAtendimento] = useState('');
  const [status, setStatus] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    if (editando) {
      setPaciente(String(editando.paciente));
      setUnidadeSaude(String(editando.unidade_saude));
      setProfissional(String(editando.profissional));
      setDataAtendimento(editando.data_atendimento);
      setStatus(editando.status);
      setObservacao(editando.observacao || '');
    }
  }, []);

  const salvar = async () => {
    const dados = {
      paciente: parseInt(paciente),
      unidade_saude: parseInt(unidadeSaude),
      profissional: parseInt(profissional),
      data_atendimento: dataAtendimento,
      status: status,
      observacao: observacao,
    };

    try {
      if (editando) {
        await api.put(`/atendimentos/atendimentos/${editando.id}/`, dados);
      } else {
        await api.post('/atendimentos/atendimentos/', dados);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Verifique os dados informados.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>ID do Paciente</Text>
      <TextInput style={styles.input} value={paciente} onChangeText={setPaciente} keyboardType='numeric' />

      <Text style={styles.label}>ID da Unidade de Saúde</Text>
      <TextInput style={styles.input} value={unidadeSaude} onChangeText={setUnidadeSaude} keyboardType='numeric' />

      <Text style={styles.label}>ID do Profissional</Text>
      <TextInput style={styles.input} value={profissional} onChangeText={setProfissional} keyboardType='numeric' />

      <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={dataAtendimento} onChangeText={setDataAtendimento} placeholder='Ex: 2026-06-15' />

      <Text style={styles.label}>Status (agendado/realizado/cancelado)</Text>
      <TextInput style={styles.input} value={status} onChangeText={setStatus} placeholder='agendado' />

      <Text style={styles.label}>Observação</Text>
      <TextInput style={styles.input} value={observacao} onChangeText={setObservacao} multiline />

      <TouchableOpacity style={styles.btnSalvar} onPress={salvar}>
        <Text style={styles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 12, marginBottom: 4, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  btnSalvar: { backgroundColor: '#1E8449', padding: 14, borderRadius: 8, marginTop: 24, alignItems: 'center', marginBottom: 40 },
  btnTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});