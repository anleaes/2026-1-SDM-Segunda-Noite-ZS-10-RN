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

  const salvar = async () => {
    const dados = { nome, email, telefone, cpf, data_nascimento: dataNascimento, ativo: true };
    try {
      if (editando) {
        await api.put('/pessoas/pacientes/' + editando.id + '/', dados);
      } else {
        await api.post('/pessoas/pacientes/', dados);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Verifique os campos e tente novamente');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} />

      <Text style={styles.label}>CPF</Text>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} />

      <Text style={styles.label}>Data Nascimento (AAAA-MM-DD)</Text>
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
