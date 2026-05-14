import React, { useState } from 'react';
import './tipo-servico.css';

function TipoServico({

    id,
    cliente,
    descricao,
    servico,
    tipo,
    profissional,
    data,
    hora,
    detalhes,
    visualizacoes,
    status,
    foto

}) {

    const [modalAberto, setModalAberto] = useState(false);

    const [statusAtual, setStatusAtual] = useState(
        status || 'Pendente'
    );

    const formatarData = (valor) => {

        if (!valor) return '';

        if (valor?.seconds) {

            return new Date(
                valor.seconds * 1000
            ).toLocaleDateString('pt-BR');

        }

        if (valor?.toDate) {

            return valor
            .toDate()
            .toLocaleDateString('pt-BR');

        }

        return valor;
    };

    /* STATUS */
    const classeStatus = () => {

        if(statusAtual === 'Confirmado'){
            return 'status-confirmado';
        }

        if(statusAtual === 'Cancelado'){
            return 'status-cancelado';
        }

        return 'status-pendente';
    };

    /* TEXTO STATUS */
    const textoStatus = () => {

        if(statusAtual === 'Confirmado'){
            return '🟢 Confirmado';
        }

        if(statusAtual === 'Cancelado'){
            return '🔴 Cancelado';
        }

        return '🟡 Pendente';
    };

    /* INICIAL */
    const inicialCliente = cliente
    ? cliente.charAt(0).toUpperCase()
    : '?';

    return (

        <>

        <div className='card-servico'>

            <div className='conteudo'>

                {/* AVATAR */}
                <div className='avatar-container'>

                    {foto ? (

                        <img
                            src={foto}
                            alt={cliente}
                            className='avatar-img'
                        />

                    ) : (

                        <div className='avatar-fallback'>
                            {inicialCliente}
                        </div>

                    )}

                </div>

                {/* DIREITA */}
                <div className='info-esquerda'>

                    <div className='topo-card'>

                        <h3 className='nome-cliente'>
                            {cliente}
                        </h3>

                        <span
                            className={`status-servico ${classeStatus()}`}
                        >
                            {textoStatus()}
                        </span>

                    </div>

                    <p className='descricao'>
                        {descricao}
                    </p>

                    <div className='info'>

                        <span>
                            <i className="fas fa-user"></i>
                            {profissional}
                        </span>

                        <span>
                            <i className="fas fa-calendar-alt"></i>
                            {formatarData(data)}
                        </span>

                        <span>
                            <i className="fas fa-clock"></i>
                            {hora}
                        </span>

                    </div>

                    <div className='rodape-card'>

                        <button
                            className='btn-detalhes'
                            onClick={() =>
                                setModalAberto(true)
                            }
                        >
                            Ver detalhes
                        </button>

                        <div className='lado-info'>

                            <span className='tipo'>
                                {tipo}
                            </span>

                            <span className='views'>
                                👁 {visualizacoes}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        {/* MODAL */}
        {

        modalAberto && (

            <div className='overlay-modal'>

                <div className='modal-detalhes'>

                    <button
                        className='fechar-modal'
                        onClick={() =>
                            setModalAberto(false)
                        }
                    >
                        ✕
                    </button>

                    <h2 className='titulo-modal'>
                        {cliente}
                    </h2>

                    <div className='modal-conteudo'>

                        <div className='item-modal'>
                            <span>Serviço</span>
                            <strong>{tipo}</strong>
                        </div>

                        <div className='item-modal'>
                            <span>Profissional</span>
                            <strong>{profissional}</strong>
                        </div>

                        <div className='item-modal'>
                            <span>Data</span>
                            <strong>{formatarData(data)}</strong>
                        </div>

                        <div className='item-modal'>
                            <span>Hora</span>
                            <strong>{hora}</strong>
                        </div>

                        <div className='item-modal'>
                            <span>Status</span>
                            <strong>{statusAtual}</strong>
                        </div>

                        <div className='item-modal descricao-modal'>
                            <span>Detalhes</span>
                            <p>{detalhes}</p>
                        </div>

                        {/* BOTÕES */}
                        <div className='acoes-modal'>

                            <button
                                className='btn-confirmar'
                                onClick={() =>
                                    setStatusAtual('Confirmado')
                                }
                            >
                                Confirmar horário
                            </button>

                            <button
                                className='btn-cancelar'
                                onClick={() =>
                                    setStatusAtual('Cancelado')
                                }
                            >
                                Cancelar horário
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        )

        }

        </>
    );
}

export default TipoServico;