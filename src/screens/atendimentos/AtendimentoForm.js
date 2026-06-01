import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import CampoData from '../../components/CampoData';
import Seletor from '../../components/Seletor';
import useColecao from '../../hooks/useColecao';
import { mostrarErroApi } from '../../services/erros';
import { formStyles } from '../../components/formStyles';

const STATUS = [
  { valor: 'agendado', rotulo: 'Agendado' },
  { valor: 'realizado', rotulo: 'Realizado' },
  { valor: 'cancelado', rotulo: 'Cancelado' },
];

export default function AtendimentoForm({ route, navigation }) {
  const editando = route.params?.atendimento;
  const [paciente, setPaciente] = useState(null);
  const [unidadeSaude, setUnidadeSaude] = useState(null);
  const [profissional, setProfissional] = useState(null);
  const [dataAtendimento, setDataAtendimento] = useState('');
  const [status, setStatus] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState({});

  const pacientes = useColecao('/pessoas/pacientes/', (p) => ({ valor: p.id, rotulo: p.nome }));
  const unidades = useColecao('/unidades/', (u) => ({ valor: u.id, rotulo: u.nome }));
  const profissionais = useColecao('/pessoas/profissionais/', (p) => ({ valor: p.id, rotulo: p.nome }));

  useEffect(() => {
    if (editando) {
      setPaciente(editando.paciente);
      setUnidadeSaude(editando.unidade_saude);
      setProfissional(editando.profissional);
      setDataAtendimento((editando.data_atendimento || '').slice(0, 10));
      setStatus(editando.status);
      setObservacao(editando.observacao || '');
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!paciente) e.paciente = 'Selecione o paciente.';
    if (!unidadeSaude) e.unidadeSaude = 'Selecione a unidade de saúde.';
    if (!profissional) e.profissional = 'Selecione o profissional.';
    if (!dataAtendimento.trim()) e.dataAtendimento = 'Informe a data do atendimento.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dataAtendimento)) e.dataAtendimento = 'Use o formato AAAA-MM-DD. Ex: 2026-06-15';
    else if (status === 'realizado' && dataAtendimento > new Date().toISOString().slice(0, 10))
      e.dataAtendimento = 'Um atendimento realizado não pode ter data no futuro.';
    if (!status) e.status = 'Selecione o status do atendimento.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = {
      paciente,
      unidade_saude: unidadeSaude,
      profissional,
      data_atendimento: `${dataAtendimento}T00:00:00`,
      status,
      observacao,
    };
    try {
      if (editando) {
        await api.put(`/atendimentos/${editando.id}/`, dados);
      } else {
        await api.post('/atendimentos/', dados);
      }
      navigation.goBack();
    } catch (err) {
      mostrarErroApi(err);
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <Seletor label="Paciente *" valor={paciente} aoSelecionar={setPaciente} itens={pacientes.itens} carregando={pacientes.carregando} erro={erros.paciente}
        mensagemVazio="Nenhum paciente cadastrado. Cadastre um paciente primeiro." />
      <Seletor label="Unidade de Saúde *" valor={unidadeSaude} aoSelecionar={setUnidadeSaude} itens={unidades.itens} carregando={unidades.carregando} erro={erros.unidadeSaude}
        mensagemVazio="Nenhuma unidade cadastrada. Cadastre uma unidade primeiro." />
      <Seletor label="Profissional *" valor={profissional} aoSelecionar={setProfissional} itens={profissionais.itens} carregando={profissionais.carregando} erro={erros.profissional}
        mensagemVazio="Nenhum profissional cadastrado. Cadastre um profissional primeiro." />

      <CampoData label="Data do Atendimento *" value={dataAtendimento} onChange={setDataAtendimento} erro={erros.dataAtendimento} />

      <Seletor label="Status *" valor={status} aoSelecionar={setStatus} itens={STATUS} erro={erros.status} placeholder="Selecione o status" />

      <CampoTexto label="Observação" value={observacao} onChangeText={setObservacao} multiline />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
