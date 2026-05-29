import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../../services/api';

export default function LoteForm({ route, navigation }) {
  const editando = route.params?.lote;
  const [vacina, setVacina] = useState('');
  const [unidadeSaude, setUnidadeSaude] = useState('');
  const [numeroLote, setNumeroLote] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState('');

  useEffect(() => {
    if (editando) {
      setVacina(String(editando.vacina));
      setUnidadeSaude(String(editando.unidade_saude));
      setNumeroLote(editando.numero_lote);
      setDataValidade(editando.data_validade);
      setQuantidadeDisponivel(String(editando.quantidade_disponivel));
    }
  }, []);

  const validar = () => {
    if (!vacina.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "ID da Vacina" é obrigatório.');
      return false;
    }
    if (isNaN(parseInt(vacina))) {
      Alert.alert('Valor inválido', '"ID da Vacina" deve ser um número inteiro. Ex: 1');
      return false;
    }
    if (!unidadeSaude.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "ID da Unidade de Saúde" é obrigatório.');
      return false;
    }
    if (isNaN(parseInt(unidadeSaude))) {
      Alert.alert('Valor inválido', '"ID da Unidade de Saúde" deve ser um número inteiro. Ex: 1');
      return false;
    }
    if (!numeroLote.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Número do Lote" é obrigatório.');
      return false;
    }
    if (!dataValidade.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Data de Validade" é obrigatório.');
      return false;
    }
    const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dataRegex.test(dataValidade)) {
      Alert.alert('Data inválida', 'A data deve estar no formato AAAA-MM-DD. Ex: 2027-12-31');
      return false;
    }
    if (!quantidadeDisponivel.trim()) {
      Alert.alert('Campo obrigatório', 'O campo "Quantidade Disponível" é obrigatório.');
      return false;
    }
    if (isNaN(parseInt(quantidadeDisponivel)) || parseInt(quantidadeDisponivel) < 0) {
      Alert.alert('Valor inválido', '"Quantidade Disponível" deve ser um número inteiro positivo.');
      return false;
    }
    return true;
  };

  const salvar = async () => {
    if (!validar()) return;

    const dados = {
      vacina: parseInt(vacina),
      unidade_saude: parseInt(unidadeSaude),
      numero_lote: numeroLote,
      data_validade: dataValidade,
      quantidade_disponivel: parseInt(quantidadeDisponivel),
    };
    try {
      if (editando) {
        await api.put('/vacinas/lotes/' + editando.id + '/', dados);
      } else {
        await api.post('/vacinas/lotes/', dados);
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
      <Text style={styles.label}>ID da Vacina * (número)</Text>
      <TextInput style={styles.input} value={vacina} onChangeText={setVacina} keyboardType="numeric" placeholder="Ex: 1" />

      <Text style={styles.label}>ID da Unidade de Saúde * (número)</Text>
      <TextInput style={styles.input} value={unidadeSaude} onChangeText={setUnidadeSaude} keyboardType="numeric" placeholder="Ex: 1" />

      <Text style={styles.label}>Número do Lote *</Text>
      <TextInput style={styles.input} value={numeroLote} onChangeText={setNumeroLote} placeholder="Ex: LOTE-2026-001" />

      <Text style={styles.label}>Data de Validade (AAAA-MM-DD) *</Text>
      <TextInput style={styles.input} value={dataValidade} onChangeText={setDataValidade} placeholder="2027-12-31" />

      <Text style={styles.label}>Quantidade Disponível * (número)</Text>
      <TextInput style={styles.input} value={quantidadeDisponivel} onChangeText={setQuantidadeDisponivel} keyboardType="numeric" placeholder="Ex: 100" />

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
