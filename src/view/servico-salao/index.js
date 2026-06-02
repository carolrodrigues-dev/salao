import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import './servico-salao.css';
import Navbar from '../../components/navbar/';
import firebase from '../../config/firebase';

function ServicoSalao() {

    const [listaProfissionais, setListaProfissionais] = useState([]);
    const [horariosOcupados, setHorariosOcupados] = useState([]);

    const [carregando, setCarregando] = useState(false);
    const [msgTipo, setMsgTipo] = useState('');

    const [cliente, setCliente] = useState('');
    const [tipo, setTipo] = useState('');
    const [valor, setValor] = useState(0);
    const [detalhes, setDetalhes] = useState('');
    const [profissional, setProfissional] = useState('');
    const [data, setData] = useState('');
    const [telefone, setTelefone] = useState('');

    const [fotoAtual, setFotoAtual] = useState();
    const [fotoNova] = useState();

    const [horarioSelecionado, setHorarioSelecionado] = useState('');

    const usuarioEmail = useSelector(state => state.usuarioEmail);

    const { id } = useParams();
    const navigate = useNavigate();

    const storage = firebase.storage();
    const db = firebase.firestore();

    const usuarioLogado = firebase.auth().currentUser;

    /* =========================
       HORÁRIOS AUTOMÁTICOS
    ========================= */
    const gerarHorarios = () => {

        const horarios = [];
        let hora = 8;
        let minuto = 0;

        while (hora < 18) {

            const h = String(hora).padStart(2, '0');
            const m = String(minuto).padStart(2, '0');

            horarios.push(`${h}:${m}`);

            minuto += 30;

            if (minuto === 60) {
                minuto = 0;
                hora++;
            }
        }

        return horarios;
    };

    /* =========================
       BUSCAR HORÁRIOS OCUPADOS
    ========================= */
    useEffect(() => {

        async function buscarHorariosOcupados() {

            if (!data || !profissional) {
                setHorariosOcupados([]);
                return;
            }

            const dataFormatada = new Date(data + 'T12:00:00');

            const resultado = await db
                .collection('salao')
                .where('data', '==', dataFormatada)
                .where('profissional', '==', profissional)
                .get();

            const ocupados = resultado.docs.map(doc => doc.data().hora);

            setHorariosOcupados(ocupados);
        }

        buscarHorariosOcupados();

    }, [data, profissional, db]);

    /* =========================
       CARREGAR PROFISSIONAIS
    ========================= */

    useEffect(() => {

        async function carregarProfissionais() {

            try {

                const resultado = await db.collection('profissionais').get();

                let lista = [];

                resultado.docs.forEach(doc => {
                    lista.push({ id: doc.id, ...doc.data() });
                });

                setListaProfissionais(lista);

            } catch (error) {
                console.log(error);
            }
        }

        carregarProfissionais();

        /* =========================
           EDITAR
        ========================= */

        if (id) {

            db.collection('salao')
                .doc(id)
                .get()
                .then(resultado => {

                    const doc = resultado.data();

                    setCliente(doc.cliente || '');
                    setTipo(doc.tipo || '');
                    setValor(Number(doc.valor) || 0);
                    setDetalhes(doc.detalhes || '');
                    setProfissional(doc.profissional || '');
                    setTelefone(doc.telefone || '');

                    setHorarioSelecionado(doc.hora || '');

                    setData(
                        doc.data
                            ? doc.data.toDate().toISOString().split('T')[0]
                            : ''
                    );

                    setFotoAtual(doc.foto || null);

                });
        }

    }, [id, db]);

    /* =========================
       CADASTRAR
    ========================= */

    async function cadastrar() {

        setMsgTipo('');

        if (!cliente || !tipo || !profissional || !data || !horarioSelecionado) {
            setMsgTipo('erro');
            return;
        }

        setCarregando(true);

        try {

            const dataFormatada = new Date(data + 'T12:00:00');

            const agendamentoExistente = await db
                .collection('salao')
                .where('data', '==', dataFormatada)
                .where('hora', '==', horarioSelecionado)
                .where('profissional', '==', profissional)
                .get();

            if (!agendamentoExistente.empty) {
                setMsgTipo('horario-ocupado');
                setCarregando(false);
                return;
            }

            let fotoURL = null;

            if (fotoNova) {
                const storageRef = storage.ref(`imagens/${fotoNova.name}`);
                await storageRef.put(fotoNova);
                fotoURL = await storageRef.getDownloadURL();
            }

            await db.collection('salao').add({

                cliente,
                tipo,
                valor: Number(valor),
                detalhes,
                data: dataFormatada,
                hora: horarioSelecionado,
                profissional,
                telefone,
                foto: fotoURL,

                usuario: usuarioEmail,
                userId: usuarioLogado?.uid,

                status: 'Pendente',
                criacao: new Date()

            });

            setMsgTipo('sucesso');

        } catch (error) {
            console.log(error);
            setMsgTipo('erro');
        } finally {
            setCarregando(false);
        }
    }

    /* =========================
       ATUALIZAR
    ========================= */

    async function atualizar() {

        setMsgTipo('');
        setCarregando(true);

        try {

            const dataFormatada = new Date(data + 'T12:00:00');

            const agendamentoExistente = await db
                .collection('salao')
                .where('data', '==', dataFormatada)
                .where('hora', '==', horarioSelecionado)
                .where('profissional', '==', profissional)
                .get();

            const horarioOcupado = agendamentoExistente.docs.find(doc => doc.id !== id);

            if (horarioOcupado) {
                setMsgTipo('horario-ocupado');
                setCarregando(false);
                return;
            }

            let fotoURL = fotoAtual;

            if (fotoNova) {
                const storageRef = storage.ref(`imagens/${fotoNova.name}`);
                await storageRef.put(fotoNova);
                fotoURL = await storageRef.getDownloadURL();
            }

            await db.collection('salao').doc(id).update({

                cliente,
                tipo,
                valor: Number(valor),
                detalhes,
                data: dataFormatada,
                hora: horarioSelecionado,
                profissional,
                telefone,
                foto: fotoURL

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

                <button
                    className='btn-fechar-pagina'
                    onClick={() => navigate('/home')}
                >
                    ✕
                </button>

                <h3>
                    {id ? 'ATUALIZAR SERVIÇO' : 'AGENDAR HORÁRIO'}
                </h3>

                <form>

                    <input
                        value={cliente}
                        onChange={e => setCliente(e.target.value)}
                        className='form-control'
                        placeholder='Cliente'
                    />

                    <input
                        value={telefone}
                        onChange={e => setTelefone(e.target.value)}
                        className='form-control mt-2'
                        placeholder='Telefone'
                    />

                    <select
                        value={tipo}
                        onChange={e => {
                            setTipo(e.target.value);
                            setProfissional('');
                            setValor(0);
                        }}
                        className='form-control mt-2'
                    >
                        <option value=''>Selecione um serviço</option>
                        {[...new Set(listaProfissionais.map(p => p.especialidade))].map((servico, i) => (
                            <option key={i} value={servico}>{servico}</option>
                        ))}
                    </select>

                    <select
                        value={profissional}
                        onChange={e => {
                            const prof = listaProfissionais.find(p => p.nome === e.target.value);
                            setProfissional(e.target.value);

                            if (prof) setValor(Number(prof.valor) || 0);
                        }}
                        className='form-control mt-2'
                    >
                        <option value=''>Selecione um profissional</option>

                        {listaProfissionais
                            .filter(p => p.especialidade === tipo)
                            .map(p => (
                                <option key={p.id} value={p.nome}>{p.nome}</option>
                            ))}
                    </select>

                    <input
                        value={valor ? Number(valor).toFixed(2) : '0.00'}
                        readOnly
                        className='form-control mt-2'
                    />

                    <input
                        type='date'
                        value={data}
                        onChange={e => setData(e.target.value)}
                        className='form-control mt-2'
                    />

                    {/* HORÁRIOS (FILTRADOS) */}
                    <div className="horarios-container">

                        <label>Selecione um horário:</label>

                        <div className="horarios-grid">

                            {gerarHorarios()
                                .filter(h => !horariosOcupados.includes(h))
                                .map((h, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className={`horario-btn ${horarioSelecionado === h ? 'ativo' : ''}`}
                                        onClick={() => setHorarioSelecionado(h)}
                                    >
                                        {h}
                                    </button>
                                ))}

                        </div>

                    </div>

                    <button
                        type='button'
                        className='btn-agendar mt-3'
                        onClick={id ? atualizar : cadastrar}
                        disabled={carregando}
                    >
                        {carregando ? 'Salvando...' : id ? 'Atualizar' : 'Agendar'}
                    </button>

                </form>

                {msgTipo === 'sucesso' && <p className='msg-sucesso'>Horário salvo com sucesso!</p>}
                {msgTipo === 'horario-ocupado' && <p className='msg-horario-ocupado'>Horário já ocupado.</p>}
                {msgTipo === 'erro' && <p className='text-danger'>Preencha todos os campos!</p>}

            </div>
        </>
    );
}

export default ServicoSalao;