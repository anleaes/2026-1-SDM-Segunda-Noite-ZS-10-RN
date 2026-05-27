import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

export default function PacienteList({ navigation }) {
  const [pacientes, setPacientes] = useState([]);

  const carregar = async () => {
    try {
      const res = await api.get('/pessoas/pacientes/');
      setPacientes(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Nao foi possivel carregar pacientes');
    }
  };

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este paciente?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => {
        await api.delete('/pessoas/pacientes/' + id + '/');
        carregar();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate('PacienteForm')}
      >
        <Text style={styles.btnTexto}>+ Novo Paciente</Text>
      </TouchableOpacity>
      <FlatList
        data={pacientes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>CPF: {item.cpf}</Text>
            <Text>Email: {item.email}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() =>
                navigation.navigate('PacienteForm', { paciente: item })}
              >
                <Text style={styles.editar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deletar(item.id)}>
                <Text style={styles.excluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  btnNovo: { backgroundColor: '#2E75B6', padding: 14, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  btnTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 10, elevation: 2 },
  nome: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, gap: 16 },
  editar: { color: '#2E75B6', fontWeight: 'bold' },
  excluir: { color: '#C0392B', fontWeight: 'bold' },
});
