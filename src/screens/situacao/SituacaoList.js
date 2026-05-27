import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import api from '../../services/api';

const STATUS_LABEL = {
  em_dia: 'Em dia',
  pendente: 'Pendente',
  atrasado: 'Atrasado'
};

const STATUS_COR = {
  em_dia: '#1E8449',
  pendente: '#F39C12',
  atrasado: '#C0392B'
};

export default function SituacaoList({ navigation }) {

  const [situacoes, setSituacoes] = useState([]);

  const carregar = async () => {

    try {

      const res = await api.get('/situacao/situacao/');

      setSituacoes(res.data);

    } catch (err) {

      Alert.alert(
        'Erro',
        'Não foi possível carregar situações'
      );

    }

  };

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  const deletar = async (id) => {

    Alert.alert(
      'Confirmar',
      'Deseja excluir esta situação?',
      [
        { text: 'Cancelar' },

        {
          text: 'Excluir',

          onPress: async () => {

            try {

              await api.delete(`/situacao/situacao/${id}/`);

              carregar();

            } catch (err) {

              Alert.alert(
                'Erro',
                'Não foi possível excluir'
              );

            }

          }

        }

      ]
    );

  };

  return (

    <View style={styles.container}>

      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate('SituacaoForm')}
      >

        <Text style={styles.btnTexto}>
          + Nova Situação
        </Text>

      </TouchableOpacity>

      <FlatList
        data={situacoes}
        keyExtractor={(item) => String(item.id)}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.titulo}>
              Paciente ID: {item.paciente}
            </Text>

            <Text>
              Vacina ID: {item.vacina}
            </Text>

            <Text>
              Calendário ID: {item.calendario_vacinal}
            </Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    STATUS_COR[item.status] || '#888'
                }
              ]}
            >

              <Text style={styles.badgeTexto}>
                {STATUS_LABEL[item.status] || item.status}
              </Text>

            </View>

            <Text style={styles.observacao}>
              {item.observacao}
            </Text>

            <View style={styles.acoes}>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    'SituacaoForm',
                    { situacao: item }
                  )
                }
              >

                <Text style={styles.editar}>
                  Editar
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deletar(item.id)}
              >

                <Text style={styles.excluir}>
                  Excluir
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        )}

      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },

  btnNovo: {
    backgroundColor: '#6C3483',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center'
  },

  btnTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2
  },

  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },

  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },

  badgeTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },

  observacao: {
    marginTop: 8,
    color: '#555'
  },

  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 16
  },

  editar: {
    color: '#6C3483',
    fontWeight: 'bold'
  },

  excluir: {
    color: '#C0392B',
    fontWeight: 'bold'
  }

});