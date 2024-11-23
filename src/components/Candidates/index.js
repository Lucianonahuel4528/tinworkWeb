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
import Tooltip from '@mui/material/Tooltip';
import { Link, useLocation } from "react-router-dom";
import {
  findUserByUid,
  pushNotification,
  updateUser,
} from "../../services/UserService";
import { updateOffer } from "../../services/OfferService";
import Modal from "react-bootstrap/Modal";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const Candidates = () => {
  const { state } = useLocation();
  console.log("stateeeee",state)
  const [refresh, setRefresh] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [show, setShow] = useState(false);
  const [cvUrl, setCvUrl] = useState(candidate?.cv);
  const [certifications,setCertifications] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? certifications.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === certifications.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    setCvUrl(candidate?.cv);
  }, [candidate]);


  const  handleShow= async (candidateSelected) => {
    const user = await findUserByUid(candidateSelected.uid);    
    setShow(true);
    setCertifications(user.certifications);
    setCandidate(candidateSelected);

    setRefresh(!refresh);

  }

  const handleMatch = async (element) => {
    const user = await findUserByUid(element.uid);
    console.log("userrr",user)
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
      selector: (row) => row.aptcoincidentes,
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

          <div>
            {console.log("candidate?.cv",cvUrl)}
            {console.log("certifications",candidate)}
            <h6>Certificaciones</h6>

      { certifications.length > 0 ? 
      // <div className="certificaciones-container">
      //      {certifications.map((certification) => (
      //       <div  className="certificacion" onClick={() => /*handleImageClick(certificacion.imagen)*/console.log()}>
      //          <img src={certification}  />
      //         </div>
      //      ))}
      //    </div>
            <div className="carrusel-container">
            <button className="carrusel-button" onClick={handlePrev}>
              ◀
            </button>
            <div className="carrusel-slide">
              <img
                src={certifications[currentIndex]}
              />
            </div>
            <button className="carrusel-button" onClick={handleNext}>
              ▶
            </button>
          </div>
        
       : <section className="modal-body-description">
            <p>El candidato/a no cargo certificaciones en su perfil.</p>
          </section>

      }
      
      
    </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default Candidates;
