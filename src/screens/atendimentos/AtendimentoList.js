import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { confirmar, avisar } from '../../services/dialogo';
import useLista from '../../hooks/useLista';
import useMapaNomes from '../../hooks/useMapaNomes';
import { styles } from './AtendimentoList.styles';

export default function AtendimentoList({ navigation }) {
  const { itens: atendimentos, carregar } = useLista('/atendimentos/', 'Não foi possível carregar os atendimentos.');
  const nomePaciente = useMapaNomes('/pessoas/pacientes/', (p) => p.nome);

  const deletar = async (id) => {
    const ok = await confirmar('Confirmar', 'Deseja excluir este atendimento?', 'Excluir');
    if (!ok) return;
    try {
      await api.delete(`/atendimentos/${id}/`);
      carregar();
    } catch (err) {
      avisar('Erro', 'Não foi possível excluir o atendimento.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnNovo} onPress={() => navigation.navigate('AtendimentoForm')}>
        <Text style={styles.btnTexto}>+ Novo Atendimento</Text>
      </TouchableOpacity>
      <FlatList
        data={atendimentos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>Data: {item.data_atendimento}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Paciente: {nomePaciente(item.paciente)}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => navigation.navigate('AtendimentoForm', { atendimento: item })}>
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
