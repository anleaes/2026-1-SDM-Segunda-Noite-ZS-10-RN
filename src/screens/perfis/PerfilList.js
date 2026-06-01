import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { confirmar, avisar } from '../../services/dialogo';
import useLista from '../../hooks/useLista';
import useMapaNomes from '../../hooks/useMapaNomes';
import { styles } from './PerfilList.styles';

export default function PerfilList({ navigation }) {
  const { itens: perfis, carregar } = useLista('/perfis/', 'Nao foi possivel carregar perfis');
  const nomePaciente = useMapaNomes('/pessoas/pacientes/', (p) => p.nome);

  const deletar = async (id) => {
    const ok = await confirmar('Confirmar', 'Deseja excluir este perfil?', 'Excluir');
    if (!ok) return;
    try {
      await api.delete('/perfis/' + id + '/');
      carregar();
    } catch (err) {
      avisar('Erro', 'Não foi possível excluir o perfil.');
    }
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
