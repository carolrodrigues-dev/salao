import React, { useState } from 'react';
import './tipo-servico.css';

function TipoServico({
    id,
    cliente,
    telefone,
    valor,
    descricao,
    tipo,
    profissional,
    data,
    hora,
    detalhes,
    status,
    foto,
    isAdmin,
    onDelete
})
{

    const [modalAberto, setModalAberto] = useState(false);
    const [statusAtual, setStatusAtual] = useState(status || 'Pendente');

    /* FORMATAR DATA */
    const formatarData = (valorData) => {

        if (!valorData) return '';

        if (valorData?.seconds) {

            return new Date(
                valorData.seconds * 1000
            ).toLocaleDateString('pt-BR');

        }

        if (valorData?.toDate) {

            return valorData
            .toDate()
            .toLocaleDateString('pt-BR');

        }

        return new Date(valorData)
        .toLocaleDateString('pt-BR');

    };

    /* STATUS CLASSE */
    const classeStatus = () => {

        if (statusAtual === 'Confirmado')
            return 'status-confirmado';

        if (statusAtual === 'Cancelado')
            return 'status-cancelado';

        return 'status-pendente';
    };

    /* STATUS TEXTO */
    const textoStatus = () => {

        if (statusAtual === 'Confirmado')
            return '🟢 Confirmado';

        if (statusAtual === 'Cancelado')
            return '🔴 Cancelado';

        return '🟡 Pendente';
    };

    const inicialCliente = cliente
        ? cliente.charAt(0).toUpperCase()
        : '?';

    const handleExcluir = () => {

        const confirmar = window.confirm(
            'Tem certeza que deseja excluir este agendamento?'
        );

        if (confirmar && onDelete) {
            onDelete(id);
        }
    };

    /* VALOR */
    const valorFormatado =
        valor !== undefined && valor !== null
            ? `R$ ${Number(valor).toFixed(2)}`
            : 'R$ 0.00';

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
                                onError={(e) => {

                                    e.target.style.display = 'none';

                                    e.target.nextSibling.style.display = 'flex';

                                }}
                            />

                        ) : null}

                        <div
                            className='avatar-fallback'
                            style={{
                                display: foto ? 'none' : 'flex'
                            }}
                        >
                            {inicialCliente}
                        </div>

                    </div>

                    {/* INFO */}
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


                        <div className='profissional-destaque'>

                        ✂️ Profissional responsável: <strong>{profissional}</strong>

                        </div>

                        <div className='info'>

                        <span>
                        <i className="fas fa-calendar-alt"></i>
                        {formatarData(data)} às {hora}
                        </span>

                        <span>
                        <i className="fas fa-phone"></i>
                        {telefone || '(31) 9****-9999'}
                        </span>

                        <span>
                        <i className="fas fa-dollar-sign"></i>
                        {valorFormatado}
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

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* MODAL */}
            {modalAberto && (

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
                                <strong>
                                    {formatarData(data)}
                                </strong>
                            </div>

                            <div className='item-modal'>
                                <span>Hora</span>
                                <strong>{hora}</strong>
                            </div>

                            <div className='item-modal'>
                                <span>Status</span>
                                <strong>{statusAtual}</strong>
                            </div>

                            <div className='item-modal'>
                                <span>Telefone</span>

                                <strong>
                                    {telefone || '(31) 99999-9999'}
                                </strong>
                            </div>

                            <div className='item-modal'>
                                <span>Valor</span>
                                <strong>{valorFormatado}</strong>
                            </div>


                            {/* AÇÕES */}
                            <div className='acoes-modal'>

                                <button
                                    className='btn-cancelar'
                                    onClick={() =>
                                        setStatusAtual('Cancelado')
                                    }
                                >
                                    Cancelar horário
                                </button>

                                {isAdmin && (

                                    <button
                                        className='btn-excluir'
                                        onClick={handleExcluir}
                                    >
                                        Excluir agendamento
                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}

export default TipoServico;