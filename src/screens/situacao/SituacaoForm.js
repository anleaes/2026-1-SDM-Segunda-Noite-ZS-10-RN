import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import Seletor from '../../components/Seletor';
import useColecao from '../../hooks/useColecao';
import { formStyles, cores } from '../../components/formStyles';

const STATUS = [
  { valor: 'em_dia', rotulo: 'Em dia' },
  { valor: 'pendente', rotulo: 'Pendente' },
  { valor: 'atrasado', rotulo: 'Atrasado' },
];

export default function SituacaoForm({ route, navigation }) {
  const editando = route.params?.situacao;
  const [paciente, setPaciente] = useState(null);
  const [vacina, setVacina] = useState(null);
  const [calendarioVacinal, setCalendarioVacinal] = useState(null);
  const [status, setStatus] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState({});

  const pacientes = useColecao('/pessoas/pacientes/', (p) => ({ valor: p.id, rotulo: p.nome }));
  const vacinas = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }));
  const calendarios = useColecao('/calendario/', (c) => ({
    valor: c.id,
    rotulo: `${c.dose_recomendada} - ${c.publico_alvo}`,
  }));

  useEffect(() => {
    if (editando) {
      setPaciente(editando.paciente);
      setVacina(editando.vacina);
      setCalendarioVacinal(editando.calendario_vacinal);
      setStatus(editando.status);
      setObservacao(editando.observacao || '');
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!paciente) e.paciente = 'Selecione o paciente.';
    if (!vacina) e.vacina = 'Selecione a vacina.';
    if (!calendarioVacinal) e.calendarioVacinal = 'Selecione o item do calendário vacinal.';
    if (!status) e.status = 'Selecione a situação.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = {
      paciente,
      vacina,
      calendario_vacinal: calendarioVacinal,
      status,
      observacao,
    };
    try {
      if (editando) {
        await api.put(`/situacao/${editando.id}/`, dados);
      } else {
        await api.post('/situacao/', dados);
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
      <Seletor label="Calendário Vacinal *" valor={calendarioVacinal} aoSelecionar={setCalendarioVacinal} itens={calendarios.itens} carregando={calendarios.carregando} erro={erros.calendarioVacinal}
        mensagemVazio="Nenhum calendário cadastrado. Cadastre um calendário vacinal primeiro." />
      <Seletor label="Situação *" valor={status} aoSelecionar={setStatus} itens={STATUS} erro={erros.status} placeholder="Selecione a situação" />

      <CampoTexto label="Observação" value={observacao} onChangeText={setObservacao} multiline numberOfLines={4} placeholder="Observações" />

      <TouchableOpacity style={[formStyles.btnSalvar, { backgroundColor: cores.roxo }]} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
