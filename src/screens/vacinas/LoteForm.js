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

  const salvar = async () => {
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
      Alert.alert('Erro', 'Verifique os campos e tente novamente');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>ID da Vacina</Text>
      <TextInput style={styles.input} value={vacina} onChangeText={setVacina} keyboardType="numeric" />

      <Text style={styles.label}>ID da Unidade de Saude</Text>
      <TextInput style={styles.input} value={unidadeSaude} onChangeText={setUnidadeSaude} keyboardType="numeric" />

      <Text style={styles.label}>Numero do Lote</Text>
      <TextInput style={styles.input} value={numeroLote} onChangeText={setNumeroLote} />

      <Text style={styles.label}>Data de Validade (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={dataValidade} onChangeText={setDataValidade} placeholder="2027-12-31" />

      <Text style={styles.label}>Quantidade Disponivel</Text>
      <TextInput style={styles.input} value={quantidadeDisponivel} onChangeText={setQuantidadeDisponivel} keyboardType="numeric" />

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
