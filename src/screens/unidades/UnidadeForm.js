import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../../services/api';

export default function UnidadeForm({ route, navigation }) {
  const editando = route.params?.unidade;
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [horario, setHorario] = useState('');

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setEndereco(editando.endereco);
      setBairro(editando.bairro);
      setTelefone(editando.telefone);
      setHorario(editando.horario_funcionamento);
    }
  }, []);

  const validar = () => {
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Nome" é obrigatório.');
      return false;
    }
    if (!endereco.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Endereço" é obrigatório.');
      return false;
    }
    if (!bairro.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Bairro" é obrigatório.');
      return false;
    }
    if (!telefone.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Telefone" é obrigatório.');
      return false;
    }
    if (!horario.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Horário de Funcionamento" é obrigatório.');
      return false;
    }
    return true;
  };

  const salvar = async () => {
    if (!validar()) return;

    const dados = { nome, endereco, bairro, telefone, horario_funcionamento: horario, ativa: true };
    try {
      if (editando) {
        await api.put('/unidades/' + editando.id + '/', dados);
      } else {
        await api.post('/unidades/', dados);
      }
      navigation.goBack();
    } catch (err) {
      if (err.response?.data) {
        const erros = err.response.data;
        const mensagens = Object.entries(erros)
          .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n');
        Alert.alert('Erro ao salvar', mensagens);
      } else {
        Alert.alert('Erro', 'Não foi possível salvar. Verifique sua conexão.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome da unidade" />

      <Text style={styles.label}>Endereço *</Text>
      <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, número" />

      <Text style={styles.label}>Bairro *</Text>
      <TextInput style={styles.input} value={bairro} onChangeText={setBairro} placeholder="Nome do bairro" />

      <Text style={styles.label}>Telefone *</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(00) 0000-0000" />

      <Text style={styles.label}>Horário de Funcionamento *</Text>
      <TextInput style={styles.input} value={horario} onChangeText={setHorario} placeholder="08:00 - 17:00" />

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
  btnSalvar: { backgroundColor: '#1E8449', padding: 14, borderRadius: 8, marginTop: 20, alignItems: 'center', marginBottom: 40 },
  btnTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
