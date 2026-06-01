import { useMemo } from 'react';
import useColecao from './useColecao';

// Resolve o ID de um relacionamento para um nome legível (fallback "#id").
export default function useMapaNomes(endpoint, paraRotulo) {
  const { itens } = useColecao(endpoint, (registro) => ({
    valor: registro.id,
    rotulo: paraRotulo(registro),
  }));

  return useMemo(() => {
    const mapa = {};
    itens.forEach((i) => {
      mapa[String(i.valor)] = i.rotulo;
    });
    return (id) => (id == null ? '—' : mapa[String(id)] ?? `#${id}`);
  }, [itens]);
}
