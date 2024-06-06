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

  async function apiGetUserID(userID) {
    try {
      const localStorageToken = localStorage.getItem("localStorageToken");
      const response = await axios({
        method: "GET",
        url: `${URL}/api/users/get-user-id/${userID}`,
        headers: {
          token: localStorageToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
}

async function apiLogout(token) {
  try {
    const response = await axios({
      method: 'POST',
      url: `${URL}/api/users/logout`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      console.log('Đã đăng xuất thành công');
    } else {
      console.log('Đăng xuất không thành công');
    }
  } catch (error) {
    console.error('Lỗi trong quá trình xử lý đăng xuất', error);
  }
}