import { Button, Card, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOffer } from "../../services/OfferService";
import Abilities from "../Abilities";
import "./style.css";
import { findAll } from "../../services/AbilityService";

const FormOffer = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectableAbilities, setSelectableAbilities] = useState([]);
  const [requiredAbilities, setRequiredAbilities] = useState([]);
  const [desiredAbilities, setDesiredAbilities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    abilitiesFunc();
  }, []);

  const abilitiesFunc = async () => {
    const result = await findAll();
    setSelectableAbilities(result);
  };

  const store = async (e) => {
    e.preventDefault();
    let requiredAbilitiesStr = requiredAbilities.map(
      (ability) => ability.title
    );
    let desiredAbilitiesStr = desiredAbilities.map((ability) => ability.title);

    const offer = {
      title,
      description,
      requiredAbilities: requiredAbilitiesStr,
      desiredAbilities: desiredAbilitiesStr,
    };
    await createOffer(offer);
    navigate("/offers");
  };

  const addRequiredAbilities = (abilities) => {
    setRequiredAbilities(abilities);
  };

  const addDesiredAbilities = (abilities) => {
    setDesiredAbilities(abilities);
  };

  return (
    <div className="container-card">
      <div className="card-principal">
        <Card.Body>
          <Card.Title className="mb-4">Nueva posición</Card.Title>
          <Form onSubmit={(e) => store(e)}>
            <Form.Group className="mb-4" controlId="position-title">
              <Form.Control
                type="text"
                placeholder="Título de la posición"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="position-description">
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Descripción de la posición"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                className="col-md-12"
              />
            </Form.Group>
            <Abilities
              addAbilities={addRequiredAbilities}
              abilities={requiredAbilities}
              selectableAbilities={selectableAbilities}
              setSelectableAbilities={setSelectableAbilities}
              label={"Habilidades Requeridas"}
              placeholder={"Cargar Habilidades Requeridas"}
            />
            <Abilities
              addAbilities={addDesiredAbilities}
              abilities={desiredAbilities}
              selectableAbilities={selectableAbilities}
              setSelectableAbilities={setSelectableAbilities}
              label={"Habilidades Deseadas"}
              placeholder={"Cargar Habilidades Deseadas"}
            />
            <div className="text-right">
              <Button variant="primary" type="submit">
                Cargar posición
              </Button>
            </div>
          </Form>
        </Card.Body>
      </div>
    </div>
  );
};

export default FormOffer;
