import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { definirToken, registrarOnNaoAutorizado } from '../services/api';

const CHAVE_TOKEN = '@vacinas:token';
const CHAVE_USUARIO = '@vacinas:usuario';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Restaura a sessão salva ao abrir o app.
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem(CHAVE_TOKEN);
        const usuarioSalvo = await AsyncStorage.getItem(CHAVE_USUARIO);
        if (token) {
          definirToken(token);
          setUsuario(usuarioSalvo ? JSON.parse(usuarioSalvo) : {});
        }
      } catch (e) {
        // ignora — usuário fará login
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const sair = useCallback(async () => {
    try {
      await api.post('/auth/logout/');
    } catch (e) {
      // mesmo se falhar no servidor, encerramos a sessão local
    }
    definirToken(null);
    await AsyncStorage.multiRemove([CHAVE_TOKEN, CHAVE_USUARIO]);
    setUsuario(null);
  }, []);

  // Se a API responder 401, encerra a sessão automaticamente.
  useEffect(() => {
    registrarOnNaoAutorizado(() => {
      definirToken(null);
      AsyncStorage.multiRemove([CHAVE_TOKEN, CHAVE_USUARIO]);
      setUsuario(null);
    });
  }, []);

  const entrar = useCallback(async (username, password) => {
    const { data } = await api.post('/auth/login/', { username, password });
    definirToken(data.token);
    await AsyncStorage.setItem(CHAVE_TOKEN, data.token);
    await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(data.usuario || {}));
    setUsuario(data.usuario || {});
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, sair, autenticado: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
