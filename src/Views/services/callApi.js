const URL = "http://localhost:8080";

async function apiSignUp(user) {
    return await axios({
      method: "POST",
      url: `${URL}/api/users/sign-up`,
      data: user
    });
  }
  
  async function apiLogin(user) {
    return await axios({
      method: "POST",
      url: `${URL}/api/users/login`,
      data: user
    });
  }