import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { confirmar, avisar } from '../../services/dialogo';
import useLista from '../../hooks/useLista';
import useMapaNomes from '../../hooks/useMapaNomes';
import { styles } from './NotificacaoList.styles';

const TIPO_LABEL = { lembrete: 'Lembrete', alerta: 'Alerta', informativo: 'Informativo' };
const TIPO_COR = { lembrete: '#2E75B6', alerta: '#C0392B', informativo: '#1E8449' };

export default function NotificacaoList({ navigation }) {
  const { itens: notificacoes, carregar } = useLista('/notificacoes/', 'Não foi possível carregar notificações');
  const nomePaciente = useMapaNomes('/pessoas/pacientes/', (p) => p.nome);

  const deletar = async (id) => {
    const ok = await confirmar('Confirmar', 'Deseja excluir esta notificação?', 'Excluir');
    if (!ok) return;
    try {
      await api.delete(`/notificacoes/${id}/`);
      carregar();
    } catch (err) {
      avisar('Erro', 'Não foi possível excluir');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnNovo} onPress={() => navigation.navigate('NotificacaoForm')}>
        <Text style={styles.btnTexto}>+ Nova Notificação</Text>
      </TouchableOpacity>
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <View style={[styles.badge, { backgroundColor: TIPO_COR[item.tipo] || '#888' }]}>
                <Text style={styles.badgeTexto}>{TIPO_LABEL[item.tipo] || item.tipo}</Text>
              </View>
            </View>
            <Text style={styles.mensagem}>{item.mensagem}</Text>
            <Text style={styles.paciente}>Paciente: {nomePaciente(item.paciente)}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => navigation.navigate('NotificacaoForm', { notificacao: item })}>
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
