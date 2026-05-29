import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { formStyles, cores } from './formStyles';

// Campo de texto reutilizável que mostra, logo abaixo, uma mensagem de
// validação simples explicando o que está errado e como preencher.
export default function CampoTexto({ label, erro, ajuda, style, ...props }) {
  return (
    <View>
      {label ? <Text style={formStyles.label}>{label}</Text> : null}
      <TextInput
        style={[formStyles.input, erro ? formStyles.inputErro : null, style]}
        placeholderTextColor={cores.textoClaro}
        {...props}
      />
      {erro ? (
        <Text style={formStyles.textoErro}>{erro}</Text>
      ) : ajuda ? (
        <Text style={formStyles.ajuda}>{ajuda}</Text>
      ) : null}
    </View>
  );
}
