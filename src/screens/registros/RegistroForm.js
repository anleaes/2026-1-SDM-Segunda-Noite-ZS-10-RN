import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import Seletor from '../../components/Seletor';
import useColecao from '../../hooks/useColecao';
import { formStyles } from '../../components/formStyles';

export default function RegistroForm({ route, navigation }) {
  const editando = route.params?.registro;
  const [paciente, setPaciente] = useState(null);
  const [vacina, setVacina] = useState(null);
  const [lote, setLote] = useState(null);
  const [profissional, setProfissional] = useState(null);
  const [unidadeSaude, setUnidadeSaude] = useState(null);
  const [atendimento, setAtendimento] = useState(null);
  const [dataAplicacao, setDataAplicacao] = useState('');
  const [dose, setDose] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState({});

  const pacientes = useColecao('/pessoas/pacientes/', (p) => ({ valor: p.id, rotulo: p.nome }));
  const vacinas = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }));
  const lotes = useColecao('/vacinas/lotes/', (l) => ({ valor: l.id, rotulo: l.numero_lote }));
  const profissionais = useColecao('/pessoas/profissionais/', (p) => ({ valor: p.id, rotulo: p.nome }));
  const unidades = useColecao('/unidades/', (u) => ({ valor: u.id, rotulo: u.nome }));
  const atendimentos = useColecao('/atendimentos/', (a) => ({
    valor: a.id,
    rotulo: `#${a.id} - ${(a.data_atendimento || '').slice(0, 10)} (${a.status})`,
  }));

  useEffect(() => {
    if (editando) {
      setPaciente(editando.paciente);
      setVacina(editando.vacina);
      setLote(editando.lote);
      setProfissional(editando.profissional);
      setUnidadeSaude(editando.unidade_saude);
      setAtendimento(editando.atendimento);
      setDataAplicacao(editando.data_aplicacao);
      setDose(editando.dose);
      setObservacao(editando.observacao || '');
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!paciente) e.paciente = 'Selecione o paciente.';
    if (!vacina) e.vacina = 'Selecione a vacina.';
    if (!lote) e.lote = 'Selecione o lote.';
    if (!profissional) e.profissional = 'Selecione o profissional.';
    if (!unidadeSaude) e.unidadeSaude = 'Selecione a unidade de saúde.';
    if (!atendimento) e.atendimento = 'Selecione o atendimento.';
    if (!dataAplicacao.trim()) e.dataAplicacao = 'Informe a data da aplicação.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dataAplicacao)) e.dataAplicacao = 'Use o formato AAAA-MM-DD. Ex: 2026-06-15';
    if (!dose.trim()) e.dose = 'Informe a dose. Ex: 1ª Dose, Reforço';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = {
      paciente,
      vacina,
      lote,
      profissional,
      unidade_saude: unidadeSaude,
      atendimento,
      data_aplicacao: dataAplicacao,
      dose,
      observacao,
    };
    try {
      if (editando) {
        await api.put(`/registros/${editando.id}/`, dados);
      } else {
        await api.post('/registros/', dados);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique os dados informados.');
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <Seletor label="Paciente *" valor={paciente} aoSelecionar={setPaciente} itens={pacientes.itens} carregando={pacientes.carregando} erro={erros.paciente}
        mensagemVazio="Nenhum paciente cadastrado. Cadastre um paciente primeiro." />
      <Seletor label="Vacina *" valor={vacina} aoSelecionar={setVacina} itens={vacinas.itens} carregando={vacinas.carregando} erro={erros.vacina}
        mensagemVazio="Nenhuma vacina cadastrada. Cadastre uma vacina primeiro." />
      <Seletor label="Lote *" valor={lote} aoSelecionar={setLote} itens={lotes.itens} carregando={lotes.carregando} erro={erros.lote}
        mensagemVazio="Nenhum lote cadastrado. Cadastre um lote primeiro." />
      <Seletor label="Profissional *" valor={profissional} aoSelecionar={setProfissional} itens={profissionais.itens} carregando={profissionais.carregando} erro={erros.profissional}
        mensagemVazio="Nenhum profissional cadastrado. Cadastre um profissional primeiro." />
      <Seletor label="Unidade de Saúde *" valor={unidadeSaude} aoSelecionar={setUnidadeSaude} itens={unidades.itens} carregando={unidades.carregando} erro={erros.unidadeSaude}
        mensagemVazio="Nenhuma unidade cadastrada. Cadastre uma unidade primeiro." />
      <Seletor label="Atendimento *" valor={atendimento} aoSelecionar={setAtendimento} itens={atendimentos.itens} carregando={atendimentos.carregando} erro={erros.atendimento}
        mensagemVazio="Nenhum atendimento cadastrado. Cadastre um atendimento primeiro." />

      <CampoTexto label="Data da Aplicação *" value={dataAplicacao} onChangeText={setDataAplicacao} placeholder="2026-06-15" ajuda="Formato: AAAA-MM-DD" erro={erros.dataAplicacao} />
      <CampoTexto label="Dose *" value={dose} onChangeText={setDose} placeholder="Ex: 1ª Dose, Reforço" erro={erros.dose} />
      <CampoTexto label="Observação" value={observacao} onChangeText={setObservacao} multiline />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
