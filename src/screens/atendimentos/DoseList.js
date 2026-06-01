import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { confirmar, avisar } from '../../services/dialogo';
import useLista from '../../hooks/useLista';
import useMapaNomes from '../../hooks/useMapaNomes';
import { styles } from './DoseList.styles';

export default function DoseList({ navigation }) {
  const { itens: doses, carregar } = useLista('/atendimentos/doses/', 'Não foi possível carregar as doses.');
  const nomeVacina = useMapaNomes('/vacinas/', (v) => v.nome);

  const deletar = async (id) => {
    const ok = await confirmar('Confirmar', 'Deseja excluir este registro de dose?', 'Excluir');
    if (!ok) return;
    try {
      await api.delete(`/atendimentos/doses/${id}/`);
      carregar();
    } catch (err) {
      avisar('Erro', 'Não foi possível excluir a dose.');
    }
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
