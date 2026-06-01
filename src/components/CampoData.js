import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formStyles, cores } from './formStyles';

// Campo de data: guarda em ISO 'AAAA-MM-DD', mostra em 'DD/MM/AAAA'.
// No celular abre o calendário nativo; no navegador usa <input type="date">.
function isoParaData(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
}

function dataParaIso(data) {
  const a = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}

function isoParaBr(iso) {
  const data = isoParaData(iso);
  if (!data) return '';
  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}

export default function CampoData({ label, value, onChange, erro, ajuda, minimumDate, maximumDate }) {
  const [aberto, setAberto] = useState(false);

  if (Platform.OS === 'web') {
    const min = minimumDate ? dataParaIso(minimumDate) : undefined;
    const max = maximumDate ? dataParaIso(maximumDate) : undefined;
    return (
      <View>
        {label ? <Text style={formStyles.label}>{label}</Text> : null}
        <input
          type="date"
          value={value || ''}
          min={min}
          max={max}
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
        {erro ? <Text style={formStyles.textoErro}>{erro}</Text> : ajuda ? <Text style={formStyles.ajuda}>{ajuda}</Text> : null}
      </View>
    );
  }

  const dataAtual = isoParaData(value) || new Date();

  return (
    <View>
      {label ? <Text style={formStyles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[formStyles.input, erro ? formStyles.inputErro : null, { justifyContent: 'center' }]}
        onPress={() => setAberto(true)}
      >
        <Text style={{ fontSize: 16, color: value ? cores.texto : cores.textoClaro }}>
          {value ? isoParaBr(value) : 'Selecionar data'}
        </Text>
      </TouchableOpacity>

      {erro ? (
        <Text style={formStyles.textoErro}>{erro}</Text>
      ) : ajuda ? (
        <Text style={formStyles.ajuda}>{ajuda}</Text>
      ) : null}

      {aberto && (
        <DateTimePicker
          value={dataAtual}
          mode="date"
          display="default"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={(evento, dataSelecionada) => {
            setAberto(false);
            if (evento.type === 'set' && dataSelecionada) {
              onChange(dataParaIso(dataSelecionada));
            }
          }}
        />
      )}
    </View>
  );
}
