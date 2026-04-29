import React from 'react';
import { Link } from 'react-router-dom';
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
    visualizacoes
}) {

    const formatarData = (valor) => {
        if (typeof valor === 'object' && valor?.seconds) {
            return new Date(valor.seconds * 1000).toLocaleString();
        }
        return valor;
    };

    return (
        <div className="card-servico">

            <div className="conteudo">

                <div className="topo">
                    <h3>{cliente}</h3>
                    <span className="tipo">{tipo}</span>
                </div>

                <p className="servico">{servico}</p>

                <p className="descricao">
                    {detalhes} {descricao}
                </p>

                <div className="info">
                    <span>👤 {profissional}</span>
                    <span>📅 {formatarData(data)}</span>
                    <span>⏰ {formatarData(hora)}</span>
                </div>

                <div className="rodape">
                    <Link to={`/detalhes/${id}`} className="btn-detalhes">
                        Ver detalhes
                    </Link>

                    <div className="views">
                        👁 {visualizacoes}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default TipoServico;