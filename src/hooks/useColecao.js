import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

// Busca uma coleção de registros de um endpoint para alimentar um Seletor.
//
// Recebe o endpoint (ex: '/unidades/') e uma função que transforma cada
// registro em { valor, rotulo }. Recarrega sempre que a tela ganha foco,
// para que registros recém-cadastrados apareçam na lista.
export default function useColecao(endpoint, paraOpcao) {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await api.get(endpoint);
      const lista = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setItens(lista.map(paraOpcao));
    } catch (err) {
      setItens([]);
    } finally {
      setCarregando(false);
    }
  }, [endpoint]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return { itens, carregando };
}
