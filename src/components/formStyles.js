import { StyleSheet } from 'react-native';

// Estilos compartilhados por todos os formulários, para manter um visual
// limpo e consistente entre as telas do aplicativo.
export const cores = {
  primaria: '#2E75B6',
  sucesso: '#1E8449',
  roxo: '#6C3483',
  erro: '#C0392B',
  texto: '#333',
  textoClaro: '#777',
  borda: '#ddd',
  fundo: '#f5f5f5',
  branco: '#fff',
};

export const formStyles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: cores.fundo },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 12, marginBottom: 4, color: cores.texto },
  input: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputErro: { borderColor: cores.erro },
  textoErro: { color: cores.erro, fontSize: 13, marginTop: 4 },
  ajuda: { color: cores.textoClaro, fontSize: 12, marginTop: 4 },
  btnSalvar: {
    backgroundColor: cores.sucesso,
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  btnTexto: { color: cores.branco, fontWeight: 'bold', fontSize: 16 },
});
