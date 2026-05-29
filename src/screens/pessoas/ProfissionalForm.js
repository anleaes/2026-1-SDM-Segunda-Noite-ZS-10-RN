import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../../services/api';

export default function ProfissionalForm({ route, navigation }) {
  const editando = route.params?.profissional;
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [registroProfissional, setRegistroProfissional] = useState('');
  const [cargo, setCargo] = useState('');
  const [unidadeSaude, setUnidadeSaude] = useState('');

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setEmail(editando.email);
      setTelefone(editando.telefone);
      setRegistroProfissional(editando.registro_profissional);
      setCargo(editando.cargo);
      setUnidadeSaude(editando.unidade_saude ? String(editando.unidade_saude) : '');
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
    if (!registroProfissional.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Registro Profissional" é obrigatório.');
      return false;
    }
    if (!cargo.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Cargo" é obrigatório.');
      return false;
    }
    if (unidadeSaude.trim() && isNaN(parseInt(unidadeSaude))) {
      Alert.alert('Valor inválido', 'O campo "ID da Unidade de Saúde" deve ser um número inteiro.');
      return false;
    }
    return true;
  };

  const salvar = async () => {
    if (!validar()) return;

    const dados = {
      nome, email, telefone,
      registro_profissional: registroProfissional,
      cargo,
      unidade_saude: unidadeSaude ? parseInt(unidadeSaude) : null,
      ativo: true,
    };
    try {
      if (editando) {
        await api.put('/pessoas/profissionais/' + editando.id + '/', dados);
      } else {
        await api.post('/pessoas/profissionais/', dados);
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
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" />

      <Text style={styles.label}>Email *</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="nome@email.com" />

      <Text style={styles.label}>Telefone *</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" />

      <Text style={styles.label}>Registro Profissional *</Text>
      <TextInput style={styles.input} value={registroProfissional} onChangeText={setRegistroProfissional} placeholder="CRM/COREN" />

      <Text style={styles.label}>Cargo *</Text>
      <TextInput style={styles.input} value={cargo} onChangeText={setCargo} placeholder="Enfermeiro, Médico..." />

      <Text style={styles.label}>ID da Unidade de Saúde (número)</Text>
      <TextInput style={styles.input} value={unidadeSaude} onChangeText={setUnidadeSaude} keyboardType="numeric" placeholder="Ex: 1" />

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
