import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import useLista from '../../hooks/useLista';
import { styles } from './LoteList.styles';

export default function LoteList({ navigation }) {
  const { itens: lotes, carregar } = useLista('/vacinas/lotes/', 'Nao foi possivel carregar lotes');

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este lote?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => {
        try {
          await api.delete('/vacinas/lotes/' + id + '/');
          carregar();
        } catch (err) {
          Alert.alert('Erro', 'Não foi possível excluir o lote.');
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate('LoteForm')}
      >
        <Text style={styles.btnTexto}>+ Novo Lote</Text>
      </TouchableOpacity>
      <FlatList
        data={lotes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>Lote: {item.numero_lote}</Text>
            <Text>Validade: {item.data_validade}</Text>
            <Text>Disponivel: {item.quantidade_disponivel}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() =>
                navigation.navigate('LoteForm', { lote: item })}
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
