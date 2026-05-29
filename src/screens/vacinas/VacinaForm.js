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

  const validar = () => {
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Nome" é obrigatório.');
      return false;
    }
    if (!fabricante.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Fabricante" é obrigatório.');
      return false;
    }
    if (!doencaPrevenida.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Doença Prevenida" é obrigatório.');
      return false;
    }
    if (!quantidadeDoses.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Quantidade de Doses" é obrigatório.');
      return false;
    }
    if (isNaN(parseInt(quantidadeDoses)) || parseInt(quantidadeDoses) <= 0) {
      Alert.alert('Valor inválido', '"Quantidade de Doses" deve ser um número inteiro maior que zero.');
      return false;
    }
    if (intervaloDias.trim() && isNaN(parseInt(intervaloDias))) {
      Alert.alert('Valor inválido', '"Intervalo entre Doses" deve ser um número inteiro.');
      return false;
    }
    return true;
  };

  const salvar = async () => {
    if (!validar()) return;

    const dados = {
      nome, fabricante, doenca_prevenida: doencaPrevenida,
      quantidade_doses: parseInt(quantidadeDoses),
      intervalo_dias: parseInt(intervaloDias) || 0,
      ativa: true,
    };
    try {
      if (editando) {
        await api.put('/vacinas/' + editando.id + '/', dados);
      } else {
        await api.post('/vacinas/', dados);
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
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome da vacina" />

      <Text style={styles.label}>Fabricante *</Text>
      <TextInput style={styles.input} value={fabricante} onChangeText={setFabricante} placeholder="Nome do fabricante" />

      <Text style={styles.label}>Doença Prevenida *</Text>
      <TextInput style={styles.input} value={doencaPrevenida} onChangeText={setDoencaPrevenida} placeholder="Ex: Hepatite B" />

      <Text style={styles.label}>Quantidade de Doses * (número)</Text>
      <TextInput style={styles.input} value={quantidadeDoses} onChangeText={setQuantidadeDoses} keyboardType="numeric" placeholder="Ex: 3" />

      <Text style={styles.label}>Intervalo entre Doses em dias (número)</Text>
      <TextInput style={styles.input} value={intervaloDias} onChangeText={setIntervaloDias} keyboardType="numeric" placeholder="Ex: 30" />

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
