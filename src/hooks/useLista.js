import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

// Carrega uma lista de um endpoint (tratando paginação do DRF) e recarrega ao focar a tela.
export default function useLista(endpoint, msgErro = 'Não foi possível carregar os dados.') {
  const [itens, setItens] = useState([]);

  const carregar = useCallback(async () => {
    try {
      const res = await api.get(endpoint);
      const lista = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setItens(lista);
    } catch (err) {
      Alert.alert('Erro', msgErro);
    }
  }, [endpoint, msgErro]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return { itens, carregar };
}
