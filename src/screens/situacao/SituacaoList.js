import React from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';

import api from '../../services/api';
import useLista from '../../hooks/useLista';
import useMapaNomes from '../../hooks/useMapaNomes';
import { styles } from './SituacaoList.styles';

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

  const { itens: situacoes, carregar } = useLista('/situacao/', 'Não foi possível carregar situações');
  const nomePaciente = useMapaNomes('/pessoas/pacientes/', (p) => p.nome);
  const nomeVacina = useMapaNomes('/vacinas/', (v) => v.nome);
  const nomeCalendario = useMapaNomes('/calendario/', (c) => `${c.dose_recomendada} - ${c.publico_alvo}`);

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

              await api.delete(`/situacao/${id}/`);

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
              Paciente: {nomePaciente(item.paciente)}
            </Text>

            <Text>
              Vacina: {nomeVacina(item.vacina)}
            </Text>

            <Text>
              Calendário: {nomeCalendario(item.calendario_vacinal)}
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

