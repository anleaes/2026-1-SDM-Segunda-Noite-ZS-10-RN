import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';
import useLista from '../../hooks/useLista';
import useMapaNomes from '../../hooks/useMapaNomes';

export default function PerfilList({ navigation }) {
  const { itens: perfis, carregar } = useLista('/perfis/', 'Nao foi possivel carregar perfis');
  const nomePaciente = useMapaNomes('/pessoas/pacientes/', (p) => p.nome);

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este perfil?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => {
          try {
            await api.delete('/perfis/' + id + '/');
            carregar();
          } catch (err) {
            Alert.alert('Erro', 'Não foi possível excluir o perfil.');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate('PerfilForm')}
      >
        <Text style={styles.btnTexto}>+ Novo Perfil</Text>
      </TouchableOpacity>
      <FlatList
        data={perfis}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>Paciente: {nomePaciente(item.paciente)}</Text>
            <Text>Grupo Risco: {item.grupo_risco ? 'Sim' : 'Nao'}</Text>
            <Text>Gestante: {item.gestante ? 'Sim' : 'Nao'}</Text>
            <Text>Alergias: {item.alergias || 'Nenhuma'}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() =>
                navigation.navigate('PerfilForm', { perfil: item })}
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
