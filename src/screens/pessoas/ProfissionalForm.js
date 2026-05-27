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

  const salvar = async () => {
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

      <Text style={styles.label}>Registro Profissional</Text>
      <TextInput style={styles.input} value={registroProfissional} onChangeText={setRegistroProfissional} />

      <Text style={styles.label}>Cargo</Text>
      <TextInput style={styles.input} value={cargo} onChangeText={setCargo} />

      <Text style={styles.label}>ID da Unidade de Saude</Text>
      <TextInput style={styles.input} value={unidadeSaude} onChangeText={setUnidadeSaude} keyboardType="numeric" />

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
