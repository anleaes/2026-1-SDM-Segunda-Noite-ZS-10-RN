import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import api from '../../services/api';

export default function CampanhaForm({ route, navigation }) {
  const editando = route.params?.campanha;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [ativa, setAtiva] = useState(true);

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setDescricao(editando.descricao);
      setDataInicio(editando.data_inicio);
      setDataFim(editando.data_fim);
      setPublicoAlvo(editando.publico_alvo);
      setAtiva(editando.ativa);
    }
  }, []);

  const salvar = async () => {
    if (!nome || !dataInicio || !dataFim) {
      Alert.alert('Atenção', 'Preencha nome, data de início e data de fim');
      return;
    }
    const dados = { nome, descricao, data_inicio: dataInicio, data_fim: dataFim, publico_alvo: publicoAlvo, ativa };
    try {
      if (editando) {
        await api.put(`/campanhas/${editando.id}/`, dados);
      } else {
        await api.post('/campanhas/', dados);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Verifique os campos e tente novamente');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome da campanha" />
      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} multiline numberOfLines={3} placeholder="Descrição" />
      <Text style={styles.label}>Data Início (AAAA-MM-DD) *</Text>
      <TextInput style={styles.input} value={dataInicio} onChangeText={setDataInicio} placeholder="2026-01-01" />
      <Text style={styles.label}>Data Fim (AAAA-MM-DD) *</Text>
      <TextInput style={styles.input} value={dataFim} onChangeText={setDataFim} placeholder="2026-12-31" />
      <Text style={styles.label}>Público Alvo</Text>
      <TextInput style={styles.input} value={publicoAlvo} onChangeText={setPublicoAlvo} placeholder="Ex: Crianças de 0 a 5 anos" />
      <View style={styles.switchRow}>
        <Text style={styles.label}>Ativa</Text>
        <Switch value={ativa} onValueChange={setAtiva} trackColor={{ true: '#6C3483' }} />
      </View>
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
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  btnSalvar: { backgroundColor: '#6C3483', padding: 14, borderRadius: 8, marginTop: 20, marginBottom: 40, alignItems: 'center' },
  btnTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});