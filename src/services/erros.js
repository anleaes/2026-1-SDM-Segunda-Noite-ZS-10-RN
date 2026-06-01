import { avisar } from './dialogo';

// Mostra um aviso com a mensagem de erro da API (formato DRF { campo: [msg] }).
export function mostrarErroApi(err, mensagemPadrao = 'Não foi possível salvar. Verifique os dados informados.') {
  const dados = err?.response?.data;
  if (dados && typeof dados === 'object') {
    const mensagens = Object.entries(dados)
      .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
      .join('\n');
    avisar('Erro ao salvar', mensagens || mensagemPadrao);
  } else {
    avisar('Erro', mensagemPadrao);
  }
}
