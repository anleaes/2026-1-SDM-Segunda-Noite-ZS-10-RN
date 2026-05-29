import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import { formStyles } from '../../components/formStyles';

export default function VacinaForm({ route, navigation }) {
  const editando = route.params?.vacina;
  const [nome, setNome] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [doencaPrevenida, setDoencaPrevenida] = useState('');
  const [quantidadeDoses, setQuantidadeDoses] = useState('');
  const [intervaloDias, setIntervaloDias] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setFabricante(editando.fabricante);
      setDoencaPrevenida(editando.doenca_prevenida);
      setQuantidadeDoses(String(editando.quantidade_doses));
      setIntervaloDias(String(editando.intervalo_dias));
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome da vacina.';
    if (!fabricante.trim()) e.fabricante = 'Informe o fabricante.';
    if (!doencaPrevenida.trim()) e.doencaPrevenida = 'Informe a doença prevenida.';
    if (!quantidadeDoses.trim()) e.quantidadeDoses = 'Informe a quantidade de doses.';
    else if (isNaN(parseInt(quantidadeDoses)) || parseInt(quantidadeDoses) <= 0)
      e.quantidadeDoses = 'Deve ser um número inteiro maior que zero.';
    if (intervaloDias.trim() && isNaN(parseInt(intervaloDias)))
      e.intervaloDias = 'Deve ser um número inteiro (dias).';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = {
      nome,
      fabricante,
      doenca_prevenida: doencaPrevenida,
      quantidade_doses: parseInt(quantidadeDoses),
      intervalo_dias: parseInt(intervaloDias) || 0,
      ativa: true,
    };
    try {
      if (editando) {
        await api.put('/vacinas/' + editando.id + '/', dados);
      } else {
        await api.post('/vacinas/', dados);
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
      <CampoTexto label="Nome *" value={nome} onChangeText={setNome} placeholder="Nome da vacina" erro={erros.nome} />
      <CampoTexto label="Fabricante *" value={fabricante} onChangeText={setFabricante} placeholder="Nome do fabricante" erro={erros.fabricante} />
      <CampoTexto label="Doença Prevenida *" value={doencaPrevenida} onChangeText={setDoencaPrevenida} placeholder="Ex: Hepatite B" erro={erros.doencaPrevenida} />
      <CampoTexto label="Quantidade de Doses *" value={quantidadeDoses} onChangeText={setQuantidadeDoses} keyboardType="numeric" placeholder="Ex: 3" erro={erros.quantidadeDoses} />
      <CampoTexto label="Intervalo entre Doses (dias)" value={intervaloDias} onChangeText={setIntervaloDias} keyboardType="numeric" placeholder="Ex: 30" erro={erros.intervaloDias} />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
