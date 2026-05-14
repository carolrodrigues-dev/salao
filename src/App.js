import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store, persistor } from '../src/store/';
import { PersistGate } from 'redux-persist/integration/react';

/* Páginas */
import Login from './view/login';
import NovoUsuario from './view/usuario-novo/';
import Home from './view/home/';
import UsuarioRecuperarSenha from './view/usuario-recuperar-senha';
import ServicoSalao from './view/servico-salao';
import Detalhes from './view/Salao-detalhes/detalhes';
import Admin from './pages/admin/admin';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>

          <Routes>

            {/* 🔥 LOGIN SEMPRE PRIMEIRO */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            <Route path="/home" element={<Home />} />
            <Route path="/novousuario" element={<NovoUsuario />} />
            <Route path="/usuariorecuperarsenha" element={<UsuarioRecuperarSenha />} />
            <Route path="/servicosalao" element={<ServicoSalao />} />
            <Route path="/detalhes/:id" element={<Detalhes />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>

        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;