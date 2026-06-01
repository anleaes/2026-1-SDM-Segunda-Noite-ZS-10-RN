import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { cores } from '../components/formStyles';

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

  const confirmarSair = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  content: { padding: 16, paddingBottom: 40 },
  topo: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  ola: { fontSize: 20, fontWeight: 'bold', color: cores.texto },
  subtitulo: { fontSize: 14, color: cores.textoClaro, marginTop: 2 },
  btnSair: {
    borderWidth: 1,
    borderColor: cores.erro,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnSairTexto: { color: cores.erro, fontWeight: 'bold' },
  grupo: { marginBottom: 20 },
  grupoTitulo: { fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  botaoTexto: { color: cores.branco, fontWeight: 'bold', fontSize: 15 },
  seta: { color: cores.branco, fontSize: 22, fontWeight: 'bold' },
});
