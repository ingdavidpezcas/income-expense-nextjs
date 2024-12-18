import { feathers, Application } from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import authentication from "@feathersjs/authentication-client";
import axios from "axios";

// Dirección del servidor FeathersJS
const API_URL = "http://localhost:3030";

let client: Application | null = null;
// Inicializa el cliente Feathers sin necesidad de definir servicios para autenticación
export function getClient(): Application {
  if (client) return client;

  client = feathers();

  if (typeof window !== "undefined") {
    // Client-side initialization
    client.configure(rest(API_URL).axios(axios));
    client.configure(
      authentication({
        storage: window.localStorage,
      })
    );
  } else {
    // Server-side initialization
    client.configure(rest(API_URL).axios(axios));
    // Note: Server-side authentication might need a different approach
  }

  return client;
}

export async function authenticate(email: string, password: string) {
  const client = getClient();
  try {
    const response = await client.authenticate({
      strategy: "local",
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
}
