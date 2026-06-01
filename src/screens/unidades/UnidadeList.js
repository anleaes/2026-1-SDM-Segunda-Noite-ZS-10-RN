import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import useLista from '../../hooks/useLista';
import { styles } from './UnidadeList.styles';

export default function UnidadeList({ navigation }) {
  const { itens: unidades, carregar } = useLista('/unidades/', 'Nao foi possivel carregar unidades');

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir esta unidade?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => {
        try {
          await api.delete('/unidades/' + id + '/');
          carregar();
        } catch (err) {
          Alert.alert('Erro', 'Não foi possível excluir a unidade.');
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate('UnidadeForm')}
      >
        <Text style={styles.btnTexto}>+ Nova Unidade</Text>
      </TouchableOpacity>
      <FlatList
        data={unidades}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Bairro: {item.bairro}</Text>
            <Text>Telefone: {item.telefone}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() =>
                navigation.navigate('UnidadeForm', { unidade: item })}
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
