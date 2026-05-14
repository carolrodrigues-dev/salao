import React, { useState, useEffect } from 'react';
import './horario-marcados.css';
import Navbar from '../navbar';
import CalendarioVisual from '../calendario';
import firebase from '../../config/firebase';
import TipoServico from '../tipo-servico/tipo-servico';

console.log('COMPONENTE HORARIOS MARCADOS RENDERIZOU');

function HorarioMarcado() {

    const [salao, setSalao] = useState([]);
    const [todosServicos, setTodosServicos] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [dataSelecionada, setDataSelecionada] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    /* BUSCAR DADOS */
    useEffect(() => {

        let lista = [];

        firebase
        .firestore()
        .collection('salao')
        .get()

        .then((resultado) => {

            resultado.docs.forEach(doc => {

                lista.push({
                    id: doc.id,
                    ...doc.data()
                });

            });

            setTodosServicos(lista);
            setSalao(lista);

        });

    }, []);

    /* FILTROS */
useEffect(() => {

    let resultado = [...todosServicos];

    /* PESQUISA */
    resultado = resultado.filter(item =>

        item.cliente
        ?.toLowerCase()
        .includes(pesquisa.toLowerCase())

    );

    /* STATUS */
    if(filtroStatus !== 'Todos'){

        resultado = resultado.filter(item =>

            item.status === filtroStatus

        );

    }

    /* FILTRO DATA */
    if(dataSelecionada){

        const dataFormatada =
        new Date(dataSelecionada)
        .toLocaleDateString('pt-BR');

        resultado = resultado.filter(item => {

            let dataItem = '';

            if(item.data?.toDate){

                dataItem = item.data
                .toDate()
                .toLocaleDateString('pt-BR');

            } else if(item.data?.seconds){

                dataItem = new Date(
                    item.data.seconds * 1000
                ).toLocaleDateString('pt-BR');

            } else {

                dataItem = item.data;

            }

            return dataItem === dataFormatada;

        });

    }

    setSalao(resultado);

}, [
    pesquisa,
    filtroStatus,
    dataSelecionada,
    todosServicos
]);
   

    /* FORMATAR DATA */
    const formatarData = (valor) => {

        if (!valor) return '';

        if (valor.toDate) {

            return valor
            .toDate()
            .toLocaleDateString('pt-BR');

        }

        if (valor.seconds) {

            return new Date(
                valor.seconds * 1000
            ).toLocaleDateString('pt-BR');

        }

        return valor;
    };

    return (
        <>
    <Navbar />

    <CalendarioVisual
        agendamentos={salao}
        onSelecionarData={setDataSelecionada}
    />

    <div className='container-clientes'>

                <div className='topo-clientes'>

                    <h2 className='titulo-clientes'>
                        CLIENTES
                    </h2>

                    <div className='filtros-container'>

                        <input
                            onChange={(e) =>
                                setPesquisa(e.target.value)
                            }

                            type='text'

                            className='input-pesquisa'

                            placeholder='Pesquisar pelo cliente'
                        />

                        <select
                            className='select-status'

                            value={filtroStatus}

                            onChange={(e) =>
                                setFiltroStatus(e.target.value)
                            }
                        >

                            <option value='Todos'>
                                Todos
                            </option>

                            <option value='Pendente'>
                                Pendentes
                            </option>

                            <option value='Confirmado'>
                                Confirmados
                            </option>

                            <option value='Cancelado'>
                                Cancelados
                            </option>

                        </select>

                    </div>

                </div>

                <div className='grid-clientes'>

                    {salao.map(item => (

                        <TipoServico
                            key={item.id}
                            id={item.id}
                            cliente={item.cliente}
                            telefone={item.telefone}
                            servico={item.servico}
                            tipo={item.tipo}
                            descricao={item.descricao}
                            profissional={item.profissional}
                            data={formatarData(item.data)}
                            hora={item.hora}
                            detalhes={item.detalhes}
                            visualizacoes={item.visualizacoes}
                            status={item.status}
                        />

                    ))}

                    {salao.length === 0 && (

                        <div className='nenhum-resultado'>

                            Nenhum agendamento encontrado.

                        </div>

                    )}

                </div>

            </div>

        </>
    );
}

export default HorarioMarcado;