import React, { useState, useEffect } from 'react';
import './home.css';
import firebase from '../../config/firebase';
import TipoServico from '../../components/tipo-servico/tipo-servico';
import Navbar from '../../components/navbar';

function Home() {

    const [salao, setSalao] = useState([]);
    const [pesquisa, setPesquisa] = useState('');

    useEffect(() => {
        async function carregarDados() {
            const resultado = await firebase.firestore().collection('salao').get();

            let listaservicos = [];

            resultado.docs.forEach(doc => {
                const dados = doc.data();
                const cliente = dados.cliente || '';

                if (cliente.toLowerCase().includes(pesquisa.toLowerCase())) {
                    listaservicos.push({
                        id: doc.id,
                        ...dados
                    });
                }
            });

            setSalao(listaservicos);
        }

        carregarDados();
    }, [pesquisa]);

    return (
        <div className="app-container">

            <Navbar />

            <div className="agendamentos-container">

                <div className="header-agendamentos">
                    <h2>CLIENTES</h2>

                    <input
                        type="text"
                        placeholder="Pesquisar pelo cliente"
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        className="input-busca"
                    />
                </div>

                <div className="lista-agendamentos">
                    {salao.length === 0 ? (
                        <p className="sem-resultados">Nenhum cliente encontrado</p>
                    ) : (
                        salao.map(item => (
                            <TipoServico
                                key={item.id}
                                id={item.id}
                                img={item.foto}
                                cliente={item.cliente}
                                telefone={item.telefone}
                                servico={item.servico}
                                tipo={item.tipo}
                                descricao={item.descricao}
                                profissional={item.profissional}
                                data={item.data}
                                hora={item.hora}
                                detalhes={item.detalhes}
                                visualizacoes={item.visualizacoes}
                            />
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}

export default Home;