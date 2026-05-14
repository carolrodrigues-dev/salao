import React, {useState} from 'react';
import firebase from '../../config/firebase';
import 'firebase/auth';
import Navbar from '../../components/navbar';
import './usuario-novo.css';

function NovoUsuario () {

   
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [telefone, setTelefone] = useState();
    const [msgTipo, setMsgTipo] = useState();
    const [msg, setMsg] = useState();
    const [carregando, setCarregando] = useState();

   

    function cadastrar () {
        setCarregando(1);

       setMsgTipo(null);

       if(!email || !senha){
        setMsgTipo('erro')
        setMsg('Você precisa informar o email e senha para fazer o cadastro!')
        return;
       }
       
       firebase.auth().createUserWithEmailAndPassword(email,senha).then(resultado => {
        setCarregando(0);
        setMsgTipo('sucesso')
       }).catch(erro => { 
        console.log(JSON.stringify(erro))
       
        switch(erro.message)
            {
            case 'Password should be at least 6 characteres':
                setMsg('A senha dever ter pelo menos 6 caracteres!');
                break;
            case 'The email address is already in use by another account.':
                setMsg('Este já está sendo utilizado por outro usuário!');
                break;
            case 'The email address is badly formatted':
                setMsg('O formato do seu email é inválido!');
                break;
             default:
                setMsg('Não foi possivel cadastrar. tente novamente mais tarde!');
                break;
            }

       })
    }

 return(
    <>
    <Navbar/>
    <div className="form-cadastro">
        <form className= "text-center form-login mx-auto mt-5">
            <h1 className="h3 mb-3 text-black font-weight-bold">Cadastro</h1>

            
            <input onChange={(e) => setEmail (e.target.value) } type="email" className="form-control my-2" placeholder="Email" />
            <input onChange={(e) => setSenha (e.target.value) } type="password" className="form-control my-2" placeholder="Senha" />
            <input onChange={(e) => setTelefone (e.target.value) } type="text" className="form-control my-2" placeholder="Telefone" />
            
            {
                carregando ? <div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>
                : <button onClick= {cadastrar} type="button" className="btn btn-lg btn-block mt3 mb-5 btn-cadastro" >Cadastrar</button>
            
            }
            
            <div className="msg-login text-black text-center my-5">
                 {msgTipo === 'sucesso' && <span>Usuário cadastrado com sucesso!</span>}
                 {msgTipo === 'erro' && <span><strong>Ops!</strong> {msg} </span>}
                
            </div>

            

        </form>
    </div>
    </>
 )
}

export default NovoUsuario;