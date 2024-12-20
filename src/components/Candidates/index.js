import React, { useEffect, useState } from "react";

import "./style.css";
import { Card } from "react-bootstrap";
import { BsArrowLeftSquare } from "react-icons/bs";
import { IoIosPeople, IoMdHeartEmpty, IoMdEye  } from "react-icons/io";
import { TbFileDescription } from "react-icons/tb";
import { AiOutlineStar } from "react-icons/ai";
import { IconContext } from "react-icons";
import { TiDeleteOutline } from "react-icons/ti";
import { BsPersonCircle } from "react-icons/bs";
import DataTable from "react-data-table-component";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { Link, useLocation } from "react-router-dom";
import {
  findUserByUid,
  pushNotification,
  updateUser,
} from "../../services/UserService";
import { updateOffer } from "../../services/OfferService";
import Modal from "react-bootstrap/Modal";
import io from 'socket.io-client';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
// import  { Document, Page,pdfjs } from "react-pdf";


// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();

// Conectar al servidor de Socket.IO
//const socket = io('http://localhost:5000')

const Candidates = () => {
  const { state } = useLocation();
  const [refresh, setRefresh] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [show, setShow] = useState(false);
  /*Prueba de chat*/
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);


  const [scale, setScale] = useState(1.0); // Estado para el nivel de zoom

  const increaseZoom = () => setScale((prevScale) => prevScale + 0.2);
  const decreaseZoom = () => setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  const [cvUrl, setCvUrl] = useState(candidate?.cv);
  
  // useEffect(() => {
  //   // Escuchar los eventos desde el servidor
  //   socket.on('send name', (username) => {
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { type: 'name', content: `${username}:` },
  //     ]);
  //   });

  //   socket.on('send message', (chat) => {
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { type: 'message', content: chat },
  //     ]);
  //   });

  //   return () => {
  //     // Limpiar los listeners cuando el componente se desmonta
  //     socket.off('send name');
  //     socket.off('send message');
  //   };
  // }, []);

  /******** */


  useEffect(() => {
    setCvUrl(candidate?.cv);
  }, [candidate]);




  function handleShow(candidateSelected) {
    setShow(true);
    setCandidate(candidateSelected);
  }

  const handleMatch = async (element) => {
    const user = await findUserByUid(element.uid);
    await pushNotification(user.token, state);
    state.interestedUsers.forEach((interestedUser) => {
      if (interestedUser.uid === element.uid) {
        interestedUser.status = "match";
      }
    });

    const offerUpdate = {
      id: state.id,
      interestedUsers: state.interestedUsers,
    };

    await updateOffer(offerUpdate);

    const userUpdate = {
      id: user.id,
      offersMatch: [...user.offersMatch, state],
    };

    await updateUser(userUpdate);

    setRefresh(!refresh);
  };

  const handleNoMatch = async (element) => {
    state.interestedUsers.forEach((interestedUser) => {
      if (interestedUser.uid === element.uid) {
        interestedUser.status = "no-match";
      }
    });

    const offerUpdate = {
      id: state.id,
      interestedUsers: state.interestedUsers,
    };

    await updateOffer(offerUpdate);
    setRefresh(!refresh);
  };

  const columnas = [
    {
      center: true,
      cell: (row) => (
        <div>
          <Tooltip title="Ver perfil" placement="left" arrow>
          <IconButton>
        {row.imageProfile ? (
            <img
                src={row.imageProfile}
                alt="Profile"
                style={{ width: "2em", height: "2em", borderRadius: "50%" }}
                onClick={() => handleShow(row)}
            />
        ) : (
          
            <BsPersonCircle
                size="2em"
                type="button"
                onClick={() => handleShow(row)}
            />
         
        
        )}
         </IconButton>
         </Tooltip>
    </div>
      ),
    },
    {
      name: "Apellidos y nombres",
      selector: (row) => row.name,
      sortable: true,
      width: "25%",
    },
    {
      name: "Aptitudes coincidentes",
      selector: "aptcoincidentes",
      sortable: true,
      width: "30%",
      center: true,
    },
    {
      name: "Estado",
      selector: (row) => {
        switch (row.status) {
          case "wait":
            return "En Espera";
          case "match":
            return "Matcheado";
          case "no-match":
            return "Descartado";
          default:
            return "none";
        }
      },
      sortable: true,
      center: true,
      conditionalCellStyles: [
        {
          when: (row) => row.status === "match",
          style: {
            backgroundColor: "rgba(63, 195, 128, 0.9)",
            color: "white",
          },
        },
        {
          when: (row) => row.status === "wait",

          style: {
            backgroundColor: "#D9D9D9",
            color: "white",
          },
        },
        {
          when: (row) => row.status === "no-match",
          style: {
            backgroundColor: "rgba(242, 38, 19, 0.9)",
            color: "white",
          },
        },
      ],
    },
    {
      name: "Acciones",
      grow: 1,
      center: true,

      cell: (row) => (
        <div>           
          <Tooltip title="Descartar" placement="top" arrow>
          <IconButton>
          <TiDeleteOutline
            size="1.8em"
            type="button"
            onClick={() => handleNoMatch(row)}
            style={{ cursor: 'pointer' }}
          />
              </IconButton>

        </Tooltip>
       
        <Tooltip title="Matchear" placement="top" arrow>
        <IconButton>
        <IoMdHeartEmpty
            onClick={() => handleMatch(row)}
            size="1.8em"
            type="button"
          />
        </IconButton>
        </Tooltip>
     
        <Tooltip title="Ver perfil" placement="top" arrow>
        <IconButton>
          < IoMdEye
            onClick={ () => handleShow(row)  } 
            size="2em"
            type="button"
            />
           </IconButton>
           </Tooltip>
        </div>
      ),
    },
  ];

  //Para sacar la cantidad de aptitudes coincidentes
  let count = 0;
  const abilitiesOffer = state.requiredAbilities;
  state.interestedUsers.map((e) => {
    const abilitiesUser = e.abilities;
    abilitiesUser.forEach((ability) => {
      if (abilitiesOffer.includes(ability)) {
        count++;
        return true;
      }
      return false;
    });
    const apt = {
      aptcoincidentes: count,
    };

    Object.assign(e, apt);
    count = 0;
  });

  const handleError = (error) => {
    console.error('Error al cargar el CV:', error);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-primary">
        <div className="container-fluid">
          <Link to={"/Offers"}>
            <div className="element">
              <BsArrowLeftSquare />
            </div>
          </Link>

          <Card.Title>{state.title}</Card.Title>
        </div>
      </nav>

      <aside className="sidebar">
        <ul className="nav  flex-column ">
          <IconContext.Provider value={{ size: "3em" }}>
            <li className="nav-item ">
              <a href="/candidates" className="nav-link link-dark">
                <IoIosPeople />
                Candidatos
              </a>
            </li>
            <li>
              <a href="#" className="nav-link link-dark">
                <TbFileDescription />
                Descripción
              </a>
            </li>
            <li>
              <a href="#" className="nav-link link-dark">
                <AiOutlineStar />
                Aptitudes requeridas
              </a>
            </li>
            <li>
            <Link
              to="/chats"
              state={state} // Pasar el estado aquí
              className="nav-link link-dark"
            >
              <IoChatbubbleEllipsesOutline />
              Chat
            </Link>
          </li>
          </IconContext.Provider>
        </ul>
      </aside>

      <section className="table-candidates">
        <DataTable
          columns={columnas}
          data={state.interestedUsers}
          noDataComponent={"No hay candidatos interesados"}
        />
      </section>

      <Modal
        show={show}
        size="lg"
        centered={true}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{candidate?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <section className="section-figure">
            <figure className="figure">
              <img
                width={210}
                height={210}
                src={candidate?.imageProfile}
              />
            </figure>
            <div className="section-figure__detail">
              <h6>Correo</h6>
              <h5>{candidate?.email}</h5>
              <h6>Ubicacion</h6>
              <h5>{candidate?.location}</h5>
              <h6>Habilidades</h6>
              <section className="modal-body-abilities">
                {candidate?.abilities?.map((ability) => (
                  <div className="modal-ability">{ability}</div>
                ))}
              </section>
            </div>
          </section>

          <h6>Descripción</h6>
          <section className="modal-body-description">
            <p>{candidate?.description}</p>
          </section>

          {/* <div>
            {console.log("candidate?.cv",cvUrl)}
      {cvUrl ? (
       
          <DocumentViewer
          pdfUrl={cvUrl}
        />
      ) : (
        <p>No hay currículum disponible</p>
      )}
    </div> */}
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default Candidates;
