import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import firebase from '../../config/firebase';
import './admin.css';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

function Admin() {

    const [total, setTotal] = useState(0);
    const [confirmados, setConfirmados] = useState(0);
    const [pendentes, setPendentes] = useState(0);
    const [cancelados, setCancelados] = useState(0);
    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {

        firebase
            .firestore()
            .collection('salao')
            .get()

            .then((resultado) => {

                let totalAgendamentos = 0;
                let totalConfirmados = 0;
                let totalPendentes = 0;
                let totalCancelados = 0;
                let lista = [];

                resultado.docs.forEach(doc => {

                    const item = doc.data();

                    lista.push({
                        id: doc.id,
                        ...item
                    });

                    totalAgendamentos++;

                    if (item.status === 'Confirmado') totalConfirmados++;
                    if (item.status === 'Pendente') totalPendentes++;
                    if (item.status === 'Cancelado') totalCancelados++;

                });

                setTotal(totalAgendamentos);
                setConfirmados(totalConfirmados);
                setPendentes(totalPendentes);
                setCancelados(totalCancelados);
                setAgendamentos(lista);

            });

    }, []);

    // 📊 DADOS DO GRÁFICO
    const dadosGrafico = [
        { status: 'Confirmados', quantidade: confirmados },
        { status: 'Pendentes', quantidade: pendentes },
        { status: 'Cancelados', quantidade: cancelados }
    ];

    // 🟢 CONFIRMAR
    async function confirmarAgendamento(id) {

        try {
            await firebase
                .firestore()
                .collection('salao')
                .doc(id)
                .update({
                    status: 'Confirmado'
                });

            setAgendamentos(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, status: 'Confirmado' }
                        : item
                )
            );

            setConfirmados(prev => prev + 1);
            setPendentes(prev => prev - 1);

        } catch (error) {
            console.log(error);
        }
    }

    // 🗑️ EXCLUIR
    async function excluirAgendamento(id) {

        if (!window.confirm('Tem certeza que deseja excluir?')) return;

        try {
            await firebase
                .firestore()
                .collection('salao')
                .doc(id)
                .delete();

            setAgendamentos(prev =>
                prev.filter(item => item.id !== id)
            );

            setTotal(prev => prev - 1);

        } catch (error) {
            console.log(error);
        }
    }

    return (

        <>
            <Navbar />

            <div className='admin-container'>

                <h1 className='titulo-admin'>Dashboard Admin</h1>

                {/* CARDS */}
                <div className='cards-admin'>

                    <div className='card-admin'>
                        <h2>Total</h2>
                        <span>{total}</span>
                    </div>

                    <div className='card-admin'>
                        <h2>Confirmados</h2>
                        <span>{confirmados}</span>
                    </div>

                    <div className='card-admin'>
                        <h2>Pendentes</h2>
                        <span>{pendentes}</span>
                    </div>

                    <div className='card-admin'>
                        <h2>Cancelados</h2>
                        <span>{cancelados}</span>
                    </div>

                </div>

                {/* 📊 GRÁFICO DE BARRAS */}
                <div className='lista-agendamentos'>

                    <h2 className='subtitulo-admin'>
                        Gráfico de Status dos Agendamentos
                    </h2>

                    <div style={{ width: '100%', height: 300 }}>

                        <ResponsiveContainer>
                            <BarChart data={dadosGrafico}>

                                <XAxis dataKey="status" />
                                <YAxis />
                                <Tooltip />
                                <Legend />

                                <Bar
                                    dataKey="quantidade"
                                    fill="#d4af37"
                                />

                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </div>

                {/* LISTA */}
                <div className='lista-agendamentos'>

                    <h2 className='subtitulo-admin'>
                        Todos os Agendamentos
                    </h2>

                    {agendamentos.length === 0 ? (
                        <p>Nenhum agendamento encontrado.</p>
                    ) : (

                        agendamentos.map(item => (

                            <div key={item.id} className='agendamento-item'>

                                <div><strong>{item.cliente}</strong></div>
                                <div>{item.tipo}</div>
                                <div>{item.profissional}</div>

                                <div>
                                    {item.data?.toDate
                                        ? item.data.toDate().toLocaleString('pt-BR')
                                        : ''}
                                </div>

                                <div>{item.hora}</div>

                                <div>{item.status}</div>

                                <div className='botoes-acoes'>

                                    {item.status !== 'Confirmado' && (
                                        <button
                                            className='btn-confirmar'
                                            onClick={() => confirmarAgendamento(item.id)}
                                        >
                                            Confirmar
                                        </button>
                                    )}

                                    <button
                                        className='btn-excluir'
                                        onClick={() => excluirAgendamento(item.id)}
                                    >
                                        Excluir
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </>

    );
}

export default Admin;