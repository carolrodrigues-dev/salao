import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import './servico-salao.css';

import Navbar from '../../components/navbar/';

import firebase from '../../config/firebase';

function ServicoSalao() {

    const [carregando, setCarregando] = useState();
    const [msgTipo, setMsgTipo] = useState();

    const [cliente, setCliente] = useState();
    const [tipo, setTipo] = useState();
    const [detalhes, setDetalhes] = useState();
    const [profissional, setProfissional] = useState();
    const [data, setData] = useState();
    const [hora, setHora] = useState();
    const [telefone, setTelefone] = useState();

    const [fotoAtual, setFotoAtual] = useState();
    const [fotoNova, setFotoNova] = useState();

    const usuarioEmail = useSelector(
        state => state.usuarioEmail
    );

    const { id } = useParams();

    const storage = firebase.storage();
    const db = firebase.firestore();

    useEffect(() => {

        if(id){

            firebase
            .firestore()
            .collection('salao')
            .doc(id)
            .get()

            .then(resultado => {

                setCliente(resultado.data().cliente);
                setTipo(resultado.data().tipo);
                setDetalhes(resultado.data().detalhes);
                setProfissional(resultado.data().profissional);
                setData(resultado.data().data);
                setHora(resultado.data().hora);
                setTelefone(resultado.data().telefone);

                setFotoAtual(resultado.data().foto);

            });

        }

    }, [carregando, id]);

    /* ATUALIZAR */
    function atualizar() {

        setMsgTipo(null);
        setCarregando(1);

        if(fotoNova){

            storage
            .ref(`imagens/${fotoNova.name}`)
            .put(fotoNova);

        }

        db.collection('salao')
        .doc(id)

        .update({

            cliente: cliente,

            tipo: tipo,

            detalhes: detalhes,

            data: data,

            hora: hora,

            profissional: profissional,

            telefone: telefone,

            foto: fotoNova
            ? fotoNova.name
            : fotoAtual

        })

        .then(() => {

            setMsgTipo('sucesso');
            setCarregando(0);

        })

        .catch(() => {

            setMsgTipo('erro');
            setCarregando(0);

        });

    }

    /* CADASTRAR */
    function cadastrar() {

        setMsgTipo(null);

        /* VALIDAR FOTO */
        if(!fotoNova){

            setMsgTipo('erro');
            return;

        }

        setCarregando(1);

        storage
        .ref(`imagens/${fotoNova.name}`)
        .put(fotoNova)

        .then(() => {

            db.collection('salao')

            .add({

                cliente: cliente,

                tipo: tipo,

                detalhes: detalhes,

                data: data,

                hora: hora,

                profissional: profissional,

                telefone: telefone,

                foto: fotoNova.name,

                usuario: usuarioEmail,

                visualizacoes: 0,

                publico: 1,

                criacao: new Date(),

                status: 'Pendente'

            })

            .then(() => {

                setMsgTipo('sucesso');
                setCarregando(0);

            })

            .catch(() => {

                setMsgTipo('erro');
                setCarregando(0);

            });

        });

    }

    return (

        <>

        <Navbar />

        <div className='col-12 mt-5'>

            <div className='row'>

                <h3 className='mx-auto font-weigth-bold'>

                    {id
                    ? 'ATUALIZAR SERVIÇO'
                    : 'AGENDAR HORARIO'}

                </h3>

                <i className="bi bi-clock"></i>

            </div>

            <form>

                {/* CLIENTE */}
                <div className='form-group'>

                    <label>Cliente</label>

                    <input
                        onChange={(e) =>
                            setCliente(e.target.value)
                        }

                        type='text'

                        className='form-control'

                        value={cliente && cliente}
                    />

                </div>

                {/* TELEFONE */}
                <div className='form-group'>

                    <label>Telefone</label>

                    <input
                        onChange={(e) =>
                            setTelefone(e.target.value)
                        }

                        type='text'

                        className='form-control'

                        value={telefone && telefone}
                    />

                </div>





                {/* SERVIÇO */}
                <div className='form-group'>

                    <label>Tipo do serviço</label>

                    <select
                        onChange={(e) =>
                            setTipo(e.target.value)
                        }

                        className='form-control'

                        value={tipo && tipo}
                    >

                        <option disabled selected value>
                            -- Selecione um serviço --
                        </option>

                        <option>Corte de Cabelo</option>
                        <option>Tintura</option>
                        <option>Tratamento capilar</option>
                        <option>Alisamento</option>
                        <option>Progressiva</option>
                        <option>Mechas</option>
                        <option>Luzes</option>
                        <option>Reflexos</option>
                        <option>Manicure</option>
                        <option>Pedicure</option>
                        <option>Manicure e Pedicure</option>

                    </select>

                </div>

                {/* DESCRIÇÃO */}
                <div className='form-group'>

                    <label>Descrição do serviço:</label>

                    <textarea
                        onChange={(e) =>
                            setDetalhes(e.target.value)
                        }

                        className='form-control'

                        rows="3"

                        value={detalhes && detalhes}
                    />

                </div>

                {/* PROFISSIONAL */}
                <div className='form-group'>

                    <label>Profissional</label>

                    <select
                        onChange={(e) =>
                            setProfissional(e.target.value)
                        }

                        className='form-control'

                        value={profissional && profissional}
                    >

                        <option disabled selected value>
                            -- Selecione um profissional --
                        </option>

                        <option>Romeu Felipe</option>
                        <option>Letícia Rigolim</option>
                        <option>Washington Nunnes</option>
                        <option>Charlem Strelow</option>
                        <option>Sônia Lopes</option>

                    </select>

                </div>

                {/* DATA */}
                <div className='form-group row'>

                    <div className='col-3'>

                        <label>Data:</label>

                        <input
                            onChange={(e) =>
                                setData(e.target.value)
                            }

                            type='date'

                            className='form-control'

                            value={data && data}
                        />

                    </div>

                </div>

                {/* HORA */}
                <div className='form-group row'>

                    <div className='col-3'>

                        <label>Hora:</label>

                        <input
                            onChange={(e) =>
                                setHora(e.target.value)
                            }

                            type='time'

                            className='form-control'

                            value={hora && hora}
                        />

                    </div>

                </div>

                {/* FOTO */}
                <div className='form-group'>

                    <label>

                        Upload da foto

                        {id
                        ? ' (Se quiser manter a mesma foto não precisa escolher um novo arquivo)'
                        : null}

                    </label>

                    <input
                        onChange={(e) =>
                            setFotoNova(e.target.files[0])
                        }

                        type='file'

                        className='form-control'
                    />

                </div>

                {/* BOTÃO */}
                <div className='row'>

                    {

                    carregando > 0

                    ? (

                        <div
                            className="spinner-border text-success mx-auto"
                            role="status"
                        >

                            <span className="sr-only">
                                Loading...
                            </span>

                        </div>

                    )

                    : (

                        <button
                            onClick={
                                id
                                ? atualizar
                                : cadastrar
                            }

                            type='button'

                            className='btn btn-lg btn-block mt-3 mb-5 btn-cadastro'
                        >

                            {id
                            ? 'ATUALIZAR SERVIÇO'
                            : 'AGENDAR SERVIÇO'}

                        </button>

                    )

                    }

                </div>

            </form>

            {/* MENSAGENS */}
            <div className="msg-login texte-white text-center mt-2">

                {msgTipo === 'sucesso' && (

                    <span>
    
                        Horario Marcado
                    </span>

                )}

                {msgTipo === 'erro' && (

                    <span>
                        <strong>Ops!</strong>
                        Preencha todos os campos e selecione uma foto.
                    </span>

                )}

            </div>

        </div>

        </>

    );
}

export default ServicoSalao;