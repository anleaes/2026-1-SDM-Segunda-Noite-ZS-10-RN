import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import api from '../../services/api';

export default function CalendarioForm({ route, navigation }) {
  const editando = route.params?.calendario;
  const [vacina, setVacina] = useState('');
  const [idadeMinima, setIdadeMinima] = useState('');
  const [idadeMaxima, setIdadeMaxima] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [doseRecomendada, setDoseRecomendada] = useState('');
  const [obrigatoria, setObrigatoria] = useState(false);

  useEffect(() => {
    if (editando) {
      setVacina(String(editando.vacina));
      setIdadeMinima(String(editando.idade_minima_meses));
      setIdadeMaxima(editando.idade_maxima_meses ? String(editando.idade_maxima_meses) : '');
      setPublicoAlvo(editando.publico_alvo);
      setDoseRecomendada(editando.dose_recomendada);
      setObrigatoria(editando.obrigatoria);
    }
  }, []);

  const salvar = async () => {
    const dados = {
      vacina: parseInt(vacina),
      idade_minima_meses: parseInt(idadeMinima),
      idade_maxima_meses: idadeMaxima ? parseInt(idadeMaxima) : null,
      publico_alvo: publicoAlvo,
      dose_recomendada: doseRecomendada,
      obrigatoria: obrigatoria,
    };

    try {
      if (editando) {
        await api.put(`/calendario/calendarios/${editando.id}/`, dados);
      } else {
        await api.post('/calendario/calendarios/', dados);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Verifique os dados informados.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>ID da Vacina</Text>
      <TextInput style={styles.input} value={vacina} onChangeText={setVacina} keyboardType='numeric' placeholder='Ex: 1' />

      <Text style={styles.label}>Idade Mínima (Meses)</Text>
      <TextInput style={styles.input} value={idadeMinima} onChangeText={setIdadeMinima} keyboardType='numeric' />

      <Text style={styles.label}>Idade Máxima (Meses - Opcional)</Text>
      <TextInput style={styles.input} value={idadeMaxima} onChangeText={setIdadeMaxima} keyboardType='numeric' />

      <Text style={styles.label}>Público Alvo</Text>
      <TextInput style={styles.input} value={publicoAlvo} onChangeText={setPublicoAlvo} />

      <Text style={styles.label}>Dose Recomendada</Text>
      <TextInput style={styles.input} value={doseRecomendada} onChangeText={setDoseRecomendada} />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Vacina Obrigatória?</Text>
        <Switch value={obrigatoria} onValueChange={setObrigatoria} />
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
  btnSalvar: { backgroundColor: '#1E8449', padding: 14, borderRadius: 8, marginTop: 24, alignItems: 'center', marginBottom: 40 },
  btnTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
});