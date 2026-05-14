import React, { useState } from 'react';

import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';

import './calendario.css';

function CalendarioVisual({

    agendamentos,
    onSelecionarData

}) {

    const [data, setData] = useState(new Date());

    function selecionarData(novaData){

        setData(novaData);

        onSelecionarData(novaData);
    }

    function possuiAgendamento(date){

        return agendamentos?.some(item => {

            if(!item.data) return false;

            let dataAgendamento;

            if(item.data?.seconds){

                dataAgendamento =
                new Date(item.data.seconds * 1000);

            }

            else if(item.data?.toDate){

                dataAgendamento =
                item.data.toDate();

            }

            else{

                dataAgendamento =
                new Date(item.data);

            }

            return(

                dataAgendamento.getDate() ===
                date.getDate()

                &&

                dataAgendamento.getMonth() ===
                date.getMonth()

                &&

                dataAgendamento.getFullYear() ===
                date.getFullYear()

            );

        });

    }

    return (

        <div className='container-calendario'>

            <div className='calendario-box'>

                <h2 className='titulo-calendario'>
                    Calendário
                </h2>

                <Calendar

                    onChange={selecionarData}

                    value={data}

                    tileClassName={({ date, view }) => {

                        if(

                            view === 'month'

                            &&

                            possuiAgendamento(date)

                        ){

                            return 'dia-agendado';

                        }

                    }}

                />

            </div>

        </div>

    );

}

export default CalendarioVisual;