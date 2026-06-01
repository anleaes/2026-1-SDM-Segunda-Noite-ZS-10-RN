import { StyleSheet } from 'react-native';
import { cores } from '../components/formStyles';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.primaria, justifyContent: 'center', padding: 24 },
  box: { backgroundColor: cores.branco, borderRadius: 16, padding: 24, elevation: 4 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: cores.texto, textAlign: 'center', marginTop: 8 },
  subtitulo: { fontSize: 14, color: cores.textoClaro, textAlign: 'center', marginBottom: 20 },
  erro: {
    backgroundColor: '#FDEDEC',
    color: cores.erro,
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 12,
  },
  label: { fontSize: 14, fontWeight: 'bold', color: cores.texto, marginTop: 12, marginBottom: 4 },
  input: {
    backgroundColor: cores.fundo,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  botao: {
    backgroundColor: cores.sucesso,
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  botaoDesabilitado: { opacity: 0.7 },
  botaoTexto: { color: cores.branco, fontWeight: 'bold', fontSize: 16 },
  rodape: { textAlign: 'center', color: cores.textoClaro, fontSize: 12, marginTop: 20 },
});
