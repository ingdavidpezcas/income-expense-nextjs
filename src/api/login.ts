import { feathers, Application } from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import authentication from "@feathersjs/authentication-client";
import axios from "axios";

// Dirección del servidor FeathersJS
const API_URL = "http://localhost:3030";

// Inicializa el cliente Feathers sin necesidad de definir servicios para autenticación
const client: Application = feathers();

// Configura el cliente REST usando Axios
client.configure(rest(API_URL).axios(axios));

// Configura la autenticación (esto no necesita ser un servicio)
client.configure(
  authentication({
    storage: window.localStorage, // Puedes usar localStorage o cualquier otro mecanismo de almacenamiento
  })
);

export default client;
