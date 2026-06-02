import React, { useEffect, useState } from 'react';
import firebase from '../../config/firebase';
import Navbar from '../../components/navbar';

function MeusAgendamentos() {

    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    const db = firebase.firestore();

    useEffect(() => {

        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {

            if (!user) {
                setLoading(false);
                return;
            }

            try {

                const resultado = await db
                    .collection('salao')
                    .where('userId', '==', user.uid)
                    .get();

                const lista = resultado.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setAgendamentos(lista);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }

        });

        return () => unsubscribe();

    }, [db]);

    function formatarData(data) {
        if (!data) return '';

        if (data?.toDate) {
            return data.toDate().toLocaleDateString();
        }

        return data;
    }

    function getStatusClass(status) {
        switch (status) {
            case 'Pendente':
                return 'status-pendente';
            case 'Confirmado':
                return 'status-confirmado';
            case 'Cancelado':
                return 'status-cancelado';
            default:
                return '';
        }
    }

    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <h2 className="mb-4">Meus Agendamentos</h2>

                {loading ? (
                    <p>Carregando agendamentos...</p>
                ) : agendamentos.length === 0 ? (
                    <p>Você ainda não possui agendamentos.</p>
                ) : (
                    <div className="lista-agendamentos">

                        {agendamentos.map(item => (
                            <div key={item.id} className="card-agendamento">

                                <h3>{item.tipo}</h3>

                                <p><strong>👤 Cliente:</strong> {item.cliente}</p>

                                <p><strong>👨‍💼 Profissional:</strong> {item.profissional}</p>

                                <p><strong>💰 Valor:</strong> R$ {Number(item.valor || 0).toFixed(2)}</p>

                                <p><strong>📅 Data:</strong> {formatarData(item.data)}</p>

                                <p><strong>⏰ Hora:</strong> {item.hora}</p>

                                <p>
                                    <strong>Status:</strong>{' '}
                                    <span className={getStatusClass(item.status)}>
                                        {item.status}
                                    </span>
                                </p>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </>
    );
}

export default MeusAgendamentos;