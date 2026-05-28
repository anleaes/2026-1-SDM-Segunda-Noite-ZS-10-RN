import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

export default function AtendimentoList({ navigation }) {
  const [atendimentos, setAtendimentos] = useState([]);

  const carregar = async () => {
    try {
      const res = await api.get('/atendimentos/atendimentos/');
      setAtendimentos(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os atendimentos.');
    }
  };

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este atendimento?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => {
          await api.delete(`/atendimentos/atendimentos/${id}/`);
          carregar();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnNovo} onPress={() => navigation.navigate('AtendimentoForm')}>
        <Text style={styles.btnTexto}>+ Novo Atendimento</Text>
      </TouchableOpacity>
      <FlatList
        data={atendimentos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>Data: {item.data_atendimento}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Paciente ID: {item.paciente}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => navigation.navigate('AtendimentoForm', { atendimento: item })}>
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