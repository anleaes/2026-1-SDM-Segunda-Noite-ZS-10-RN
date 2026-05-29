import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { formStyles, cores } from './formStyles';

// Seletor (dropdown) reutilizável.
//
// Em vez de pedir um "ID" numérico ao usuário, mostramos uma lista dos
// registros já cadastrados. Quando não há nenhum registro, exibimos uma
// mensagem clara orientando o usuário a cadastrar primeiro.
//
// Props:
//  - label: título do campo
//  - valor: id selecionado (number) ou null
//  - aoSelecionar: (id) => void
//  - itens: [{ valor, rotulo }]
//  - placeholder: texto quando nada está selecionado
//  - erro: mensagem de validação a exibir
//  - carregando: bool, enquanto a lista é buscada na API
//  - mensagemVazio: texto exibido quando não há itens cadastrados
export default function Seletor({
  label,
  valor,
  aoSelecionar,
  itens = [],
  placeholder = 'Selecione...',
  erro,
  carregando = false,
  mensagemVazio = 'Nenhum registro cadastrado.',
}) {
  const [aberto, setAberto] = useState(false);

  const itemSelecionado = itens.find((i) => String(i.valor) === String(valor));
  const vazio = !carregando && itens.length === 0;

  return (
    <View>
      {label ? <Text style={formStyles.label}>{label}</Text> : null}

      {carregando ? (
        <View style={[formStyles.input, styles.desabilitado]}>
          <Text style={styles.textoClaro}>Carregando...</Text>
        </View>
      ) : vazio ? (
        <View style={[formStyles.input, styles.caixaVazio]}>
          <Text style={styles.textoVazio}>{mensagemVazio}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[formStyles.input, styles.campo, erro ? formStyles.inputErro : null]}
          onPress={() => setAberto(true)}
        >
          <Text style={itemSelecionado ? styles.textoSelecionado : styles.textoClaro}>
            {itemSelecionado ? itemSelecionado.rotulo : placeholder}
          </Text>
          <Text style={styles.seta}>▾</Text>
        </TouchableOpacity>
      )}

      {erro ? <Text style={formStyles.textoErro}>{erro}</Text> : null}

      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
        <TouchableOpacity style={styles.fundoModal} activeOpacity={1} onPress={() => setAberto(false)}>
          <View style={styles.caixaModal}>
            <Text style={styles.tituloModal}>{label || 'Selecione'}</Text>
            <FlatList
              data={itens}
              keyExtractor={(item) => String(item.valor)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.opcao}
                  onPress={() => {
                    aoSelecionar(item.valor);
                    setAberto(false);
                  }}
                >
                  <Text style={styles.textoOpcao}>{item.rotulo}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  campo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  desabilitado: { justifyContent: 'center' },
  caixaVazio: { backgroundColor: '#FDEDEC', borderColor: cores.erro },
  textoVazio: { color: cores.erro, fontSize: 14 },
  textoSelecionado: { color: cores.texto, fontSize: 16 },
  textoClaro: { color: cores.textoClaro, fontSize: 16 },
  seta: { color: cores.textoClaro, fontSize: 16 },
  fundoModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  caixaModal: { backgroundColor: cores.branco, borderRadius: 10, padding: 16, maxHeight: '70%' },
  tituloModal: { fontSize: 16, fontWeight: 'bold', color: cores.texto, marginBottom: 8 },
  opcao: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: cores.borda },
  textoOpcao: { fontSize: 16, color: cores.texto },
});
