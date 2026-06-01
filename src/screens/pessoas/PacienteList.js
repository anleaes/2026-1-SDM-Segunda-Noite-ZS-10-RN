import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import useLista from '../../hooks/useLista';
import { styles } from './PacienteList.styles';

export default function PacienteList({ navigation }) {
  const { itens: pacientes, carregar } = useLista('/pessoas/pacientes/', 'Nao foi possivel carregar pacientes');

  const deletar = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este paciente?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => {
        try {
          await api.delete('/pessoas/pacientes/' + id + '/');
          carregar();
        } catch (err) {
          Alert.alert('Erro', 'Não foi possível excluir o paciente.');
        }
      }}
    ]);
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
