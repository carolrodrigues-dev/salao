import React, { useState, useEffect } from 'react';
import './home.css';
import firebase from '../../config/firebase';
import TipoServico from '../../components/tipo-servico/tipo-servico';
import Navbar from '../../components/navbar';
import { useSelector } from 'react-redux';

function Home() {

    const [salao, setSalao] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const usuarioEmail = useSelector(
        state => state.usuarioEmail
    );

    const admin =
        usuarioEmail?.trim().toLowerCase() === 'admin@gmail.com';


    useEffect(() => {

        async function carregarDados() {

            const resultado = await firebase
                .firestore()
                .collection('salao')
                .get();

            let listaservicos = [];

            resultado.docs.forEach(doc => {

                const dados = doc.data();

                const cliente = dados.cliente || '';

                if (
                    cliente
                        .toLowerCase()
                        .includes(
                            pesquisa.toLowerCase()
                        )
                ) {

                    listaservicos.push({
                        id: doc.id,
                        ...dados
                    });

                }

            });

            setSalao(listaservicos);

            // DASHBOARD

            
        }

        carregarDados();

    }, [pesquisa]);

    return (

        <div className="app-container">

            <Navbar />

            <div className="agendamentos-container">

                <h1 className='titulo-home'>
    {admin
        ? 'PAINEL ADMINISTRATIVO'
        : 'MEUS AGENDAMENTOS'}
</h1>


                {/* BUSCA */}

                <div className="busca-container">

                    <i className="fas fa-search icone-busca"></i>

                    <input
                        type="text"
                        placeholder="Pesquisar cliente"
                        value={pesquisa}
                        onChange={(e) =>
                            setPesquisa(e.target.value)
                        }
                        className="input-busca"
                    />

                </div>

                {/* LISTA */}

                <div className="lista-agendamentos">

                    {salao.length === 0 ? (

                    <div className="sem-resultados">

                    <h3>Você ainda não possui agendamentos.</h3>

                    <p>
                    Clique em "Marcar Horário" para criar seu primeiro agendamento.
                    </p>

                    </div>

                    ) : (

                            salao.map(item => (

                                <TipoServico
                                    key={item.id}
                                    id={item.id}
                                    foto={item.foto}
                                    cliente={item.cliente}
                                    telefone={item.telefone}
                                    valor={item.valor}
                                    servico={item.servico}
                                    tipo={item.tipo}
                                    descricao={item.descricao}
                                    profissional={item.profissional}
                                    data={item.data}
                                    hora={item.hora}
                                    detalhes={item.detalhes}
                                    status={item.status}
                                />

                            ))

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default Home;