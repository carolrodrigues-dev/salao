import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

function Navbar() {

  const dispatch = useDispatch();

  const usuarioLogado = useSelector(
    state => state.usuarioLogado
  );

  const usuarioEmail = useSelector(
    state => state.usuarioEmail
  );

  const admin =
    usuarioEmail?.trim().toLowerCase()
    === 'admin@gmail.com';

  return (

    <nav className="navbar navbar-expand-lg">

      {/* ESQUERDA */}
      <div className='navbar-esquerda'>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fa-solid fa-bars text-white"></i>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          <ul className="navbar-nav">

            {/* AGENDAMENTOS */}
            <li className="nav-item">
              <Link
                className="nav-link ml-2"
                to="/home"
              >
                Agendamentos
              </Link>
            </li>

            {

            usuarioLogado ? (

              <>

                {/* MARCAR */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/servicosalao"
                  >
                    Marcar Horário
                  </Link>
                </li>

                {/* DASHBOARD */}
                {

                admin && (

                  <li className="nav-item">

                    <Link
                      className="nav-link"
                      to="/admin"
                    >
                      Dashboard
                    </Link>

                  </li>

                )

                }

                {/* SAIR */}
                <li className="nav-item">

                  <Link
                    className="nav-link"
                    to="/login"
                    onClick={() =>
                      dispatch({
                        type: 'LOG_OUT'
                      })
                    }
                  >
                    Sair
                  </Link>

                </li>

              </>

            ) : (

              <>

                <li className="nav-item">

                  <Link
                    className="nav-link"
                    to="/novousuario"
                  >
                    Cadastrar
                  </Link>

                </li>

                <li className="nav-item">

                  <Link
                    className="nav-link"
                    to="/login"
                  >
                    Login
                  </Link>

                </li>

              </>

            )

            }

          </ul>

        </div>

      </div>

      {/* DIREITA */}
      <div className='logo-navbar'>
        NEW LOOK BARBEARIA
      </div>

    </nav>

  );

}

export default Navbar;