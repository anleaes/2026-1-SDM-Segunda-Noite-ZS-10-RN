import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import Seletor from '../../components/Seletor';
import useColecao from '../../hooks/useColecao';
import { formStyles, cores } from '../../components/formStyles';

const TIPOS = [
  { valor: 'lembrete', rotulo: 'Lembrete' },
  { valor: 'alerta', rotulo: 'Alerta' },
  { valor: 'informativo', rotulo: 'Informativo' },
];

export default function NotificacaoForm({ route, navigation }) {
  const editando = route.params?.notificacao;
  const [paciente, setPaciente] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipo, setTipo] = useState(null);
  const [erros, setErros] = useState({});

  const pacientes = useColecao('/pessoas/pacientes/', (p) => ({ valor: p.id, rotulo: p.nome }));

  useEffect(() => {
    if (editando) {
      setPaciente(editando.paciente);
      setTitulo(editando.titulo);
      setMensagem(editando.mensagem);
      setTipo(editando.tipo);
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!paciente) e.paciente = 'Selecione o paciente.';
    if (!titulo.trim()) e.titulo = 'Informe o título da notificação.';
    if (!mensagem.trim()) e.mensagem = 'Informe a mensagem.';
    if (!tipo) e.tipo = 'Selecione o tipo da notificação.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = { paciente, titulo, mensagem, tipo };
    try {
      if (editando) {
        await api.put(`/notificacoes/${editando.id}/`, dados);
      } else {
        await api.post('/notificacoes/', dados);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar a notificação.');
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <Seletor label="Paciente *" valor={paciente} aoSelecionar={setPaciente} itens={pacientes.itens} carregando={pacientes.carregando} erro={erros.paciente}
        mensagemVazio="Nenhum paciente cadastrado. Cadastre um paciente primeiro." />

      <CampoTexto label="Título *" value={titulo} onChangeText={setTitulo} placeholder="Título da notificação" erro={erros.titulo} />
      <CampoTexto label="Mensagem *" value={mensagem} onChangeText={setMensagem} placeholder="Mensagem" multiline numberOfLines={4} erro={erros.mensagem} />

      <Seletor label="Tipo *" valor={tipo} aoSelecionar={setTipo} itens={TIPOS} erro={erros.tipo} placeholder="Selecione o tipo" />

      <TouchableOpacity style={[formStyles.btnSalvar, { backgroundColor: cores.roxo }]} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
