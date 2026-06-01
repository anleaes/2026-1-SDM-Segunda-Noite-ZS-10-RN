import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import CampoData from '../../components/CampoData';
import Seletor from '../../components/Seletor';
import useLista from '../../hooks/useLista';
import { formStyles } from '../../components/formStyles';

const hojeISO = () => new Date().toISOString().slice(0, 10);

export default function RegistroForm({ route, navigation }) {
  const editando = route.params?.registro;
  const [paciente, setPaciente] = useState(null);
  const [vacina, setVacina] = useState(null);
  const [lote, setLote] = useState(null);
  const [profissional, setProfissional] = useState(null);
  const [unidadeSaude, setUnidadeSaude] = useState(null);
  const [atendimento, setAtendimento] = useState(null);
  const [dataAplicacao, setDataAplicacao] = useState('');
  const [dose, setDose] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState({});

  const { itens: pacientes } = useLista('/pessoas/pacientes/');
  const { itens: vacinas } = useLista('/vacinas/');
  const { itens: lotes } = useLista('/vacinas/lotes/');
  const { itens: profissionais } = useLista('/pessoas/profissionais/');
  const { itens: unidades } = useLista('/unidades/');
  const { itens: atendimentos } = useLista('/atendimentos/');
  const { itens: registros } = useLista('/registros/');

  useEffect(() => {
    if (editando) {
      setPaciente(editando.paciente);
      setVacina(editando.vacina);
      setLote(editando.lote);
      setProfissional(editando.profissional);
      setUnidadeSaude(editando.unidade_saude);
      setAtendimento(editando.atendimento);
      setDataAplicacao(editando.data_aplicacao);
      setDose(editando.dose != null ? Number(editando.dose) : null);
      setObservacao(editando.observacao || '');
    }
  }, []);

  const vacinaSel = vacinas.find((v) => String(v.id) === String(vacina));
  const totalDoses = vacinaSel?.quantidade_doses;
  const hoje = hojeISO();

  const opcoesPaciente = pacientes.map((p) => ({ valor: p.id, rotulo: p.nome }));
  const opcoesVacina = vacinas.map((v) => ({ valor: v.id, rotulo: v.nome }));
  const opcoesProfissional = profissionais.map((p) => ({ valor: p.id, rotulo: p.nome }));
  const opcoesUnidade = unidades.map((u) => ({ valor: u.id, rotulo: u.nome }));
  // Só atendimentos "realizados" podem receber um registro de aplicação.
  const atendimentoSel = atendimentos.find((a) => String(a.id) === String(atendimento));
  const opcoesAtendimento = atendimentos
    .filter((a) => a.status === 'realizado')
    .map((a) => ({
      valor: a.id,
      rotulo: `#${a.id} - ${(a.data_atendimento || '').slice(0, 10)}`,
    }));

  // Lotes válidos da vacina (com estoque e validade); mantém o atual em edição.
  const opcoesLote = lotes
    .filter(
      (l) =>
        String(l.vacina) === String(vacina) &&
        ((l.data_validade >= hoje && l.quantidade_disponivel > 0) ||
          String(l.id) === String(editando?.lote))
    )
    .map((l) => ({
      valor: l.id,
      rotulo: `${l.numero_lote} (val: ${l.data_validade}, disp: ${l.quantidade_disponivel})`,
    }));

  // Doses já registradas para este paciente nesta vacina.
  const dosesTomadas = registros
    .filter(
      (r) =>
        String(r.id) !== String(editando?.id) &&
        String(r.vacina) === String(vacina) &&
        String(r.paciente) === String(paciente)
    )
    .map((r) => Number(r.dose));

  const opcoesDose = [];
  if (totalDoses) {
    for (let n = 1; n <= totalDoses; n++) {
      if (!dosesTomadas.includes(n) || n === Number(editando?.dose)) {
        opcoesDose.push({ valor: n, rotulo: `${n}ª dose` });
      }
    }
  }
  const esquemaCompleto = totalDoses && opcoesDose.length === 0;

  const aoTrocarVacina = (v) => {
    setVacina(v);
    setLote(null);
    setDose(null);
  };
  const aoTrocarPaciente = (p) => {
    setPaciente(p);
    setDose(null);
  };

  const validar = () => {
    const e = {};
    if (!paciente) e.paciente = 'Selecione o paciente.';
    if (!vacina) e.vacina = 'Selecione a vacina.';
    if (!lote) e.lote = 'Selecione o lote.';
    if (!profissional) e.profissional = 'Selecione o profissional.';
    if (!unidadeSaude) e.unidadeSaude = 'Selecione a unidade de saúde.';
    if (!atendimento) e.atendimento = 'Selecione o atendimento.';
    else if (atendimentoSel && atendimentoSel.status !== 'realizado')
      e.atendimento = 'O atendimento precisa estar com status "realizado".';
    if (!dataAplicacao.trim()) e.dataAplicacao = 'Informe a data da aplicação.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dataAplicacao)) e.dataAplicacao = 'Use o formato AAAA-MM-DD. Ex: 2026-06-15';
    else if (dataAplicacao > hoje) e.dataAplicacao = 'A data da aplicação não pode ser no futuro.';
    if (esquemaCompleto)
      e.dose = `Paciente já recebeu todas as ${totalDoses} doses desta vacina.`;
    else if (dose == null) e.dose = 'Selecione a dose.';
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
      if (err.response?.data) {
        const mensagens = Object.entries(err.response.data)
          .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n');
        Alert.alert('Erro ao salvar', mensagens);
      } else {
        Alert.alert('Erro', 'Não foi possível salvar. Verifique os dados informados.');
      }
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <Seletor label="Paciente *" valor={paciente} aoSelecionar={aoTrocarPaciente} itens={opcoesPaciente} erro={erros.paciente}
        mensagemVazio="Nenhum paciente cadastrado. Cadastre um paciente primeiro." />
      <Seletor label="Vacina *" valor={vacina} aoSelecionar={aoTrocarVacina} itens={opcoesVacina} erro={erros.vacina}
        mensagemVazio="Nenhuma vacina cadastrada. Cadastre uma vacina primeiro." />
      <Seletor label="Lote *" valor={lote} aoSelecionar={setLote} itens={opcoesLote} erro={erros.lote}
        mensagemVazio={vacina ? 'Nenhum lote válido (com estoque e dentro da validade) para esta vacina.' : 'Selecione a vacina primeiro.'} />
      <Seletor label="Profissional *" valor={profissional} aoSelecionar={setProfissional} itens={opcoesProfissional} erro={erros.profissional}
        mensagemVazio="Nenhum profissional cadastrado. Cadastre um profissional primeiro." />
      <Seletor label="Unidade de Saúde *" valor={unidadeSaude} aoSelecionar={setUnidadeSaude} itens={opcoesUnidade} erro={erros.unidadeSaude}
        mensagemVazio="Nenhuma unidade cadastrada. Cadastre uma unidade primeiro." />
      <Seletor label="Atendimento (realizado) *" valor={atendimento} aoSelecionar={setAtendimento} itens={opcoesAtendimento} erro={erros.atendimento}
        mensagemVazio="Nenhum atendimento realizado. Marque um atendimento como 'realizado' primeiro." />

      <CampoData label="Data da Aplicação *" value={dataAplicacao} onChange={setDataAplicacao} maximumDate={new Date()} erro={erros.dataAplicacao} />

      <Seletor label="Dose *" valor={dose} aoSelecionar={setDose} itens={opcoesDose} erro={erros.dose}
        placeholder={vacina ? 'Selecione a dose' : 'Selecione a vacina primeiro'}
        mensagemVazio={esquemaCompleto ? `Paciente já completou as ${totalDoses} doses desta vacina.` : 'Selecione o paciente e a vacina primeiro.'} />

      <CampoTexto label="Observação" value={observacao} onChangeText={setObservacao} multiline />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
