import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { confirmar, avisar } from '../../services/dialogo';
import useLista from '../../hooks/useLista';
import { styles } from './PacienteList.styles';

export default function PacienteList({ navigation }) {
  const { itens: pacientes, carregar } = useLista('/pessoas/pacientes/', 'Nao foi possivel carregar pacientes');

  const deletar = async (id) => {
    const ok = await confirmar('Confirmar', 'Deseja excluir este paciente?', 'Excluir');
    if (!ok) return;
    try {
      await api.delete('/pessoas/pacientes/' + id + '/');
      carregar();
    } catch (err) {
      avisar('Erro', 'Não foi possível excluir o paciente.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate('PacienteForm')}
      >
        <Text style={styles.btnTexto}>+ Novo Paciente</Text>
      </TouchableOpacity>
      <FlatList
        data={pacientes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>CPF: {item.cpf}</Text>
            <Text>Email: {item.email}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() =>
                navigation.navigate('PacienteForm', { paciente: item })}
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
