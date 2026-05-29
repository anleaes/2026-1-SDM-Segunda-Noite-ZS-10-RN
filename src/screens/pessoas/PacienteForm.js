import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../../services/api';

export default function PacienteForm({ route, navigation }) {
  const editando = route.params?.paciente;
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setEmail(editando.email);
      setTelefone(editando.telefone);
      setCpf(editando.cpf);
      setDataNascimento(editando.data_nascimento);
    }
  }, []);

  const validar = () => {
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Nome" é obrigatório.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Email" é obrigatório.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email inválido', 'Informe um email válido. Ex: nome@email.com');
      return false;
    }
    if (!telefone.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Telefone" é obrigatório.');
      return false;
    }
    if (!cpf.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "CPF" é obrigatório.');
      return false;
    }
    if (!dataNascimento.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Data de Nascimento" é obrigatório.');
      return false;
    }
    const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dataRegex.test(dataNascimento)) {
      Alert.alert('Data inválida', 'A data deve estar no formato AAAA-MM-DD. Ex: 2000-01-15');
      return false;
    }
    return true;
  };

  const salvar = async () => {
    if (!validar()) return;

    const dados = { nome, email, telefone, cpf, data_nascimento: dataNascimento, ativo: true };
    try {
      if (editando) {
        await api.put('/pessoas/pacientes/' + editando.id + '/', dados);
      } else {
        await api.post('/pessoas/pacientes/', dados);
      }
      navigation.goBack();
    } catch (err) {
      console.error('Erro na API: ', err.response?.data || err.message);
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
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" />

      <Text style={styles.label}>Email *</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="nome@email.com" />

      <Text style={styles.label}>Telefone *</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" />

      <Text style={styles.label}>CPF *</Text>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" />

      <Text style={styles.label}>Data Nascimento (AAAA-MM-DD) *</Text>
      <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} placeholder="2000-01-15" />

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
