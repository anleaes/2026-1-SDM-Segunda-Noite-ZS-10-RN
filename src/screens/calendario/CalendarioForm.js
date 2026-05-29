import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import api from '../../services/api';
import CampoTexto from '../../components/CampoTexto';
import Seletor from '../../components/Seletor';
import useColecao from '../../hooks/useColecao';
import { formStyles } from '../../components/formStyles';

export default function CalendarioForm({ route, navigation }) {
  const editando = route.params?.calendario;
  const [vacina, setVacina] = useState(null);
  const [idadeMinima, setIdadeMinima] = useState('');
  const [idadeMaxima, setIdadeMaxima] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [doseRecomendada, setDoseRecomendada] = useState('');
  const [obrigatoria, setObrigatoria] = useState(false);
  const [erros, setErros] = useState({});

  const vacinas = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }));

  useEffect(() => {
    if (editando) {
      setVacina(editando.vacina);
      setIdadeMinima(String(editando.idade_minima_meses));
      setIdadeMaxima(editando.idade_maxima_meses != null ? String(editando.idade_maxima_meses) : '');
      setPublicoAlvo(editando.publico_alvo);
      setDoseRecomendada(editando.dose_recomendada);
      setObrigatoria(editando.obrigatoria);
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!vacina) e.vacina = 'Selecione a vacina.';
    if (!idadeMinima.trim()) e.idadeMinima = 'Informe a idade mínima em meses.';
    else if (isNaN(parseInt(idadeMinima)) || parseInt(idadeMinima) < 0) e.idadeMinima = 'Deve ser um número inteiro igual ou maior que zero.';
    if (idadeMaxima.trim() && isNaN(parseInt(idadeMaxima))) e.idadeMaxima = 'Deve ser um número inteiro (meses).';
    if (!publicoAlvo.trim()) e.publicoAlvo = 'Informe o público alvo.';
    if (!doseRecomendada.trim()) e.doseRecomendada = 'Informe a dose recomendada.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    const dados = {
      vacina,
      idade_minima_meses: parseInt(idadeMinima),
      idade_maxima_meses: idadeMaxima ? parseInt(idadeMaxima) : null,
      publico_alvo: publicoAlvo,
      dose_recomendada: doseRecomendada,
      obrigatoria,
    };
    try {
      if (editando) {
        await api.put(`/calendario/${editando.id}/`, dados);
      } else {
        await api.post('/calendario/', dados);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique os dados informados.');
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <Seletor label="Vacina *" valor={vacina} aoSelecionar={setVacina} itens={vacinas.itens} carregando={vacinas.carregando} erro={erros.vacina}
        mensagemVazio="Nenhuma vacina cadastrada. Cadastre uma vacina primeiro." />

      <CampoTexto label="Idade Mínima (meses) *" value={idadeMinima} onChangeText={setIdadeMinima} keyboardType="numeric" placeholder="Ex: 0" erro={erros.idadeMinima} />
      <CampoTexto label="Idade Máxima (meses)" value={idadeMaxima} onChangeText={setIdadeMaxima} keyboardType="numeric" placeholder="Opcional" erro={erros.idadeMaxima} />
      <CampoTexto label="Público Alvo *" value={publicoAlvo} onChangeText={setPublicoAlvo} placeholder="Ex: Crianças" erro={erros.publicoAlvo} />
      <CampoTexto label="Dose Recomendada *" value={doseRecomendada} onChangeText={setDoseRecomendada} placeholder="Ex: 1ª Dose" erro={erros.doseRecomendada} />

      <View style={styles.switchContainer}>
        <Text style={formStyles.label}>Vacina Obrigatória?</Text>
        <Switch value={obrigatoria} onValueChange={setObrigatoria} />
      </View>

      <TouchableOpacity style={formStyles.btnSalvar} onPress={salvar}>
        <Text style={formStyles.btnTexto}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
});
