import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import useLista from '../../hooks/useLista';
import useMapaNomes from '../../hooks/useMapaNomes';
import { styles } from './CalendarioList.styles';

export default function CalendarioList({ navigation }) {
  const { itens: calendarios, carregar } = useLista('/calendario/', 'Não foi possível carregar os calendários');
  const nomeVacina = useMapaNomes('/vacinas/', (v) => v.nome);

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir esta regra do calendário?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => {
          try {
            await api.delete(`/calendario/${id}/`);
            carregar();
          } catch (err) {
            Alert.alert('Erro', 'Não foi possível excluir o calendário.');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnNovo} onPress={() => navigation.navigate('CalendarioForm')}>
        <Text style={styles.btnTexto}>+ Novo Calendário</Text>
      </TouchableOpacity>
      <FlatList
        data={calendarios}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>Vacina: {nomeVacina(item.vacina)}</Text>
            <Text>Público: {item.publico_alvo}</Text>
            <Text>Dose: {item.dose_recomendada}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => navigation.navigate('CalendarioForm', { calendario: item })}>
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
