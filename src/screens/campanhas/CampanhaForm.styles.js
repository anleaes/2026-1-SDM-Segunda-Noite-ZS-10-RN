import { StyleSheet } from 'react-native';
import { cores } from '../../components/formStyles';

export const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  vacinasContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  chip: {
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelecionado: { backgroundColor: cores.roxo, borderColor: cores.roxo },
  chipTexto: { color: cores.texto, fontSize: 14 },
  chipTextoSelecionado: { color: cores.branco, fontWeight: 'bold' },
});
