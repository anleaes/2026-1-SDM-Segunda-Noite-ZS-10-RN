import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import Seletor from '../../components/Seletor';
import useColecao from '../../hooks/useColecao';
import { formStyles } from '../../components/formStyles';

export default function PerfilForm({ route, navigation }) {
  const editando = route.params?.perfil;
  const [paciente, setPaciente] = useState(null);
  const [grupoRisco, setGrupoRisco] = useState(false);
  const [gestante, setGestante] = useState(false);
  const [alergias, setAlergias] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [erros, setErros] = useState({});

  const pacientes = useColecao('/pessoas/pacientes/', (p) => ({ valor: p.id, rotulo: p.nome }));

  useEffect(() => {
    if (editando) {
      setPaciente(editando.paciente);
      setGrupoRisco(editando.grupo_risco);
      setGestante(editando.gestante);
      setAlergias(editando.alergias || '');
      setObservacoes(editando.observacoes || '');
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!paciente) e.paciente = 'Selecione o paciente.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = { paciente, grupo_risco: grupoRisco, gestante, alergias, observacoes };
    try {
      if (editando) {
        await api.put('/perfis/' + editando.id + '/', dados);
      } else {
        await api.post('/perfis/', dados);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique os campos e tente novamente.');
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <Seletor label="Paciente *" valor={paciente} aoSelecionar={setPaciente} itens={pacientes.itens} carregando={pacientes.carregando} erro={erros.paciente}
        mensagemVazio="Nenhum paciente cadastrado. Cadastre um paciente primeiro." />

      <View style={styles.switchRow}>
        <Text style={formStyles.label}>Grupo de Risco</Text>
        <Switch value={grupoRisco} onValueChange={setGrupoRisco} />
      </View>

      <View style={styles.switchRow}>
        <Text style={formStyles.label}>Gestante</Text>
        <Switch value={gestante} onValueChange={setGestante} />
      </View>

      <CampoTexto label="Alergias" value={alergias} onChangeText={setAlergias} multiline style={{ height: 80 }} />
      <CampoTexto label="Observações" value={observacoes} onChangeText={setObservacoes} multiline style={{ height: 80 }} />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
});
