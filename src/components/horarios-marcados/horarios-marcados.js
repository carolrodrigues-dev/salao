import React, { useState, useEffect } from 'react';
import './horario-marcados.css';
import { Link } from 'react-router-dom';
import Navbar from '../navbar';
import { useSelector } from 'react-redux';
import firebase from '../../config/firebase';
import TipoServico from '../tipo-servico/tipo-servico';

function HorarioMarcado({ match }) {

    const [salao, setSalao] = useState([]);
    const [pesquisa, setPesquisa] = useState('');

    useEffect(() => {

        let listaservicos = [];

        firebase.firestore().collection('salao').get().then((resultado) => {
            resultado.docs.forEach(doc => {
                if (doc.data().cliente.indexOf(pesquisa) >= 0) {
                    listaservicos.push({
                        id: doc.id,
                        ...doc.data()
                    });
                }
            });

            setSalao(listaservicos);
        });

    }, [pesquisa]);

    return (
        <>
            <Navbar />

            <div className='row p-5'>
                <h2 className='mx-auto pb-2'>CLIENTES</h2>

                <input
                    onChange={(e) => setPesquisa(e.target.value)}
                    type='text'
                    className='form-control text-center'
                    placeholder='Pesquisar Serviço pelo titulo'
                />
            </div>

            <div className='row p-3'>
               {salao.map(item => {

  const formatarData = (valor) => {
    if (!valor) return '';

    if (valor.toDate) {
      return valor.toDate().toLocaleString();
    }

    if (valor.seconds) {
      return new Date(valor.seconds * 1000).toLocaleString();
    }

    return valor;
  };

  return (
    <TipoServico
      key={item.id}
      id={item.id}
      cliente={item.cliente}
      servico={item.servico}
      tipo={item.tipo}
      descricao={item.descricao}
      profissional={item.profissional}

      data={formatarData(item.data)}
      hora={formatarData(item.hora)}
      detalhes={typeof item.detalhes === 'object' ? JSON.stringify(item.detalhes) : item.detalhes}
      visualizacoes={item.visualizacoes}

    />
  );
})}
            </div>
        </>
    );
}

export default HorarioMarcado;