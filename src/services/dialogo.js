import { Alert, Platform } from 'react-native';

// Confirmação que funciona no navegador (Expo Web) e no celular.
// No web, Alert.alert do react-native-web é um no-op e ignora os botões/onPress,
// então usamos window.confirm. Retorna uma Promise<boolean>.
export function confirmar(titulo, mensagem, textoConfirmar = 'Confirmar') {
  if (Platform.OS === 'web') {
    const texto = mensagem ? `${titulo}\n\n${mensagem}` : titulo;
    return Promise.resolve(window.confirm(texto));
  }
  return new Promise((resolve) => {
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: textoConfirmar, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}

// Aviso simples (título + mensagem) que também funciona no navegador.
export function avisar(titulo, mensagem) {
  if (Platform.OS === 'web') {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    return;
  }
  Alert.alert(titulo, mensagem);
}
