import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { confirmar, avisar } from '../../services/dialogo';
import useLista from '../../hooks/useLista';
import { styles } from './UnidadeList.styles';

export default function UnidadeList({ navigation }) {
  const { itens: unidades, carregar } = useLista('/unidades/', 'Nao foi possivel carregar unidades');

  const deletar = async (id) => {
    const ok = await confirmar('Confirmar', 'Deseja excluir esta unidade?', 'Excluir');
    if (!ok) return;
    try {
      await api.delete('/unidades/' + id + '/');
      carregar();
    } catch (err) {
      avisar('Erro', 'Não foi possível excluir a unidade.');
    }
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
