import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

export default function CampanhaList({ navigation }) {
  const [campanhas, setCampanhas] = useState([]);

  const carregar = async () => {
    try {
      const res = await api.get('/campanhas/campanhas/');
      setCampanhas(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar campanhas');
    }
  };

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir esta campanha?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir', onPress: async () => {
          try {
            await api.delete(`/campanhas/campanhas/${id}/`);
            carregar();
          } catch (err) {
            Alert.alert('Erro', 'Não foi possível excluir');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnNovo} onPress={() => navigation.navigate('CampanhaForm')}>
        <Text style={styles.btnTexto}>+ Nova Campanha</Text>
      </TouchableOpacity>
      <FlatList
        data={campanhas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Público: {item.publico_alvo}</Text>
            <Text>Início: {item.data_inicio} | Fim: {item.data_fim}</Text>
            <Text>Ativa: {item.ativa ? 'Sim' : 'Não'}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => navigation.navigate('CampanhaForm', { campanha: item })}>
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
  btnNovo: { backgroundColor: '#6C3483', padding: 14, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  btnTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 10, elevation: 2 },
  nome: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, gap: 16 },
  editar: { color: '#6C3483', fontWeight: 'bold' },
  excluir: { color: '#C0392B', fontWeight: 'bold' },
});