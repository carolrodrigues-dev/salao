import React, { useState } from 'react';
import './login.css';
import { Link, Navigate } from 'react-router-dom';

import firebase from '../../config/firebase';
import { useSelector, useDispatch } from 'react-redux';

import logo from '../../public/imagem3.png';

function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [msgTipo, setMsgTipo] = useState('');

    const dispatch = useDispatch();

    const usuarioLogado = useSelector(state => state.usuarioLogado);

    // LOGIN EMAIL
    function logar() {
        firebase.auth()
            .signInWithEmailAndPassword(email, senha)
            .then(() => {
                setMsgTipo('sucesso');

                setTimeout(() => {
                    dispatch({
                        type: 'LOG_IN',
                        usuarioEmail: email
                    });
                }, 800);
            })
            .catch(() => {
                setMsgTipo('erro');
            });
    }

    // GOOGLE LOGIN (CORRIGIDO SEM COOP)
    function logarComGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                dispatch({
                    type: 'LOG_IN',
                    usuarioEmail: result.user.email
                });
            })
            .catch((error) => {
                console.log(error);
                setMsgTipo('erro');
            });
    }

    // REDIRECT SIMPLES E LIMPO
    if (usuarioLogado) {
        return <Navigate to="/home" />;
    }

    return (
        <div className="login-container">

            <div className="login-card">

                <form className="form-signin">

                    <div className="text-center mb-4">
                        <img className="logo-img" src={logo} alt="Logo" />
                        <h1 className="logo-title">New Look</h1>
                        <p className="logo-sub">Barbearia</p>
                        <h2 className="login-title">Login</h2>
                    </div>

                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="form-control my-2"
                        placeholder="Email"
                    />

                    <input
                        onChange={(e) => setSenha(e.target.value)}
                        type="password"
                        className="form-control my-2"
                        placeholder="Senha"
                    />

                    <button onClick={logar} type="button" className="btn-login">
                        Entrar
                    </button>

                    <div className="divider">
                        <span>Ou continue com</span>
                    </div>

                    <button onClick={logarComGoogle} className="btn-google" type="button">
                    <img 
                    src="https://www.svgrepo.com/show/475656/google-color.svg" 
                    alt="Google"
                    className="google-icon"
                    />
                    Entrar com Google
                    </button>



                    <div className="msg-login text-center my-3">
                        {msgTipo === 'erro' && <span>Email ou senha inválidos</span>}
                        {msgTipo === 'sucesso' && <span>Login realizado!</span>}
                    </div>

                    <div className="opcoes-login text-center">
                        <Link to="/usuariorecuperarsenha">Recuperar Senha</Link>
                        <span> | </span>
                        <Link to="/novousuario">Criar conta</Link>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Login;