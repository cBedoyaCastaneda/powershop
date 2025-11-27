export default async function useUsers() {
  const URL = "http://localhost:3000";

  // async function GetUsers() {
  //   const response = await fetch(URL + "/users");
  //   const data = await response.json();
  //   return data
  // }

  // async function CreateUser(payload) {
  //   const response = await fetch(URL + "/users", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: payload
  //   });
  //   return response;
  // }

  // async function DeleteUser(id) {
  //   const response = await fetch(`${URL}/users/${id}`, {
  //     method: "DELETE"
  //   });
  //   return response
  // }

  async function LoginUser(payload) {
    // Usar el endpoint de login que valida con bcrypt
    const response = await fetch(URL + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    const usuario = await response.json();
    console.warn(usuario)
    return usuario
  }

  return {LoginUser}
  // return { GetUsers, CreateUser, DeleteUser, LoginUser }
}