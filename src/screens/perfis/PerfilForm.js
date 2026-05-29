import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import api from '../../services/api';

export default function PerfilForm({ route, navigation }) {
  const editando = route.params?.perfil;
  const [paciente, setPaciente] = useState('');
  const [grupoRisco, setGrupoRisco] = useState(false);
  const [gestante, setGestante] = useState(false);
  const [alergias, setAlergias] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (editando) {
      setPaciente(String(editando.paciente));
      setGrupoRisco(editando.grupo_risco);
      setGestante(editando.gestante);
      setAlergias(editando.alergias);
      setObservacoes(editando.observacoes);
    }
  }, []);

  const salvar = async () => {
    const dados = {
      paciente: parseInt(paciente),
      grupo_risco: grupoRisco,
      gestante: gestante,
      alergias,
      observacoes,
    };
    try {
      if (editando) {
        await api.put('/perfis/' + editando.id + '/', dados);
      } else {
        await api.post('/perfis/', dados);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Verifique os campos e tente novamente');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>ID do Paciente</Text>
      <TextInput style={styles.input} value={paciente} onChangeText={setPaciente} keyboardType="numeric" />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Grupo de Risco</Text>
        <Switch value={grupoRisco} onValueChange={setGrupoRisco} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Gestante</Text>
        <Switch value={gestante} onValueChange={setGestante} />
      </View>

      <Text style={styles.label}>Alergias</Text>
      <TextInput style={[styles.input, { height: 80 }]} value={alergias} onChangeText={setAlergias} multiline />

      <Text style={styles.label}>Observacoes</Text>
      <TextInput style={[styles.input, { height: 80 }]} value={observacoes} onChangeText={setObservacoes} multiline />

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
  btnSalvar: { backgroundColor: '#1E8449', padding: 14, borderRadius: 8, marginTop: 20, alignItems: 'center', marginBottom: 40 },
  btnTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
