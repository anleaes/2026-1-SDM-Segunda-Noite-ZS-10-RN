import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView } from 'react-native';
import api from '../../services/api';
import { avisar } from '../../services/dialogo';
import CampoTexto from '../../components/CampoTexto';
import CampoData from '../../components/CampoData';
import { formStyles } from '../../components/formStyles';

export default function PacienteForm({ route, navigation }) {
  const editando = route.params?.paciente;
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setEmail(editando.email);
      setTelefone(editando.telefone);
      setCpf(editando.cpf);
      setDataNascimento(editando.data_nascimento);
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome completo.';
    if (!email.trim()) e.email = 'Informe um email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email inválido. Ex: nome@email.com';
    if (!telefone.trim()) e.telefone = 'Informe um telefone para contato.';
    if (!cpf.trim()) e.cpf = 'Informe o CPF.';
    if (!dataNascimento.trim()) e.dataNascimento = 'Informe a data de nascimento.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) e.dataNascimento = 'Use o formato AAAA-MM-DD. Ex: 2000-01-15';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = { nome, email, telefone, cpf, data_nascimento: dataNascimento, ativo: true };
    try {
      if (editando) {
        await api.put('/pessoas/pacientes/' + editando.id + '/', dados);
      } else {
        await api.post('/pessoas/pacientes/', dados);
      }
      navigation.goBack();
    } catch (err) {
      if (err.response?.data) {
        const mensagens = Object.entries(err.response.data)
          .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n');
        avisar('Erro ao salvar', mensagens);
      } else {
        avisar('Erro', 'Não foi possível salvar. Verifique sua conexão.');
      }
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <CampoTexto label="Nome *" value={nome} onChangeText={setNome} placeholder="Nome completo" erro={erros.nome} />
      <CampoTexto label="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="nome@email.com" erro={erros.email} />
      <CampoTexto label="Telefone *" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholder="(00) 00000-0000" erro={erros.telefone} />
      <CampoTexto label="CPF *" value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" erro={erros.cpf} />
      <CampoData label="Data de Nascimento *" value={dataNascimento} onChange={setDataNascimento} maximumDate={new Date()} erro={erros.dataNascimento} />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
