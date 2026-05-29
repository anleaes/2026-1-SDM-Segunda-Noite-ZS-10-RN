import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import { formStyles } from '../../components/formStyles';

export default function UnidadeForm({ route, navigation }) {
  const editando = route.params?.unidade;
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [horario, setHorario] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setEndereco(editando.endereco);
      setBairro(editando.bairro);
      setTelefone(editando.telefone);
      setHorario(editando.horario_funcionamento);
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome da unidade.';
    if (!endereco.trim()) e.endereco = 'Informe o endereço.';
    if (!bairro.trim()) e.bairro = 'Informe o bairro.';
    if (!telefone.trim()) e.telefone = 'Informe um telefone para contato.';
    if (!horario.trim()) e.horario = 'Informe o horário de funcionamento.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = { nome, endereco, bairro, telefone, horario_funcionamento: horario, ativa: true };
    try {
      if (editando) {
        await api.put('/unidades/' + editando.id + '/', dados);
      } else {
        await api.post('/unidades/', dados);
      }
      navigation.goBack();
    } catch (err) {
      if (err.response?.data) {
        const mensagens = Object.entries(err.response.data)
          .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n');
        Alert.alert('Erro ao salvar', mensagens);
      } else {
        Alert.alert('Erro', 'Não foi possível salvar. Verifique sua conexão.');
      }
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <CampoTexto label="Nome *" value={nome} onChangeText={setNome} placeholder="Nome da unidade" erro={erros.nome} />
      <CampoTexto label="Endereço *" value={endereco} onChangeText={setEndereco} placeholder="Rua, número" erro={erros.endereco} />
      <CampoTexto label="Bairro *" value={bairro} onChangeText={setBairro} placeholder="Nome do bairro" erro={erros.bairro} />
      <CampoTexto label="Telefone *" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholder="(00) 0000-0000" erro={erros.telefone} />
      <CampoTexto label="Horário de Funcionamento *" value={horario} onChangeText={setHorario} placeholder="08:00 - 17:00" erro={erros.horario} />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
