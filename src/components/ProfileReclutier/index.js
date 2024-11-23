import React, { useState, useEffect } from 'react'
import { Card, Form, Button, Modal } from "react-bootstrap";
import { storage } from "../../config/firebase";
import { todasProvincias } from "../../services/ProvinceService";
import SelectAvatar from 'react-avatar-edit'
import "./style.css";
import { findUserByUid, updateProfile } from "../../services/UserService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";


function ProfileReclutier() {

  const { user,updateUserProfile } = useAuth();

  //Manejo de botones
  const [btndescri, setBtndescrip] = useState(false);
  const [btnubi, setBtnubi] = useState(false);

  //Description
  const [description, setDescription] = useState("");
  const [buttonDisable, setButtonDisable] = useState(true);

  //Photo
  const [url, setUrl] = useState(null);

  //Location
  const [provincias, setProvincias] = useState([]);
  const [location, setLocation] = useState("");

  //Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Seleccion de sección de foto 
  const [pview, setpview] = useState(false)


  const onClose = () => {
    setpview(null)
  }

  //Seteo de sección de la foto en pview
  const onCrop = (view) => {
    setpview(view)
  }

  const saveCropImage = () => {

    
    const imageRef = ref(storage, "image");
    
    //Pasar la imagen seleccionada de base 64 a file
    let base64string = pview
    const [type, data] = base64string.split(',');
    const mimeType = type.split(':')[1].split(';')[0];
    const text = atob(data);
    const buffer = new ArrayBuffer(text.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < text.length; i++) {
      view[i] = text.charCodeAt(i);
    }
    const file = new File([view], 'filename', { type: mimeType });
    //=========================================================//
    uploadBytes(imageRef, file)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
            const dataProfile = {
              description,
              location,
              url,
            };
            updateProfile(dataProfile, user.uid);
            updateUserProfile({ photoURL: url }); 

          })
          .catch((error) => {
            console.log(error.message, "error al obtener la url de la imagen");
          });

      })
      .catch((error) => {
        console.log(error.message);
      });
    setShow(false)
  }
  const editProfile = () => {
    const dataProfile = {
      description,
      location,
      url,
    };
    updateProfile(dataProfile, user.uid);
    setBtnubi(false);
    setBtndescrip(false);
  };
  const noeditubi = async () => {
    let userDat = await findUserByUid(user.uid);
    setLocation(userDat?.location || "");
    setBtnubi(false);
  };

  const noeditdesc = async () => {
    let userDat = await findUserByUid(user.uid);
    setDescription(userDat?.description || "");
    setBtndescrip(false);
  };

  const findAllProvinces = async () => {
    const prov = await todasProvincias();
    setProvincias(prov);
  };

  useEffect(() => {
    findAllProvinces();
  }, []);
  useEffect(() => {
    const getDatByUidUser = async () => {
      let userDat = await findUserByUid(user.uid);
      setDescription(userDat?.description || "");
      setLocation(userDat?.location || "");
      setUrl(userDat?.imageProfile ||
        "https://w7.pngwing.com/pngs/223/244/png-transparent-computer-icons-avatar-user-profile-avatar-heroes-rectangle-black.png"
      );
    };
    getDatByUidUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="principal-profile">
      <div className="profile">
        <Card.Body>
          <div className="grid">
            <div className="grid-1">
             <div className="image-container">
                <img src={url} alt="logo" className="image" onClick={() => setShow(true)} />
                <button
      type="button"
      className="botonedpro"
      onClick={handleShow}
    >
                  Editar foto
                </button>
             </div>
            </div>
            <div className="grid-2">
              <label htmlFor="name">
                <font color="gray">Nombre/s y apellido/s</font>
              </label>
              <p className="card-text">{user?.displayName || ""}</p>
              <label htmlFor="name">
                <font color="gray">Correo</font>
              </label>
              <p className="card-text">{user?.email || ""}</p>
            </div>
          </div>
          <div className="pie-foto">
            <label htmlFor="name">
              <font color="gray">Ubicación</font>{" "}
              {!btnubi && (
                <button
                  type="button"
                  className="button"
                  onClick={() => setBtnubi(true)}
                >
                  Editar
                </button>
              )}
            </label>
            <p className="card-text">{location || ""}</p>

            {btnubi && (
              <div className="input-group mb-3">
                <div>
                  <select
                    className="select-province"
                    aria-label=".form-select-sm example"
                    onChange={(e) => setLocation(e.target.value + ",Argentina")}
                  >
                    <option disabled selected value="seleccione">
                      Seleccionar provincia
                    </option>
                    {provincias.map((provincia) => (
                      <option key={provincia.id}> {provincia.nombre}</option>
                    ))}
                  </select>
                </div>
                <Button variant="primary" onClick={editProfile}>
                  {" "} Guardar {" "}
                </Button>
                <Button variant="secondary" onClick={noeditubi}>
                  {" "} Cancelar {" "}
                </Button>
              </div>
            )}

         
            

            {!btndescri && (
              <div>
              <label htmlFor="name">
              <font color="gray">Descripción </font>              {!btnubi && (
                              <button
                                type="button"
                                className="button"
                                onClick={() => setBtndescrip(true)}                >
                                Editar
                              </button>
                            )}
                          </label>     
              
                <p className="card-text">{description || ""}</p>
                
             </div>

            )}
            {btndescri && (
              <div className="card-body">
                <Form.Group
                  controlId="position-description"
                >
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Descripción de la posición"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"

                    onInput={(e) => {
                      e.target.value.length > 60
                        ? setButtonDisable(false)
                        : setButtonDisable(true);
                    }}
                    required
                  />
                  <label
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginRight: 5,
                    }}
                  >
                    {description.length - 60}

                  </label>

                </Form.Group>
                <div className="botones">
                  <Button variant="primary" onClick={editProfile} disabled={buttonDisable}>
                    Guardar
                  </Button>
                </div>
                <div className="botones">
                  <Button variant="secondary" onClick={noeditdesc}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card.Body>
        <div >

        </div>
        <Modal show={show} onHide={handleClose} style={{ marginTop: '10%' }} backdrop={1}>
          <Modal.Dialog >

            <Modal.Title >Seleccione foto de perfil</Modal.Title>
            <SelectAvatar
              width={300}
              height={300}
              onCrop={onCrop}
              onClose={onClose}
              

            />
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
              <Button variant="primary" onClick={saveCropImage}>Subir</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>

      </div>
    </div>


  )
}

export default ProfileReclutier