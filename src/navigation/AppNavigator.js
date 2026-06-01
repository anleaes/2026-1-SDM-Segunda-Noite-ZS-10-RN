import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';

// Home (menu principal)
import Home from '../screens/Home';

// Pessoas
import PacienteList from '../screens/pessoas/PacienteList';
import PacienteForm from '../screens/pessoas/PacienteForm';
import ProfissionalList from '../screens/pessoas/ProfissionalList';
import ProfissionalForm from '../screens/pessoas/ProfissionalForm';

// Unidades
import UnidadeList from '../screens/unidades/UnidadeList';
import UnidadeForm from '../screens/unidades/UnidadeForm';

// Vacinas e Lotes
import VacinaList from '../screens/vacinas/VacinaList';
import VacinaForm from '../screens/vacinas/VacinaForm';
import LoteList from '../screens/vacinas/LoteList';
import LoteForm from '../screens/vacinas/LoteForm';

// Perfis
import PerfilList from '../screens/perfis/PerfilList';
import PerfilForm from '../screens/perfis/PerfilForm';

// Calendario
import CalendarioList from '../screens/calendario/CalendarioList';
import CalendarioForm from '../screens/calendario/CalendarioForm';

// Atendimentos e Doses
import AtendimentoList from '../screens/atendimentos/AtendimentoList';
import AtendimentoForm from '../screens/atendimentos/AtendimentoForm';
import DoseList from '../screens/atendimentos/DoseList';
import DoseForm from '../screens/atendimentos/DoseForm';

// Registros
import RegistroList from '../screens/registros/RegistroList';
import RegistroForm from '../screens/registros/RegistroForm';

// Campanhas
import CampanhaList from '../screens/campanhas/CampanhaList';
import CampanhaForm from '../screens/campanhas/CampanhaForm';

// Notificacoes
import NotificacaoList from '../screens/notificacoes/NotificacaoList';
import NotificacaoForm from '../screens/notificacoes/NotificacaoForm';

// Situacao
import SituacaoList from '../screens/situacao/SituacaoList';
import SituacaoForm from '../screens/situacao/SituacaoForm';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { autenticado, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#2E75B6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2E75B6' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {!autenticado ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
        <Stack.Screen name="Home" component={Home} options={{ title: 'Gestor de Vacinação' }} />

        {/* Pessoas */}
        <Stack.Screen name="PacienteList" component={PacienteList} options={{ title: 'Pacientes' }} />
        <Stack.Screen name="PacienteForm" component={PacienteForm} options={{ title: 'Cadastro de Paciente' }} />
        <Stack.Screen name="ProfissionalList" component={ProfissionalList} options={{ title: 'Profissionais' }} />
        <Stack.Screen name="ProfissionalForm" component={ProfissionalForm} options={{ title: 'Cadastro de Profissional' }} />

        {/* Unidades */}
        <Stack.Screen name="UnidadeList" component={UnidadeList} options={{ title: 'Unidades de Saúde' }} />
        <Stack.Screen name="UnidadeForm" component={UnidadeForm} options={{ title: 'Cadastro de Unidade' }} />

        {/* Vacinas e Lotes */}
        <Stack.Screen name="VacinaList" component={VacinaList} options={{ title: 'Vacinas' }} />
        <Stack.Screen name="VacinaForm" component={VacinaForm} options={{ title: 'Cadastro de Vacina' }} />
        <Stack.Screen name="LoteList" component={LoteList} options={{ title: 'Lotes' }} />
        <Stack.Screen name="LoteForm" component={LoteForm} options={{ title: 'Cadastro de Lote' }} />

        {/* Perfis */}
        <Stack.Screen name="PerfilList" component={PerfilList} options={{ title: 'Perfis de Saúde' }} />
        <Stack.Screen name="PerfilForm" component={PerfilForm} options={{ title: 'Cadastro de Perfil' }} />

        {/* Calendario */}
        <Stack.Screen name="CalendarioList" component={CalendarioList} options={{ title: 'Calendário Vacinal' }} />
        <Stack.Screen name="CalendarioForm" component={CalendarioForm} options={{ title: 'Cadastro de Calendário' }} />

        {/* Atendimentos e Doses */}
        <Stack.Screen name="AtendimentoList" component={AtendimentoList} options={{ title: 'Atendimentos' }} />
        <Stack.Screen name="AtendimentoForm" component={AtendimentoForm} options={{ title: 'Cadastro de Atendimento' }} />
        <Stack.Screen name="DoseList" component={DoseList} options={{ title: 'Doses por Atendimento' }} />
        <Stack.Screen name="DoseForm" component={DoseForm} options={{ title: 'Cadastro de Dose' }} />

        {/* Registros */}
        <Stack.Screen name="RegistroList" component={RegistroList} options={{ title: 'Registros de Vacinação' }} />
        <Stack.Screen name="RegistroForm" component={RegistroForm} options={{ title: 'Cadastro de Registro' }} />

        {/* Campanhas */}
        <Stack.Screen name="CampanhaList" component={CampanhaList} options={{ title: 'Campanhas' }} />
        <Stack.Screen name="CampanhaForm" component={CampanhaForm} options={{ title: 'Cadastro de Campanha' }} />

        {/* Notificacoes */}
        <Stack.Screen name="NotificacaoList" component={NotificacaoList} options={{ title: 'Notificações' }} />
        <Stack.Screen name="NotificacaoForm" component={NotificacaoForm} options={{ title: 'Cadastro de Notificação' }} />

        {/* Situacao */}
        <Stack.Screen name="SituacaoList" component={SituacaoList} options={{ title: 'Situação Vacinal' }} />
        <Stack.Screen name="SituacaoForm" component={SituacaoForm} options={{ title: 'Cadastro de Situação' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
