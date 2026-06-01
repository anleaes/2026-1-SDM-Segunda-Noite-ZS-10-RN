import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import CampoData from '../../components/CampoData';
import Seletor from '../../components/Seletor';
import useColecao from '../../hooks/useColecao';
import { formStyles } from '../../components/formStyles';

export default function LoteForm({ route, navigation }) {
  const editando = route.params?.lote;
  const [vacina, setVacina] = useState(null);
  const [unidadeSaude, setUnidadeSaude] = useState(null);
  const [numeroLote, setNumeroLote] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState('');
  const [erros, setErros] = useState({});

  const vacinas = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }));
  const unidades = useColecao('/unidades/', (u) => ({ valor: u.id, rotulo: u.nome }));

  useEffect(() => {
    if (editando) {
      setVacina(editando.vacina);
      setUnidadeSaude(editando.unidade_saude);
      setNumeroLote(editando.numero_lote);
      setDataValidade(editando.data_validade);
      setQuantidadeDisponivel(String(editando.quantidade_disponivel));
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!vacina) e.vacina = 'Selecione a vacina.';
    if (!unidadeSaude) e.unidadeSaude = 'Selecione a unidade de saúde.';
    if (!numeroLote.trim()) e.numeroLote = 'Informe o número do lote.';
    if (!dataValidade.trim()) e.dataValidade = 'Informe a data de validade.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dataValidade)) e.dataValidade = 'Use o formato AAAA-MM-DD. Ex: 2027-12-31';
    else if (!editando && dataValidade < new Date().toISOString().slice(0, 10))
      e.dataValidade = 'A data de validade não pode estar no passado.';
    if (!quantidadeDisponivel.trim()) e.quantidadeDisponivel = 'Informe a quantidade disponível.';
    else if (isNaN(parseInt(quantidadeDisponivel)) || parseInt(quantidadeDisponivel) < 0)
      e.quantidadeDisponivel = 'Deve ser um número inteiro igual ou maior que zero.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = {
      vacina,
      unidade_saude: unidadeSaude,
      numero_lote: numeroLote,
      data_validade: dataValidade,
      quantidade_disponivel: parseInt(quantidadeDisponivel),
    };
    try {
      if (editando) {
        await api.put('/vacinas/lotes/' + editando.id + '/', dados);
      } else {
        await api.post('/vacinas/lotes/', dados);
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
      <Seletor label="Vacina *" valor={vacina} aoSelecionar={setVacina} itens={vacinas.itens} carregando={vacinas.carregando} erro={erros.vacina}
        mensagemVazio="Nenhuma vacina cadastrada. Cadastre uma vacina primeiro." />
      <Seletor label="Unidade de Saúde *" valor={unidadeSaude} aoSelecionar={setUnidadeSaude} itens={unidades.itens} carregando={unidades.carregando} erro={erros.unidadeSaude}
        mensagemVazio="Nenhuma unidade cadastrada. Cadastre uma unidade primeiro." />

      <CampoTexto label="Número do Lote *" value={numeroLote} onChangeText={setNumeroLote} placeholder="Ex: LOTE-2026-001" erro={erros.numeroLote} />
      <CampoData label="Data de Validade *" value={dataValidade} onChange={setDataValidade} minimumDate={editando ? undefined : new Date()} erro={erros.dataValidade} />
      <CampoTexto label="Quantidade Disponível *" value={quantidadeDisponivel} onChangeText={setQuantidadeDisponivel} keyboardType="numeric" placeholder="Ex: 100" erro={erros.quantidadeDisponivel} />

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
