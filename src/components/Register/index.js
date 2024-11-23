import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Form } from "react-bootstrap";
import "./style.css";
import logoRecrutier from "../../logos/Reclutier.png";
import { createUser } from "../../services/UserService";

function Register() {
  const { signup } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [password2, setPassword2] = useState(""); //Para validar campo repetir contraseña

  const expresionNombre = /^[a-zA-ZÀ-ÿ\s]{1,40}$/; // Para validar campo apynombre
  const [name, setName] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (!expresionNombre.test(name) || name.length < 6) {
      setError("El nombre no es valido por favor ingreselo nuevamente");
    } else {
      if (user.password !== password2) {
        setError("Las contraseñas no coinciden, vuelva a intentar");
      } else {
        try {
          const auth = await signup(name, user.email, user.password);
          const userSave = {
            name: name,
            email: user.email,
            uid: auth.currentUser.uid,
          };
          const userCreated = await createUser(userSave); // Espera el resultado de createUser
          if (userCreated) {
            navigate("/offers"); // Navega solo si se creó el usuario
          } else {
            setError("El usuario ya existe, intente con otro correo.");
          }
        } catch (error) {
          if (error.code === "auth/invalid-email") {
            setError(
              "Email invalido por favor verifique e ingreselo nuevamente"
            );
          }
          if (error.code === "auth/weak-password") {
            setError("Su contraseña debe tener al menos 6 caracteres");
          }
          if (error.code === "auth/email-already-in-use") {
            setError("El email ingresado ya esta en uso");
          }
        }
      }
    }
  };

  return (
    <div className="principal">
      <div className="register">
        <img src={logoRecrutier} alt="logo" />

        <Card.Body>
          {error && (
            <div id="error" className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <Card.Title className="mb-4">Registro reclutador</Card.Title>
          <Form onSubmit={handleSubmit}>
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Nombre y Apellido
            </label>
            <Form.Group className="mb-2" controlId="name">
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre completo"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
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
                placeholder="Ingresa tu correo"
                autoComplete="email"
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
                autoComplete="current-password"
                onChange={(e) => setPassword2(e.target.value)}
                className="form-control"
                required
              />
            </Form.Group>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Repetir contraseña
            </label>
            <Form.Group className="mb-2" controlId="password2">
              <Form.Control
                type="password"
                placeholder="******"
                autoComplete="current-password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="form-control"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Registrar
            </Button>

            <p className="my-2 text-sm flex justify-between px-3">
              Ya tienes una cuenta?&nbsp;&nbsp;
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
