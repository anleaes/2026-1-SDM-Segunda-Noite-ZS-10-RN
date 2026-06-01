import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { confirmar } from '../services/dialogo';
import { cores } from '../components/formStyles';
import { styles } from './Home.styles';

const GRUPOS = [
  {
    titulo: 'Cadastros',
    cor: cores.primaria,
    itens: [
      { titulo: 'Pacientes', rota: 'PacienteList' },
      { titulo: 'Profissionais', rota: 'ProfissionalList' },
      { titulo: 'Unidades de Saúde', rota: 'UnidadeList' },
      { titulo: 'Vacinas', rota: 'VacinaList' },
      { titulo: 'Lotes', rota: 'LoteList' },
    ],
  },
  {
    titulo: 'Atendimento',
    cor: cores.sucesso,
    itens: [
      { titulo: 'Perfis de Saúde', rota: 'PerfilList' },
      { titulo: 'Calendário Vacinal', rota: 'CalendarioList' },
      { titulo: 'Atendimentos', rota: 'AtendimentoList' },
      { titulo: 'Doses por Atendimento', rota: 'DoseList' },
      { titulo: 'Registros de Vacinação', rota: 'RegistroList' },
    ],
  },
  {
    titulo: 'Gestão',
    cor: cores.roxo,
    itens: [
      { titulo: 'Campanhas', rota: 'CampanhaList' },
      { titulo: 'Notificações', rota: 'NotificacaoList' },
      { titulo: 'Situação Vacinal', rota: 'SituacaoList' },
    ],
  },
];

export default function Home({ navigation }) {
  const { usuario, sair } = useAuth();

  const confirmarSair = async () => {
    const ok = await confirmar('Sair', 'Deseja encerrar a sessão?', 'Sair');
    if (ok) sair();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topo}>
        <View style={{ flex: 1 }}>
          <Text style={styles.ola}>Olá{usuario?.username ? `, ${usuario.username}` : ''}</Text>
          <Text style={styles.subtitulo}>Selecione um módulo</Text>
        </View>
        <TouchableOpacity style={styles.btnSair} onPress={confirmarSair}>
          <Text style={styles.btnSairTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      {GRUPOS.map((grupo) => (
        <View key={grupo.titulo} style={styles.grupo}>
          <Text style={[styles.grupoTitulo, { color: grupo.cor }]}>{grupo.titulo}</Text>
          {grupo.itens.map((item) => (
            <TouchableOpacity
              key={item.rota}
              style={[styles.botao, { backgroundColor: grupo.cor }]}
              onPress={() => navigation.navigate(item.rota)}
            >
              <Text style={styles.botaoTexto}>{item.titulo}</Text>
              <Text style={styles.seta}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
