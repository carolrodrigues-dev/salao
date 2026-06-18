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
    ResponsiveContainer,
    Cell
} from 'recharts';

import { useNavigate } from 'react-router-dom';

function Admin() {

    const navigate = useNavigate();

    const [total, setTotal] = useState(0);
    const [confirmados, setConfirmados] = useState(0);
    const [pendentes, setPendentes] = useState(0);
    const [cancelados, setCancelados] = useState(0);
    const [agendamentos, setAgendamentos] = useState([]);
    const [finalizados, setFinalizados] = useState(0);
    const [buscaCliente, setBuscaCliente] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos');
    const [faturamento, setFaturamento] = useState(0);

    useEffect(() => {

        firebase.firestore()
            .collection('salao')
            .get()
            .then((resultado) => {
            

                let totalAgendamentos = 0;
                let totalConfirmados = 0;
                let totalPendentes = 0;
                let totalCancelados = 0;
                let totalFinalizados = 0;
                let totalFaturamento = 0;


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
                    if (item.status === 'Finalizado') {
                    totalFinalizados++;
                    totalFaturamento += Number(item.valor || 0);
                    }

                });

                setTotal(totalAgendamentos);
                setConfirmados(totalConfirmados);
                setPendentes(totalPendentes);
                setCancelados(totalCancelados);
                setAgendamentos(lista);
                setFinalizados(totalFinalizados);
                setFaturamento(totalFaturamento);

            });

    }, []);

    const dadosGrafico = [
    { status: 'Confirmados', quantidade: confirmados },
    { status: 'Pendentes', quantidade: pendentes },
    { status: 'Cancelados', quantidade: cancelados },
    { status: 'Finalizados', quantidade: finalizados }
];

    // CONFIRMAR
    async function confirmarAgendamento(id) {

        await firebase.firestore()
            .collection('salao')
            .doc(id)
            .update({ status: 'Confirmado' });

        setAgendamentos(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, status: 'Confirmado' }
                    : item
            )
        );
    }

    // CANCELAR
    async function cancelarAgendamento(id) {

        await firebase.firestore()
            .collection('salao')
            .doc(id)
            .update({ status: 'Cancelado' });

        setAgendamentos(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, status: 'Cancelado' }
                    : item
            )
        );
    }

    // FINALIZAR ✔ NOVO
    async function finalizarAgendamento(id) {

        await firebase.firestore()
            .collection('salao')
            .doc(id)
            .update({ status: 'Finalizado' });

        setAgendamentos(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, status: 'Finalizado' }
                    : item
            )
        );
    }

    // EXCLUIR
    async function excluirAgendamento(id) {

        if (!window.confirm('Tem certeza que deseja excluir?')) return;

        await firebase.firestore()
            .collection('salao')
            .doc(id)
            .delete();

        setAgendamentos(prev =>
            prev.filter(item => item.id !== id)
        );
    }

    // EDITAR
    function editarAgendamento(id) {
        navigate(`/editar/${id}`);
    }

    function abrirCadastroProfissionais() {
        navigate('/profissionais');
    }

    return (

        <>
            <Navbar />

            <div className='admin-container'>

                <div className='topo-admin'>
                    <h1 className='titulo-admin'>Dashboard Admin</h1>

                    <button
                        className='btn-admin-topo'
                        onClick={abrirCadastroProfissionais}
                    >
                        + Cadastrar Profissional
                    </button>
                </div>

                {/* CARDS */}
                <div className='cards-admin'>
                    <div className='card-admin'><h2>Total</h2><span>{total}</span></div>
                    <div className='card-admin'><h2>Confirmados</h2><span>{confirmados}</span></div>
                    <div className='card-admin'><h2>Pendentes</h2><span>{pendentes}</span></div>
                    <div className='card-admin'><h2>Cancelados</h2><span>{cancelados}</span></div>
                    <div className='card-admin'><h2>Finalizados</h2><span>{finalizados}</span></div>
                    <div className='card-admin'><h2>Faturamento</h2><span>R$ {faturamento}</span></div>
                </div>

               {/* GRÁFICO */}
<div className="grafico-admin">

    <div className="filtros-status">

    <button
    className={filtroStatus === 'Todos' ? 'ativo' : ''}
    onClick={() => setFiltroStatus('Todos')}>
    Todos
</button>

    <button
        className={filtroStatus === 'Confirmado' ? 'ativo' : ''}
        onClick={() => setFiltroStatus('Confirmado')}>
        Confirmados
    </button>

    <button
        className={filtroStatus === 'Pendente' ? 'ativo' : ''}
        onClick={() => setFiltroStatus('Pendente')}>
        Pendentes
    </button>

    <button
        className={filtroStatus === 'Cancelado' ? 'ativo' : ''}
        onClick={() => setFiltroStatus('Cancelado')}>
        Cancelados
    </button>

    <button
        className={filtroStatus === 'Finalizado' ? 'ativo' : ''}
        onClick={() => setFiltroStatus('Finalizado')}>
        Finalizados
    </button>

</div>

<p className="contador-resultados">
    📋 {
        agendamentos
            .filter(item =>
                item.cliente
                    ?.toLowerCase()
                    .includes(buscaCliente.toLowerCase())
            )
            .filter(item =>
                filtroStatus === 'Todos'
                    ? true
                    : item.status === filtroStatus
            ).length
    } agendamentos encontrados
</p>

    <h2>Resumo dos Agendamentos</h2>

    <ResponsiveContainer
        width="100%"
        height={300}
    >

        <BarChart data={dadosGrafico}>

            <XAxis dataKey="status" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
                dataKey="quantidade"
                name="Agendamentos"
            >

                {dadosGrafico.map((entry, index) => {

                    let cor = '#d4af37';

                    if (entry.status === 'Confirmados')
                        cor = '#2ecc71';

                    if (entry.status === 'Pendentes')
                        cor = '#d4af37';

                    if (entry.status === 'Cancelados')
                        cor = '#e74c3c';
                    if (entry.status === 'Finalizados')
                        cor = '#3498db';

                    return (
                        <Cell
                            key={`cell-${index}`}
                            fill={cor}
                        />
                    );

                })}

            </Bar>

        </BarChart>

    </ResponsiveContainer>

</div>


                {/* LISTA */}
                <div className='lista-agendamentos'>

    <div className="topo-agendamentos">

        <h2>Painel de Agendamentos</h2>

        <div className="filtro-agendamentos">
            <input
                type="text"
                placeholder="🔍 Buscar cliente..."
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
                className="input-busca"
            />
        </div>
    </div>

                  {agendamentos
    .filter(item =>
        item.cliente
            ?.toLowerCase()
            .includes(buscaCliente.toLowerCase())
    )
    .filter(item =>
        filtroStatus === 'Todos'
            ? true
            : item.status === filtroStatus
    )
    .map(item => (  

    <div
        key={item.id}
        className='agendamento-item'
    >

        <h3>{item.cliente}</h3>

        <p>
            <strong>Serviço:</strong> {item.tipo}
        </p>

        <p>
            <strong>Profissional:</strong> {item.profissional}
        </p>

        <p>
            <strong>Horário:</strong> {item.hora}
        </p>

        <div
    className={`badge-status status-${item.status?.toLowerCase()}`}
     >
    {item.status}
     </div>

        <div className='botoes-acoes'>

            <button
                className='btn-confirmar'
                onClick={() => confirmarAgendamento(item.id)}
            >
                Confirmar
            </button>

            <button
                className='btn-editar'
                onClick={() => editarAgendamento(item.id)}
            >
                Editar
            </button>

            <button
                className='btn-cancelar'
                onClick={() => cancelarAgendamento(item.id)}
            >
                Cancelar
            </button>

            {item.status !== 'Finalizado' && (
                <button
                    className='btn-finalizar'
                    onClick={() => finalizarAgendamento(item.id)}
                >
                    Finalizar
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

))}

                </div>

            </div>
        </>
    );
}

export default Admin;