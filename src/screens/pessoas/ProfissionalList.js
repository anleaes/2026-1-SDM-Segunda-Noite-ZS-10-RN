import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { confirmar, avisar } from '../../services/dialogo';
import useLista from '../../hooks/useLista';
import { styles } from './ProfissionalList.styles';

export default function ProfissionalList({ navigation }) {
  const { itens: profissionais, carregar } = useLista('/pessoas/profissionais/', 'Nao foi possivel carregar profissionais');

  const deletar = async (id) => {
    const ok = await confirmar('Confirmar', 'Deseja excluir este profissional?', 'Excluir');
    if (!ok) return;
    try {
      await api.delete('/pessoas/profissionais/' + id + '/');
      carregar();
    } catch (err) {
      avisar('Erro', 'Não foi possível excluir o profissional.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate('ProfissionalForm')}
      >
        <Text style={styles.btnTexto}>+ Novo Profissional</Text>
      </TouchableOpacity>
      <FlatList
        data={profissionais}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Cargo: {item.cargo}</Text>
            <Text>Registro: {item.registro_profissional}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() =>
                navigation.navigate('ProfissionalForm', { profissional: item })}
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
