import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import firebase from '../../config/firebase';
import './profissionais.css';

function Profissionais() {

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [especialidade, setEspecialidade] = useState('');
    const [valor, setValor] = useState('');
    const [listaProfissionais, setListaProfissionais] = useState([]);
    const [idEditar, setIdEditar] = useState(null);
    const [foto, setFoto] = useState(null);

    const db = firebase.firestore();
    const navigate = useNavigate();

    const usuarioEmail = useSelector(state => state.usuarioEmail);

    const admin =
        usuarioEmail?.trim().toLowerCase() === 'admin@gmail.com';

    useEffect(() => {

        async function carregarProfissionais() {

            try {

                const resultado = await db.collection('profissionais').get();

                const lista = resultado.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setListaProfissionais(lista);

            } catch (error) {
                console.log(error);
            }
        }

        carregarProfissionais();

    }, [db]);

    async function excluirProfissional(id) {

        const confirmar = window.confirm('Deseja realmente excluir este profissional?');
        if (!confirmar) return;

        try {

            await db.collection('profissionais').doc(id).delete();

            setListaProfissionais(prev =>
                prev.filter(item => item.id !== id)
            );

        } catch (error) {
            console.log(error);
            alert('Erro ao excluir profissional');
        }
    }

    function editarProfissional(item) {

        setNome(item.nome);
        setTelefone(item.telefone);
        setEspecialidade(item.especialidade);
        setValor(item.valor);
        setIdEditar(item.id);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function cadastrarProfissional() {

        if (!nome || !telefone || !especialidade || !valor) {
            alert('Preencha todos os campos');
            return;
        }

        try {

            let fotoURL = '';

            if (foto) {
                const storageRef = firebase
                    .storage()
                    .ref(`profissionais/${foto.name}`);

                await storageRef.put(foto);
                fotoURL = await storageRef.getDownloadURL();
            }

            if (idEditar) {

                await db.collection('profissionais').doc(idEditar).update({
                    nome,
                    telefone,
                    especialidade,
                    valor,
                    foto: fotoURL || undefined
                });

                setListaProfissionais(prev =>
                    prev.map(item =>
                        item.id === idEditar
                            ? {
                                ...item,
                                nome,
                                telefone,
                                especialidade,
                                valor,
                                foto: fotoURL || item.foto
                            }
                            : item
                    )
                );

                alert('Profissional atualizado!');
                setIdEditar(null);

            } else {

                const resultado = await db.collection('profissionais').add({
                    nome,
                    telefone,
                    especialidade,
                    valor,
                    foto: fotoURL,
                    status: 'Ativo',
                    criadoEm: new Date()
                });

                setListaProfissionais(prev => [
                    ...prev,
                    {
                        id: resultado.id,
                        nome,
                        telefone,
                        especialidade,
                        valor,
                        foto: fotoURL,
                        status: 'Ativo'
                    }
                ]);

                alert('Profissional cadastrado!');
            }

            setNome('');
            setTelefone('');
            setEspecialidade('');
            setValor('');
            setFoto(null);

        } catch (error) {
            console.log(error);
            alert('Erro ao salvar profissional');
        }
    }

    return (

        <div className='profissionais-container'>

            <div className='profissionais-box'>

                <button
                    className='btn-voltar'
                    onClick={() => navigate('/admin')}
                >
                    ← Voltar ao Dashboard
                </button>

                <h1 className='titulo-profissionais'>
                    Cadastro de Profissionais
                </h1>

                <p className='subtitulo-profissionais'>
                    Gerencie os profissionais do salão
                </p>

                <div className='contador-profissionais'>
                    <span>👨‍💼 Profissionais cadastrados</span>
                    <strong>{listaProfissionais.length}</strong>
                </div>

                <div className="estatisticas-profissionais">

    <div className="card-estatistica">
        <h3>{listaProfissionais.length}</h3>
        <p>Profissionais</p>
    </div>

    <div className="card-estatistica">
        <h3>
            R$ {
                listaProfissionais.length > 0
                    ? Math.round(
                        listaProfissionais.reduce(
                            (acc, item) =>
                                acc + Number(item.valor),
                            0
                        ) / listaProfissionais.length
                    )
                    : 0
            }
        </h3>
        <p>Ticket Médio</p>
    </div>

</div>
<div className='conteudo-profissionais'>

    {/* FORMULÁRIO */}
    <div className='formulario-profissionais'>

        <form>

            <input
                placeholder='Nome do profissional'
                className='input-profissionais'
                value={nome}
                onChange={e => setNome(e.target.value)}
            />

            <input
                placeholder='Telefone'
                className='input-profissionais'
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
            />

            <input
                placeholder='Especialidade'
                className='input-profissionais'
                value={especialidade}
                onChange={e => setEspecialidade(e.target.value)}
            />

            <input
                type='number'
                placeholder='Valor do serviço'
                className='input-profissionais'
                value={valor}
                onChange={e => setValor(e.target.value)}
            />

            {/* PREVIEW */}
            {foto && (
            <img
            src={URL.createObjectURL(foto)}
            alt='preview'
            className='preview-foto'
            />
           )}

            <input
                type='file'
                className='input-profissionais'
                onChange={e => setFoto(e.target.files[0])}
            />

            <button
                type='button'
                className='btn-salvar-profissional'
                onClick={cadastrarProfissional}
            >
                {idEditar
                    ? 'Atualizar Profissional'
                    : 'Salvar Profissional'}
            </button>

        </form>

    </div>

    {/* LISTA */}
    <div className='lista-profissionais'>

        <h2 className='titulo-lista'>
            Profissionais cadastrados
        </h2>

        {listaProfissionais.length === 0 ? (
            <p>Nenhum profissional cadastrado.</p>
        ) : (

            listaProfissionais.map(item => (

                <div
                    key={item.id}
                    className='card-profissional'
                >
                    

                    {item.foto && (
                        <img
                            src={item.foto}
                            className='foto-profissional'
                            alt='profissional'
                        />
                    )}

                    <h3>{item.nome}</h3>

                    <p>{item.telefone}</p>

                    <span>{item.especialidade}</span>

                    <h4 className='valor-servico'>
                        R$ {item.valor}
                    </h4>

                    <p className="status-profissional">
    {item.status || 'Ativo'}
</p>
<div className='acoes-profissional'>

    <button
        className='btn-editar-profissional'
        onClick={() => editarProfissional(item)}
    >
        Editar
    </button>

    <button
        className='btn-excluir-profissional'
        onClick={() => excluirProfissional(item.id)}
    >
        Excluir
    </button>

</div>

</div>

))

)}

</div>

</div>

</div>

</div>

);

}

export default Profissionais;