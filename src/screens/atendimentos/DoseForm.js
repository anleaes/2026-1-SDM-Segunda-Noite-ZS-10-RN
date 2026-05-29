import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import Seletor from '../../components/Seletor';
import useColecao from '../../hooks/useColecao';
import { formStyles } from '../../components/formStyles';

export default function DoseForm({ route, navigation }) {
  const editando = route.params?.dose;
  const [atendimento, setAtendimento] = useState(null);
  const [vacina, setVacina] = useState(null);
  const [lote, setLote] = useState(null);
  const [ordemDose, setOrdemDose] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState({});

  const atendimentos = useColecao('/atendimentos/', (a) => ({
    valor: a.id,
    rotulo: `#${a.id} - ${(a.data_atendimento || '').slice(0, 10)} (${a.status})`,
  }));
  const vacinas = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }));
  const lotes = useColecao('/vacinas/lotes/', (l) => ({ valor: l.id, rotulo: l.numero_lote }));

  useEffect(() => {
    if (editando) {
      setAtendimento(editando.atendimento);
      setVacina(editando.vacina);
      setLote(editando.lote);
      setOrdemDose(editando.ordem_dose);
      setObservacao(editando.observacao || '');
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!atendimento) e.atendimento = 'Selecione o atendimento.';
    if (!vacina) e.vacina = 'Selecione a vacina.';
    if (!lote) e.lote = 'Selecione o lote.';
    if (!ordemDose.trim()) e.ordemDose = 'Informe a ordem da dose. Ex: 1ª Dose, Reforço';
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
      Alert.alert('Erro', 'Não foi possível salvar. Verifique os dados informados.');
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <Seletor label="Atendimento *" valor={atendimento} aoSelecionar={setAtendimento} itens={atendimentos.itens} carregando={atendimentos.carregando} erro={erros.atendimento}
        mensagemVazio="Nenhum atendimento cadastrado. Cadastre um atendimento primeiro." />
      <Seletor label="Vacina *" valor={vacina} aoSelecionar={setVacina} itens={vacinas.itens} carregando={vacinas.carregando} erro={erros.vacina}
        mensagemVazio="Nenhuma vacina cadastrada. Cadastre uma vacina primeiro." />
      <Seletor label="Lote *" valor={lote} aoSelecionar={setLote} itens={lotes.itens} carregando={lotes.carregando} erro={erros.lote}
        mensagemVazio="Nenhum lote cadastrado. Cadastre um lote primeiro." />

      <CampoTexto label="Ordem da Dose *" value={ordemDose} onChangeText={setOrdemDose} placeholder="Ex: 1ª Dose, Reforço" erro={erros.ordemDose} />
      <CampoTexto label="Observação" value={observacao} onChangeText={setObservacao} multiline />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
