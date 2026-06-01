import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import Seletor from '../../components/Seletor';
import useLista from '../../hooks/useLista';
import { formStyles } from '../../components/formStyles';

const hojeISO = () => new Date().toISOString().slice(0, 10);

export default function DoseForm({ route, navigation }) {
  const editando = route.params?.dose;
  const [atendimento, setAtendimento] = useState(null);
  const [vacina, setVacina] = useState(null);
  const [lote, setLote] = useState(null);
  const [ordemDose, setOrdemDose] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState({});

  // Coleções cruas (campos completos) para aplicar as regras do esquema vacinal.
  const { itens: atendimentos } = useLista('/atendimentos/');
  const { itens: vacinas } = useLista('/vacinas/');
  const { itens: lotes } = useLista('/vacinas/lotes/');
  const { itens: doses } = useLista('/atendimentos/doses/');

  useEffect(() => {
    if (editando) {
      setAtendimento(editando.atendimento);
      setVacina(editando.vacina);
      setLote(editando.lote);
      setOrdemDose(editando.ordem_dose != null ? Number(editando.ordem_dose) : null);
      setObservacao(editando.observacao || '');
    }
  }, []);

  const atendimentoSel = atendimentos.find((a) => String(a.id) === String(atendimento));
  const vacinaSel = vacinas.find((v) => String(v.id) === String(vacina));
  const pacienteDoAtendimento = (atId) =>
    atendimentos.find((a) => String(a.id) === String(atId))?.paciente;
  const pacienteAtual = pacienteDoAtendimento(atendimento);
  const totalDoses = vacinaSel?.quantidade_doses;

  // Opções de atendimento — só os realizados podem receber uma dose aplicada.
  const opcoesAtendimento = atendimentos.map((a) => ({
    valor: a.id,
    rotulo: `#${a.id} - ${(a.data_atendimento || '').slice(0, 10)} (${a.status})`,
  }));

  const opcoesVacina = vacinas.map((v) => ({ valor: v.id, rotulo: v.nome }));

  // Lotes da vacina, não vencidos e com estoque (mantém o atual em edição).
  const hoje = hojeISO();
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

  // Doses (ordens) já aplicadas a este paciente para esta vacina.
  const ordensTomadas = doses
    .filter(
      (d) =>
        String(d.id) !== String(editando?.id) &&
        String(d.vacina) === String(vacina) &&
        pacienteAtual != null &&
        String(pacienteDoAtendimento(d.atendimento)) === String(pacienteAtual)
    )
    .map((d) => Number(d.ordem_dose));

  // Ordens ainda disponíveis (1..total), exceto as já tomadas.
  const opcoesOrdem = [];
  if (totalDoses) {
    for (let n = 1; n <= totalDoses; n++) {
      if (!ordensTomadas.includes(n) || n === Number(editando?.ordem_dose)) {
        opcoesOrdem.push({ valor: n, rotulo: `${n}ª dose` });
      }
    }
  }
  const esquemaCompleto = totalDoses && opcoesOrdem.length === 0;

  // Trocar a vacina invalida lote/ordem previamente escolhidos.
  const aoTrocarVacina = (v) => {
    setVacina(v);
    setLote(null);
    setOrdemDose(null);
  };

  const validar = () => {
    const e = {};
    if (!atendimento) e.atendimento = 'Selecione o atendimento.';
    else if (atendimentoSel && atendimentoSel.status !== 'realizado')
      e.atendimento = 'A dose só pode ser registrada em um atendimento com status "realizado".';
    if (!vacina) e.vacina = 'Selecione a vacina.';
    if (!lote) e.lote = 'Selecione o lote.';
    if (esquemaCompleto)
      e.ordemDose = `Paciente já recebeu todas as ${totalDoses} doses desta vacina.`;
    else if (ordemDose == null) e.ordemDose = 'Selecione a ordem da dose.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = { atendimento, vacina, lote, ordem_dose: ordemDose, observacao };
    try {
      if (editando) {
        await api.put(`/atendimentos/doses/${editando.id}/`, dados);
      } else {
        await api.post('/atendimentos/doses/', dados);
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
      <Seletor label="Atendimento *" valor={atendimento} aoSelecionar={setAtendimento} itens={opcoesAtendimento} erro={erros.atendimento}
        mensagemVazio="Nenhum atendimento cadastrado. Cadastre um atendimento primeiro." />
      <Seletor label="Vacina *" valor={vacina} aoSelecionar={aoTrocarVacina} itens={opcoesVacina} erro={erros.vacina}
        mensagemVazio="Nenhuma vacina cadastrada. Cadastre uma vacina primeiro." />
      <Seletor label="Lote *" valor={lote} aoSelecionar={setLote} itens={opcoesLote} erro={erros.lote}
        mensagemVazio={vacina ? 'Nenhum lote válido (com estoque e dentro da validade) para esta vacina.' : 'Selecione a vacina primeiro.'} />

      <Seletor label="Ordem da Dose *" valor={ordemDose} aoSelecionar={setOrdemDose} itens={opcoesOrdem} erro={erros.ordemDose}
        placeholder={vacina ? 'Selecione a dose' : 'Selecione a vacina primeiro'}
        mensagemVazio={esquemaCompleto ? `Paciente já completou as ${totalDoses} doses desta vacina.` : 'Selecione a vacina e o atendimento primeiro.'} />

      <CampoTexto label="Observação" value={observacao} onChangeText={setObservacao} multiline />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
