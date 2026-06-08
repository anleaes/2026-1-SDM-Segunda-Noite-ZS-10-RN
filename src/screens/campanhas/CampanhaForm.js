import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import api from '../../services/api';
import { avisar } from '../../services/dialogo';
import CampoTexto from '../../components/CampoTexto';
import CampoData from '../../components/CampoData';
import { formStyles, cores } from '../../components/formStyles';
import { styles } from './CampanhaForm.styles';

export default function CampanhaForm({ route, navigation }) {
  const editando = route.params?.campanha;
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [ativa, setAtiva] = useState(true);
  const [vacinasDisponiveis, setVacinasDisponiveis] = useState([]);
  const [vacinasSelecionadas, setVacinasSelecionadas] = useState([]);
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (editando) {
      setNome(editando.nome);
      setDescricao(editando.descricao || '');
      setDataInicio(editando.data_inicio);
      setDataFim(editando.data_fim);
      setPublicoAlvo(editando.publico_alvo || '');
      setAtiva(editando.ativa);
      setVacinasSelecionadas(editando.vacinas || []);
    }
  }, []);

  // Carrega a lista de vacinas para o usuário escolher quais entram na campanha.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/vacinas/');
        setVacinasDisponiveis(data);
      } catch (err) {
        avisar('Erro', 'Não foi possível carregar as vacinas.');
      }
    })();
  }, []);

  // Marca/desmarca uma vacina na seleção (relação N:N campanha ↔ vacinas).
  const alternarVacina = (id) => {
    setVacinasSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((v) => v !== id) : [...atual, id]
    );
  };

  const validar = () => {
    const e = {};
    const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!nome.trim()) e.nome = 'Informe o nome da campanha.';
    if (!dataInicio.trim()) e.dataInicio = 'Informe a data de início.';
    else if (!dataRegex.test(dataInicio)) e.dataInicio = 'Use o formato AAAA-MM-DD. Ex: 2026-01-01';
    if (!dataFim.trim()) e.dataFim = 'Informe a data de fim.';
    else if (!dataRegex.test(dataFim)) e.dataFim = 'Use o formato AAAA-MM-DD. Ex: 2026-12-31';
    else if (dataRegex.test(dataInicio) && dataFim < dataInicio) e.dataFim = 'A data de fim deve ser posterior à data de início.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = { nome, descricao, data_inicio: dataInicio, data_fim: dataFim, publico_alvo: publicoAlvo, ativa, vacinas: vacinasSelecionadas };
    try {
      if (editando) {
        await api.put(`/campanhas/${editando.id}/`, dados);
      } else {
        await api.post('/campanhas/', dados);
      }
      navigation.goBack();
    } catch (err) {
      avisar('Erro', 'Não foi possível salvar. Verifique os campos e tente novamente.');
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <CampoTexto label="Nome *" value={nome} onChangeText={setNome} placeholder="Nome da campanha" erro={erros.nome} />
      <CampoTexto label="Descrição" value={descricao} onChangeText={setDescricao} multiline numberOfLines={3} placeholder="Descrição" />
      <CampoData label="Data Início *" value={dataInicio} onChange={setDataInicio} erro={erros.dataInicio} />
      <CampoData label="Data Fim *" value={dataFim} onChange={setDataFim} erro={erros.dataFim} />
      <CampoTexto label="Público Alvo" value={publicoAlvo} onChangeText={setPublicoAlvo} placeholder="Ex: Crianças de 0 a 5 anos" />

      <Text style={formStyles.label}>Vacinas da campanha</Text>
      {vacinasDisponiveis.length === 0 ? (
        <Text style={formStyles.ajuda}>Nenhuma vacina cadastrada.</Text>
      ) : (
        <View style={styles.vacinasContainer}>
          {vacinasDisponiveis.map((vacina) => {
            const selecionada = vacinasSelecionadas.includes(vacina.id);
            return (
              <TouchableOpacity
                key={vacina.id}
                style={[styles.chip, selecionada && styles.chipSelecionado]}
                onPress={() => alternarVacina(vacina.id)}
              >
                <Text style={[styles.chipTexto, selecionada && styles.chipTextoSelecionado]}>
                  {selecionada ? '✓ ' : ''}{vacina.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.switchRow}>
        <Text style={formStyles.label}>Ativa</Text>
        <Switch value={ativa} onValueChange={setAtiva} trackColor={{ true: cores.roxo }} />
      </View>

      <TouchableOpacity style={[formStyles.btnSalvar, { backgroundColor: cores.roxo }]} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
