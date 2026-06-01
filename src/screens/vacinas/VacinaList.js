import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import useLista from '../../hooks/useLista';
import { styles } from './VacinaList.styles';

export default function VacinaList({ navigation }) {
  const { itens: vacinas, carregar } = useLista('/vacinas/', 'Nao foi possivel carregar vacinas');

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir esta vacina?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => {
        try {
          await api.delete('/vacinas/' + id + '/');
          carregar();
        } catch (err) {
          Alert.alert('Erro', 'Não foi possível excluir a vacina.');
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate('VacinaForm')}
      >
        <Text style={styles.btnTexto}>+ Nova Vacina</Text>
      </TouchableOpacity>
      <FlatList
        data={vacinas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Fabricante: {item.fabricante}</Text>
            <Text>Doenca: {item.doenca_prevenida}</Text>
            <Text>Doses: {item.quantidade_doses}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() =>
                navigation.navigate('VacinaForm', { vacina: item })}
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
