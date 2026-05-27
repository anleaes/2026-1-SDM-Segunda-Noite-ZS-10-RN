import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../../services/api';

export default function VacinaForm({ route, navigation }) {
  const editando = route.params?.vacina;
  const [nome, setNome] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [doencaPrevenida, setDoencaPrevenida] = useState('');
  const [quantidadeDoses, setQuantidadeDoses] = useState('');
  const [intervaloDias, setIntervaloDias] = useState('');

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setFabricante(editando.fabricante);
      setDoencaPrevenida(editando.doenca_prevenida);
      setQuantidadeDoses(String(editando.quantidade_doses));
      setIntervaloDias(String(editando.intervalo_dias));
    }
  }, []);

  const salvar = async () => {
    const dados = {
      nome, fabricante, doenca_prevenida: doencaPrevenida,
      quantidade_doses: parseInt(quantidadeDoses),
      intervalo_dias: parseInt(intervaloDias) || 0,
      ativa: true,
    };
    try {
      if (editando) {
        await api.put('/vacinas/vacinas/' + editando.id + '/', dados);
      } else {
        await api.post('/vacinas/vacinas/', dados);
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

      <Text style={styles.label}>Fabricante</Text>
      <TextInput style={styles.input} value={fabricante} onChangeText={setFabricante} />

      <Text style={styles.label}>Doenca Prevenida</Text>
      <TextInput style={styles.input} value={doencaPrevenida} onChangeText={setDoencaPrevenida} />

      <Text style={styles.label}>Quantidade de Doses</Text>
      <TextInput style={styles.input} value={quantidadeDoses} onChangeText={setQuantidadeDoses} keyboardType="numeric" />

      <Text style={styles.label}>Intervalo entre Doses (dias)</Text>
      <TextInput style={styles.input} value={intervaloDias} onChangeText={setIntervaloDias} keyboardType="numeric" />

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
