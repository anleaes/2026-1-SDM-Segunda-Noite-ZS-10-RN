import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../../services/api';

export default function DoseForm({ route, navigation }) {
  const editando = route.params?.dose;
  const [atendimento, setAtendimento] = useState('');
  const [vacina, setVacina] = useState('');
  const [lote, setLote] = useState('');
  const [ordemDose, setOrdemDose] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    if (editando) {
      setAtendimento(String(editando.atendimento));
      setVacina(String(editando.vacina));
      setLote(String(editando.lote));
      setOrdemDose(editando.ordem_dose);
      setObservacao(editando.observacao || '');
    }
  }, []);

  const salvar = async () => {
    const dados = {
      atendimento: parseInt(atendimento),
      vacina: parseInt(vacina),
      lote: parseInt(lote),
      ordem_dose: ordemDose,
      observacao: observacao,
    };

    try {
      if (editando) {
        await api.put(`/atendimentos/doses/${editando.id}/`, dados);
      } else {
        await api.post('/atendimentos/doses/', dados);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Verifique os dados informados.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>ID do Atendimento</Text>
      <TextInput style={styles.input} value={atendimento} onChangeText={setAtendimento} keyboardType='numeric' />

      <Text style={styles.label}>ID da Vacina</Text>
      <TextInput style={styles.input} value={vacina} onChangeText={setVacina} keyboardType='numeric' />

      <Text style={styles.label}>ID do Lote</Text>
      <TextInput style={styles.input} value={lote} onChangeText={setLote} keyboardType='numeric' />

      <Text style={styles.label}>Ordem da Dose (Ex: 1a Dose, Reforço)</Text>
      <TextInput style={styles.input} value={ordemDose} onChangeText={setOrdemDose} />

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