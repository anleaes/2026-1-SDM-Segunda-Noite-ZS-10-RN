import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';
import useLista from '../../hooks/useLista';

export default function ProfissionalList({ navigation }) {
  const { itens: profissionais, carregar } = useLista('/pessoas/profissionais/', 'Nao foi possivel carregar profissionais');

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este profissional?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => {
        try {
          await api.delete('/pessoas/profissionais/' + id + '/');
          carregar();
        } catch (err) {
          Alert.alert('Erro', 'Não foi possível excluir o profissional.');
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate('ProfissionalForm')}
      >
        <Text style={styles.btnTexto}>+ Novo Profissional</Text>
      </TouchableOpacity>
      <FlatList
        data={profissionais}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Cargo: {item.cargo}</Text>
            <Text>Registro: {item.registro_profissional}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() =>
                navigation.navigate('ProfissionalForm', { profissional: item })}
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
