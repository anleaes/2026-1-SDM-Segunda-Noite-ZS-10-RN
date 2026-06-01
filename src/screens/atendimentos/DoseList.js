import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';
import useLista from '../../hooks/useLista';
import useMapaNomes from '../../hooks/useMapaNomes';

export default function DoseList({ navigation }) {
  const { itens: doses, carregar } = useLista('/atendimentos/doses/', 'Não foi possível carregar as doses.');
  const nomeVacina = useMapaNomes('/vacinas/', (v) => v.nome);

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este registro de dose?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => {
          try {
            await api.delete(`/atendimentos/doses/${id}/`);
            carregar();
          } catch (err) {
            Alert.alert('Erro', 'Não foi possível excluir a dose.');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnNovo} onPress={() => navigation.navigate('DoseForm')}>
        <Text style={styles.btnTexto}>+ Nova Dose</Text>
      </TouchableOpacity>
      <FlatList
        data={doses}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>Vacina: {nomeVacina(item.vacina)}</Text>
            <Text>Ordem da Dose: {item.ordem_dose}</Text>
            <Text>Atendimento: #{item.atendimento}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => navigation.navigate('DoseForm', { dose: item })}>
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
