import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Form } from "react-bootstrap";
import "./style.css";
import Alert from "react-bootstrap/Alert";


function Register() {
  const { signup } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(user.email, user.password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setError("Email invalido porfavor verifique e ingrese nuevamente el email")
      }
      if (error.code === "auth/weak-password") {
        setError("Su contraseña debe tener al menos 6 caracteres")
      }
      if (error.code === "auth/email-already-in-use") {
        setError("El email ingresado ya esta en uso")
      }
    }
  };

 
  return (

    <div className="principal">
      
      <img src="/logos/logoTin.png" alt="" className="logo" />

      <div className="register">
      {error &&
     <Alert variant="danger" style={{ width: "34rem" }}>
        <Alert.Heading>
          {error}
        </Alert.Heading>
      </Alert> }
      
      
        <Card.Body>
          <Card.Title className="mb-4">Registro reclutador</Card.Title>
          <Form onSubmit={handleSubmit}>

            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"

            >
              Apellido/s y Nombre/s
            </label>
            <Form.Group className="mb-2" controlId="name">
              <Form.Control
                type="text"
                placeholder="Perez Aliendro Carlos"
                className="form-control"
                required
              />
            </Form.Group>


            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>

            <Form.Group className="mb-2" controlId="email">
              <Form.Control
                type="email"
                placeholder="email@gmail.com"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="form-control"
                required
              />
            </Form.Group>

            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Contraseña
            </label>
            <Form.Group className="mb-2" controlId="password">
              <Form.Control
                type="password"
                placeholder="******"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="form-control"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Registrar
            </Button>

            <p className="my-4 text-sm flex justify-between px-3">
              Ya tienes una cuenta ?


              <Link to="/login" className="text-blue-700 hover:text-blue-900">
                Inciar sesión
              </Link>
            </p>
          </Form>
        </Card.Body>

      </div>
    </div>



  );
}

export default Register;
