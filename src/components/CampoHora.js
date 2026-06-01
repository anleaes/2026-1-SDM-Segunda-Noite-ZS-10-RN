import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formStyles, cores } from './formStyles';

// Campo de hora ('HH:MM'). No celular abre o relógio nativo; no navegador usa <input type="time">.
function horaParaData(hhmm) {
  const base = new Date();
  if (hhmm && /^\d{1,2}:\d{2}$/.test(hhmm)) {
    const [h, m] = hhmm.split(':').map(Number);
    base.setHours(h, m, 0, 0);
  } else {
    base.setHours(8, 0, 0, 0);
  }
  return base;
}

function dataParaHora(data) {
  return `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
}

export default function CampoHora({ label, value, onChange, erro }) {
  const [aberto, setAberto] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1 }}>
        {label ? <Text style={formStyles.label}>{label}</Text> : null}
        <input
          type="time"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            backgroundColor: cores.branco,
            border: `1px solid ${erro ? cores.erro : cores.borda}`,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: cores.texto,
            fontFamily: 'inherit',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
        {erro ? <Text style={formStyles.textoErro}>{erro}</Text> : null}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {label ? <Text style={formStyles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[formStyles.input, erro ? formStyles.inputErro : null, { justifyContent: 'center' }]}
        onPress={() => setAberto(true)}
      >
        <Text style={{ fontSize: 16, color: value ? cores.texto : cores.textoClaro }}>
          {value || 'Selecionar'}
        </Text>
      </TouchableOpacity>
      {erro ? <Text style={formStyles.textoErro}>{erro}</Text> : null}

      {aberto && (
        <DateTimePicker
          value={horaParaData(value)}
          mode="time"
          is24Hour
          display="default"
          onChange={(evento, selecionada) => {
            setAberto(false);
            if (evento.type === 'set' && selecionada) {
              onChange(dataParaHora(selecionada));
            }
          }}
        />
      )}
    </View>
  );
}
