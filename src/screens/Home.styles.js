import { StyleSheet } from 'react-native';
import { cores } from '../components/formStyles';

export const styles = StyleSheet.create({
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
