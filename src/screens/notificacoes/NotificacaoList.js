import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

const TIPO_LABEL = { lembrete: 'Lembrete', alerta: 'Alerta', informativo: 'Informativo' };
const TIPO_COR = { lembrete: '#2E75B6', alerta: '#C0392B', informativo: '#1E8449' };

export default function NotificacaoList({ navigation }) {
  const [notificacoes, setNotificacoes] = useState([]);

  const carregar = async () => {
    try {
      const res = await api.get('/notificacoes/notificacoes/');
      setNotificacoes(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar notificações');
    }
  };

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir esta notificação?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir', onPress: async () => {
          try {
            await api.delete(`/notificacoes/notificacoes/${id}/`);
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
      <TouchableOpacity style={styles.btnNovo} onPress={() => navigation.navigate('NotificacaoForm')}>
        <Text style={styles.btnTexto}>+ Nova Notificação</Text>
      </TouchableOpacity>
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <View style={[styles.badge, { backgroundColor: TIPO_COR[item.tipo] || '#888' }]}>
                <Text style={styles.badgeTexto}>{TIPO_LABEL[item.tipo] || item.tipo}</Text>
              </View>
            </View>
            <Text style={styles.mensagem}>{item.mensagem}</Text>
            <Text style={styles.paciente}>Paciente ID: {item.paciente}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => navigation.navigate('NotificacaoForm', { notificacao: item })}>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  titulo: { fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  mensagem: { color: '#555', marginBottom: 4 },
  paciente: { color: '#888', fontSize: 12 },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, gap: 16 },
  editar: { color: '#6C3483', fontWeight: 'bold' },
  excluir: { color: '#C0392B', fontWeight: 'bold' },
});