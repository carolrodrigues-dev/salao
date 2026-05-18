import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import './servico-salao.css';
import Navbar from '../../components/navbar/';
import firebase from '../../config/firebase';

function ServicoSalao() {

    const [carregando, setCarregando] = useState(false);
    const [msgTipo, setMsgTipo] = useState();

    const [cliente, setCliente] = useState('');
    const [tipo, setTipo] = useState('');
    const [valor, setValor] = useState(0);
    const [detalhes, setDetalhes] = useState('');
    const [profissional, setProfissional] = useState('');
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');
    const [telefone, setTelefone] = useState('');

    const [fotoAtual, setFotoAtual] = useState();
    const [fotoNova, setFotoNova] = useState();

    const usuarioEmail = useSelector(state => state.usuarioEmail);

    const { id } = useParams();

    const navigate = useNavigate();

    const storage = firebase.storage();
    const db = firebase.firestore();

    /* SERVIÇOS */
    const servicos = [

        {
            nome: "Corte masculino",
            valor: 30,
            profissional: "Rafael Costa"
        },

        {
            nome: "Corte infantil",
            valor: 25,
            profissional: "Thiago Almeida"
        },

        {
            nome: "Corte degradê (fade)",
            valor: 40,
            profissional: "Bruno Henrique"
        },

        {
            nome: "Corte tesoura",
            valor: 35,
            profissional: "Rafael Costa"
        },

        {
            nome: "Barba simples",
            valor: 20,
            profissional: "Thiago Almeida"
        },

        {
            nome: "Barba completa",
            valor: 30,
            profissional: "Bruno Henrique"
        },

        {
            nome: "Design de barba",
            valor: 25,
            profissional: "Rafael Costa"
        },

        {
            nome: "Sobrancelha na navalha",
            valor: 15,
            profissional: "Thiago Almeida"
        },

        {
            nome: "Limpeza de pele",
            valor: 50,
            profissional: "Bruno Henrique"
        }

    ];

    useEffect(() => {

        if (id) {

            firebase.firestore()
                .collection('salao')
                .doc(id)
                .get()

                .then(resultado => {

                    const doc = resultado.data();

                    setCliente(doc.cliente || '');
                    setTipo(doc.tipo || '');
                    setValor(Number(doc.valor) || 0);
                    setDetalhes(doc.detalhes || '');
                    setProfissional(doc.profissional || '');
                    setData(doc.data || '');
                    setHora(doc.hora || '');
                    setTelefone(doc.telefone || '');
                    setFotoAtual(doc.foto || null);

                });

        }

    }, [id]);

    /* ATUALIZAR */
    function atualizar() {

        setMsgTipo(null);
        setCarregando(true);

        const atualizarFirestore = () => {

            db.collection('salao')
                .doc(id)
                .update({

                    cliente,
                    tipo,
                    valor: Number(valor),
                    detalhes,
                    data,
                    hora,
                    profissional,
                    telefone,
                    foto: fotoNova ? fotoNova.name : fotoAtual

                })
                .then(() => {

                    setMsgTipo('sucesso');
                    setCarregando(false);

                })
                .catch(() => {

                    setMsgTipo('erro');
                    setCarregando(false);

                });

        };

        if (fotoNova) {

            storage.ref(`imagens/${fotoNova.name}`)
                .put(fotoNova)
                .then(() => atualizarFirestore());

        } else {

            atualizarFirestore();

        }
    }

    /* CADASTRAR */
    async function cadastrar() {

        setMsgTipo(null);

        if (!cliente || !tipo || !profissional || !data || !hora) {

            setMsgTipo('erro');
            return;

        }

        setCarregando(true);

        try {

            /* UPLOAD FOTO */
            if (fotoNova) {

                await storage
                    .ref(`imagens/${fotoNova.name}`)
                    .put(fotoNova);

            }

            /* SALVAR FIREBASE */
            await db.collection('salao').add({

                cliente,
                tipo,
                valor: Number(valor),
                detalhes,
                data,
                hora,
                profissional,
                telefone,

                foto: fotoNova ? fotoNova.name : null,

                usuario: usuarioEmail,
                visualizacoes: 0,
                publico: 1,
                criacao: new Date(),
                status: 'Pendente'

            });

            setMsgTipo('sucesso');

        } catch (error) {

            console.log(error);

            setMsgTipo('erro');

        } finally {

            setCarregando(false);

        }
    }

    return (

        <>
            <Navbar />

            <div className='col-12 mt-5 formulario-container'>

                {/* BOTÃO FECHAR */}
                <button
                    className='btn-fechar-pagina'
                    onClick={() => navigate('/home')}
                >
                    ✕
                </button>

                <div className='row'>

                    <h3 className='mx-auto font-weigth-bold'>

                        {id
                            ? 'ATUALIZAR SERVIÇO'
                            : 'AGENDAR HORARIO'}

                    </h3>

                <p className='subtitulo-formulario'>
                Sistema inteligente de agendamento para barbearias
                </p>

                </div>

                <form>

                    {/* CLIENTE */}
                    <input
                        value={cliente}
                        onChange={e =>
                            setCliente(e.target.value)
                        }
                        className='form-control'
                        placeholder='Cliente'
                    />

                    {/* TELEFONE */}
                    <input
                        value={telefone}
                        onChange={e =>
                            setTelefone(e.target.value)
                        }
                        className='form-control mt-2'
                        placeholder='Telefone'
                    />

                    {/* SERVIÇO */}
                    <select
                        value={tipo}
                        onChange={(e) => {

                            const servicoSelecionado =
                                servicos.find(
                                    s => s.nome === e.target.value
                                );

                            setTipo(e.target.value);

                            setValor(
                                Number(servicoSelecionado?.valor) || 0
                            );

                            setProfissional(
                                servicoSelecionado?.profissional || ''
                            );

                        }}
                        className='form-control mt-2'
                    >

                        <option value="">
                            Selecione um serviço
                        </option>

                        {servicos.map((s, i) => (

                            <option
                                key={i}
                                value={s.nome}
                            >
                                {s.nome}
                            </option>

                        ))}

                    </select>

                    {/* VALOR */}
                    <input
                        value={
                            valor
                                ? Number(valor).toFixed(2)
                                : '0.00'
                        }
                        readOnly
                        className='form-control mt-2'
                        placeholder='Valor'
                    />

                    {/* PROFISSIONAL */}
                    <input
                        value={profissional}
                        readOnly
                        className='form-control mt-2'
                        placeholder='Profissional'
                    />

                    {/* DATA */}
                    <input
                        type='date'
                        value={data}
                        onChange={e =>
                            setData(e.target.value)
                        }
                        className='form-control mt-2'
                    />

                    {/* HORA */}
                    <input
                        type='time'
                        value={hora}
                        onChange={e =>
                            setHora(e.target.value)
                        }
                        className='form-control mt-2'
                    />

                    {/* BOTÃO */}
                    <button
                        type='button'
                        className='btn-agendar mt-3'
                        onClick={id ? atualizar : cadastrar}
                        disabled={carregando}
                    >

                        {carregando
                            ? 'Salvando...'
                            : id
                            ? 'Atualizar'
                            : 'Agendar'}

                    </button>

                </form>

                {msgTipo === 'sucesso' && (

                    <p className='msg-sucesso mt-2'>
                    Horário salvo com sucesso!
                    </p>

                )}

                {msgTipo === 'erro' && (

                    <p className='text-danger mt-2'>
                        Preencha todos os campos obrigatórios!
                    </p>

                )}

            </div>
        </>
    );
}

export default ServicoSalao;