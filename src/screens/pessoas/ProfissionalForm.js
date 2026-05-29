import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import Seletor from '../../components/Seletor';
import useColecao from '../../hooks/useColecao';
import { formStyles } from '../../components/formStyles';

export default function ProfissionalForm({ route, navigation }) {
  const editando = route.params?.profissional;
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [registroProfissional, setRegistroProfissional] = useState('');
  const [cargo, setCargo] = useState('');
  const [unidadeSaude, setUnidadeSaude] = useState(null);
  const [erros, setErros] = useState({});

  const { itens: unidades, carregando } = useColecao('/unidades/', (u) => ({
    valor: u.id,
    rotulo: u.nome,
  }));

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setEmail(editando.email);
      setTelefone(editando.telefone);
      setRegistroProfissional(editando.registro_profissional);
      setCargo(editando.cargo);
      setUnidadeSaude(editando.unidade_saude ?? null);
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome completo do profissional.';
    if (!email.trim()) e.email = 'Informe um email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email inválido. Ex: nome@email.com';
    if (!telefone.trim()) e.telefone = 'Informe um telefone para contato.';
    if (!registroProfissional.trim()) e.registroProfissional = 'Informe o registro (CRM/COREN).';
    if (!cargo.trim()) e.cargo = 'Informe o cargo do profissional.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = {
      nome,
      email,
      telefone,
      registro_profissional: registroProfissional,
      cargo,
      unidade_saude: unidadeSaude,
      ativo: true,
    };
    try {
      if (editando) {
        await api.put('/pessoas/profissionais/' + editando.id + '/', dados);
      } else {
        await api.post('/pessoas/profissionais/', dados);
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
      <CampoTexto label="Nome *" value={nome} onChangeText={setNome} placeholder="Nome completo" erro={erros.nome} />
      <CampoTexto label="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="nome@email.com" erro={erros.email} />
      <CampoTexto label="Telefone *" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholder="(00) 00000-0000" erro={erros.telefone} />
      <CampoTexto label="Registro Profissional *" value={registroProfissional} onChangeText={setRegistroProfissional} placeholder="CRM/COREN" erro={erros.registroProfissional} />
      <CampoTexto label="Cargo *" value={cargo} onChangeText={setCargo} placeholder="Enfermeiro, Médico..." erro={erros.cargo} />

      <Seletor
        label="Unidade de Saúde"
        valor={unidadeSaude}
        aoSelecionar={setUnidadeSaude}
        itens={unidades}
        carregando={carregando}
        placeholder="Selecione a unidade (opcional)"
        mensagemVazio="Nenhuma unidade cadastrada. Cadastre uma unidade primeiro para poder vinculá-la."
      />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
