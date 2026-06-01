import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { confirmar, avisar } from '../../services/dialogo';
import useLista from '../../hooks/useLista';
import useMapaNomes from '../../hooks/useMapaNomes';
import { styles } from './RegistroList.styles';

export default function RegistroList({ navigation }) {
  const { itens: registros, carregar } = useLista('/registros/', 'Não foi possível carregar os registros de vacinação.');
  const nomePaciente = useMapaNomes('/pessoas/pacientes/', (p) => p.nome);
  const nomeVacina = useMapaNomes('/vacinas/', (v) => v.nome);

  const deletar = async (id) => {
    const ok = await confirmar('Confirmar', 'Deseja excluir este registro de vacinação?', 'Excluir');
    if (!ok) return;
    try {
      await api.delete(`/registros/${id}/`);
      carregar();
    } catch (err) {
      avisar('Erro', 'Não foi possível excluir o registro.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnNovo} onPress={() => navigation.navigate('RegistroForm')}>
        <Text style={styles.btnTexto}>+ Novo Registro</Text>
      </TouchableOpacity>
      <FlatList
        data={registros}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>Data: {item.data_aplicacao}</Text>
            <Text>Paciente: {nomePaciente(item.paciente)}</Text>
            <Text>Vacina: {nomeVacina(item.vacina)}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => navigation.navigate('RegistroForm', { registro: item })}>
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
