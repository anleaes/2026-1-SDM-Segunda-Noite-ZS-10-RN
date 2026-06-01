import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { confirmar, avisar } from '../../services/dialogo';
import useLista from '../../hooks/useLista';
import { styles } from './CampanhaList.styles';

export default function CampanhaList({ navigation }) {
  const { itens: campanhas, carregar } = useLista('/campanhas/', 'Não foi possível carregar campanhas');

  const deletar = async (id) => {
    const ok = await confirmar('Confirmar', 'Deseja excluir esta campanha?', 'Excluir');
    if (!ok) return;
    try {
      await api.delete(`/campanhas/${id}/`);
      carregar();
    } catch (err) {
      avisar('Erro', 'Não foi possível excluir');
    }
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
