import React, {useState, useEffect} from "react";
import './detalhes.css';
import { Link, useParams, Navigate} from 'react-router-dom';
import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';
import Navbar from "../../components/navbar";

import { PDFDownloadLink, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import * as XLSX from 'xlsx';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#e4e4e4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow:1
    }
});

function Detalhes() {

const [salao, setSalao ] = useState({});
const [urlImg, setUrlImg ] = useState('');
const usuarioLogado = useSelector(state => state.usuarioEmail);
const [carregando, setCarregando] = useState(1);
const [excluido, setExcluido] = useState(0);
const { id } = useParams();

function remover () {
    firebase.firestore().collection('salao').doc(id).delete().then(() => {
        setExcluido(1);
    })
}

useEffect(() => {
    if(carregando) {
        firebase.firestore().collection('salao').doc(id).get().then(resultado => {
            setSalao(resultado.data());

            firebase.firestore().collection('salao')
            .doc(id)
            .update({ visualizacoes: resultado.data().visualizacoes + 1 });

            firebase.storage()
            .ref(`imagens/${resultado.data().foto}`)
            .getDownloadURL()
            .then(url => {
                setUrlImg(url);
                setCarregando(0);
            });
        });
    }
}, [carregando, id]);

const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([salao]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Detalhes");
    XLSX.writeFile(workbook, "detalhes.xlsx");
};

function formatarData(valor) {
  if (!valor) return '';

  // Se for Timestamp do Firebase
  if (typeof valor === 'object' && valor.seconds) {
    return new Date(valor.seconds * 1000).toLocaleDateString('pt-BR');
  }

  // Se já for string
  return valor;
}

return (
<>
<Navbar />

{excluido ? <Navigate to='/' /> : null }

<div className="detalhes-container">

    {carregando ? (
        <div className="spinner-border text-light" role="status"></div>
    ) : (

    <div className="detalhes-card">

        {/* IMAGEM */}
        <img src={urlImg} className="img-banner" alt="Banner" />

        {/* VISUALIZAÇÕES */}
        <div className="text-right mt-2">
            <i className="fas fa-eye"></i> {salao.visualizacoes}
        </div>

        {/* NOME */}
        <h3 className="text-center mt-3">{salao.cliente}</h3>

        {/* BOX INFO */}
        <div className="row mt-4">

            <div className="col-md-4 text-center">
                <i className="fas fa-ticket-alt fa-2x"></i>
                <h5>Tipo</h5>
                <span>{salao.tipo}</span>
            </div>

            <div className="col-md-4 text-center">
                <i className="fas fa-calendar-alt fa-2x"></i>
                <h5>Data</h5>
               <span>{formatarData(salao.data)}</span>
            </div>

            <div className="col-md-4 text-center">
                <i className="fas fa-clock fa-2x"></i>
                <h5>Hora</h5>
                <span>{formatarData(salao.hora)}</span>
            </div>

        </div>

        {/* DETALHES */}
        <div className="mt-4 text-center">
            <h5>Detalhes do Serviço</h5>
            <p>{salao.detalhes}</p>
        </div>

        {/* BOTÕES */}
        {usuarioLogado === salao.usuario && (
            <>
                <Link to={`/editarservico/${id}`} className="btn btn-warning mt-3 mr-2">
                    Editar
                </Link>

                <button onClick={exportToExcel} className="btn btn-success mt-3 mr-2">
                    Excel
                </button>

                <button onClick={remover} className="btn btn-danger mt-3 mr-2">
                    Remover
                </button>
            </>
        )}

        {/* PDF */}
        <PDFDownloadLink document={<PDFDocument salao={salao} />} fileName="detalhes.pdf">
            {({ loading }) =>
                loading ? 'Carregando PDF...' :
                <button className="btn btn-light mt-3">Baixar PDF</button>
            }
        </PDFDownloadLink>

    </div>
    )}
</div>
</>
);
}

const PDFDocument = ({ salao }) => (
<Document>
    <Page style={styles.page}>
        <View style={styles.section}>
            <Text>{salao.cliente}</Text>
            <Text>{salao.tipo}</Text>
            <Text>{salao.data}</Text>
            <Text>{salao.hora}</Text>
            <Text>{salao.detalhes}</Text>
        </View>
    </Page>
</Document>
);

export default Detalhes;