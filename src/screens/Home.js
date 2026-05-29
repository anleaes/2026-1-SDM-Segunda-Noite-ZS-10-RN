import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const MENU = [
  { titulo: 'Pacientes', rota: 'PacienteList', cor: '#2E75B6' },
  { titulo: 'Profissionais', rota: 'ProfissionalList', cor: '#2E75B6' },
  { titulo: 'Unidades de Saúde', rota: 'UnidadeList', cor: '#2E75B6' },
  { titulo: 'Vacinas', rota: 'VacinaList', cor: '#2E75B6' },
  { titulo: 'Lotes', rota: 'LoteList', cor: '#2E75B6' },
  { titulo: 'Perfis de Saúde', rota: 'PerfilList', cor: '#1E8449' },
  { titulo: 'Calendário Vacinal', rota: 'CalendarioList', cor: '#1E8449' },
  { titulo: 'Atendimentos', rota: 'AtendimentoList', cor: '#1E8449' },
  { titulo: 'Doses por Atendimento', rota: 'DoseList', cor: '#1E8449' },
  { titulo: 'Registros de Vacinação', rota: 'RegistroList', cor: '#1E8449' },
  { titulo: 'Campanhas', rota: 'CampanhaList', cor: '#6C3483' },
  { titulo: 'Notificações', rota: 'NotificacaoList', cor: '#6C3483' },
  { titulo: 'Situação Vacinal', rota: 'SituacaoList', cor: '#6C3483' },
];

export default function Home({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitulo}>Selecione um módulo</Text>
      {MENU.map((item) => (
        <TouchableOpacity
          key={item.rota}
          style={[styles.botao, { backgroundColor: item.cor }]}
          onPress={() => navigation.navigate(item.rota)}
        >
          <Text style={styles.botaoTexto}>{item.titulo}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 40 },
  subtitulo: { fontSize: 16, color: '#555', marginBottom: 16, textAlign: 'center' },
  botao: { padding: 18, borderRadius: 8, marginBottom: 12, alignItems: 'center', elevation: 2 },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
