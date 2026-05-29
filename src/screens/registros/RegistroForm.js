import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../../services/api';

export default function RegistroForm({ route, navigation }) {
  const editando = route.params?.registro;
  const [paciente, setPaciente] = useState('');
  const [vacina, setVacina] = useState('');
  const [lote, setLote] = useState('');
  const [profissional, setProfissional] = useState('');
  const [unidadeSaude, setUnidadeSaude] = useState('');
  const [atendimento, setAtendimento] = useState('');
  const [dataAplicacao, setDataAplicacao] = useState('');
  const [dose, setDose] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    if (editando) {
      setPaciente(String(editando.paciente));
      setVacina(String(editando.vacina));
      setLote(String(editando.lote));
      setProfissional(String(editando.profissional));
      setUnidadeSaude(String(editando.unidade_saude));
      setAtendimento(String(editando.atendimento));
      setDataAplicacao(editando.data_aplicacao);
      setDose(editando.dose);
      setObservacao(editando.observacao || '');
    }
  }, []);

  const salvar = async () => {
    const dados = {
      paciente: parseInt(paciente),
      vacina: parseInt(vacina),
      lote: parseInt(lote),
      profissional: parseInt(profissional),
      unidade_saude: parseInt(unidadeSaude),
      atendimento: parseInt(atendimento),
      data_aplicacao: dataAplicacao,
      dose: dose,
      observacao: observacao,
    };

    try {
      if (editando) {
        await api.put(`/registros/${editando.id}/`, dados);
      } else {
        await api.post('/registros/', dados);
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

      <Text style={styles.label}>ID da Vacina</Text>
      <TextInput style={styles.input} value={vacina} onChangeText={setVacina} keyboardType='numeric' />

      <Text style={styles.label}>ID do Lote</Text>
      <TextInput style={styles.input} value={lote} onChangeText={setLote} keyboardType='numeric' />

      <Text style={styles.label}>ID do Profissional</Text>
      <TextInput style={styles.input} value={profissional} onChangeText={setProfissional} keyboardType='numeric' />

      <Text style={styles.label}>ID da Unidade de Saúde</Text>
      <TextInput style={styles.input} value={unidadeSaude} onChangeText={setUnidadeSaude} keyboardType='numeric' />

      <Text style={styles.label}>ID do Atendimento</Text>
      <TextInput style={styles.input} value={atendimento} onChangeText={setAtendimento} keyboardType='numeric' />

      <Text style={styles.label}>Data da Aplicação (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={dataAplicacao} onChangeText={setDataAplicacao} placeholder='Ex: 2026-06-15' />

      <Text style={styles.label}>Dose (Ex: 1a Dose, Reforço)</Text>
      <TextInput style={styles.input} value={dose} onChangeText={setDose} />

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