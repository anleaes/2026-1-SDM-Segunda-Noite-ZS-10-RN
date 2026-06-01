import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  btnNovo: { backgroundColor: '#6C3483', padding: 14, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  btnTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 10, elevation: 2 },
  titulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  badge: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeTexto: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  observacao: { marginTop: 8, color: '#555' },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 16 },
  editar: { color: '#6C3483', fontWeight: 'bold' },
  excluir: { color: '#C0392B', fontWeight: 'bold' },
});
