import { Alert } from 'react-native';

// Mostra um Alert com a mensagem de erro da API (formato DRF { campo: [msg] }).
export function mostrarErroApi(err, mensagemPadrao = 'Não foi possível salvar. Verifique os dados informados.') {
  const dados = err?.response?.data;
  if (dados && typeof dados === 'object') {
    const mensagens = Object.entries(dados)
      .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
      .join('\n');
    Alert.alert('Erro ao salvar', mensagens || mensagemPadrao);
  } else {
    Alert.alert('Erro', mensagemPadrao);
  }
}
