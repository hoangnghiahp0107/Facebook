const URL = "http://localhost:8080";

async function apiSignUp(user) {
    return await axios({
      method: "POST",
      url: `${URL}/api/users/sign-up`,
      data: user
    });
  }

  async function apiCreateUser(user) {
    return await axios({
      method: "POST",
      url: `${URL}/api/users/create-user`,
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

async function apiCountAllUser() {
  try {
    
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/users/count-users`,
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

async function apiCountUserWeek() {
  try {
    
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/users/count-users-week`,
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

async function apiCountUserMonth() {
  try {
    
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/users/count-users-month`,
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

async function apiGrowWeek() {
  try {
    
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/users/grow-week`,
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

async function apiGrowMonth() {
  try {
    
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/users/grow-month`,
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

async function apiGetUser() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/users/get-users`,
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

async function apiGetUserAll() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/users/get-users-all`,
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

async function apiGetNewUsers() {
  try {
    
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/users/get-new-users`,
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

async function apiUpdateUserIf(userID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/users/update-user-if/${userID}`,
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

async function apiGetPostQL() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/posts/get-posts-all`,
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

async function apiAccessPostStatus(postID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/posts/update-post-access/${postID}`,
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

async function apiDenyPostStatus(postID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/posts/update-post-deny/${postID}`,
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

async function apiGetPostsNew() {
  try {
    
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/posts/get-posts-new`,
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

async function apiDeleteAccount(userID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/users/delete-user/${userID}`,
      headers: {
        token: localStorageToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
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

async function apiGetSearchUser(taiKhoan) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/users/get-search-user/${taiKhoan}`,
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

async function apiUpdateUserAD(userID, user) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/users/update-user/${userID}`,
      data: user,
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

//Get các thông báo
async function apiGetNotifications(){
  try{
  const localStorageToken = localStorage.getItem("localStorageToken");
  const response = await axios({
    method: "GET",
    url: `${URL}/api/notification/get-notifications`,
    headers:{  token:localStorageToken,},
  });
  return response.data;
  }
  catch(error) {
    throw error;
  }
}

//Get thông tin người liên hệ
async function apiGetReceiver(userID) {
  try {
      const localStorageToken = localStorage.getItem("localStorageToken");
      const response = await axios({
          method: "GET",
          url: `${URL}/api/chats/get-receiver/${userID}`,
          headers: {
              token: localStorageToken,
          },
      });
      return response.data;
  } catch (error) {
     console.log('lỗi danh sách người nhận');
      throw error;
  }
}

//Get các cuộc hội thoại
async function apiGetMes(userID,receiverID) {
  try {
      const localStorageToken = localStorage.getItem("localStorageToken");
      const response = await axios({
          method: "GET",
          url: `${URL}/api/chats/get-messages/${userID}/${receiverID}`,
          headers: {
              token: localStorageToken,
          },
      });
      return response.data;
  } catch (error) {
     console.log(`lỗi lấy tin nhắn cảu ${userID} và ${receiverID}`);
      throw error;
  }
}

//Post Tin nhắn mới 
async function apiPostMes(userID, receiverID, messageContent) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/chats/post-messages/${userID}/${receiverID}`,
      headers: {
        token: localStorageToken,
        'Content-Type': 'application/json'
      },
      data: {
        NoiDung: messageContent
      }
    });

    if (response.status === 200) {
      console.log("Message sent successfully:", response.data);
    } else {
      console.log("Failed to send message:", response.data);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function apiSeePost(userID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/posts/see-posts/${userID}`,
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

async function apiDeletePost(postID){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "DELETE",
      url: `${URL}/api/posts/delete-posts/${postID}`,
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

async function apiSeeStory(userID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/storys/get-story-friend/${userID}`,
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

async function apiSeeStoryForMy(userID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/storys/get-story-for-me/${userID}`,
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


async function apiCreatePost(formData){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/posts/create-posts`,
      headers: {
        token: localStorageToken,
      },
      data: formData
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiCreateStory(formData){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/storys/create-story`,
      headers: {
        token: localStorageToken,
      },
      data: formData
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

//Get các Người bạn
async function apiGetFriends(){
  try{
  const localStorageToken = localStorage.getItem("localStorageToken");
  const response = await axios({
    method: "GET",
    url: `${URL}/api/friends/get-friends`,
    headers:{  token:localStorageToken,},
  });
  return response.data;
  }
  catch(error) {
    throw error;
  }
}
//Get các các lời mời được gửi đến bạn
async function apiGetFriendRequests(){
  try{
  const localStorageToken = localStorage.getItem("localStorageToken");
  const response = await axios({
    method: "GET",
    url: `${URL}/api/friends/get-requests`,
    headers:{  token:localStorageToken,},
  });
  return response.data;
  }
  catch(error) {
    throw error;
  }
}
//Get các các lời mời được bạn gửi đi
async function apiGetYourRequests(){
  try{
  const localStorageToken = localStorage.getItem("localStorageToken");
  const response = await axios({
    method: "GET",
    url: `${URL}/api/friends/get-yourrequests`,
    headers:{  token:localStorageToken,},
  });
  return response.data;
  }
  catch(error) {
    throw error;
  }
}
//Get các Người dùng bạn có thể kết bạn
async function apiGetNonFriends(){
  try{
  const localStorageToken = localStorage.getItem("localStorageToken");
  const response = await axios({
    method: "GET",
    url: `${URL}/api/friends/get-nonfriends`,
    headers:{  token:localStorageToken,},
  });
  return response.data;
  }
  catch(error) {
    throw error;
  }
}

//Trờ thành bạn bè
async function apiBeFriend(targetID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/friends/be-friend`,
      headers: {
        token: localStorageToken,
        'Content-Type': 'application/json'
      },
      data: {
        targetID: targetID
      }
    });
    console.log(`kết bạn thành công với ${targetID}`);
  } catch (error) {
    console.log('Kết bạn thất bạn')
  }
}

//Tạo quan hệ
async function apiCreateRelationship(targetID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/friends/post-relationship`,
      headers: {
        token: localStorageToken,
        'Content-Type': 'application/json'
      },
      data: {
        targetID: targetID
      }
    });

    if (response.status === 200) {
      console.log("Friend request created successfully:", response.data);
    } else {
      console.log("Failed to create friend request:", response.data);
    }
  } catch (error) {
    console.error("Error creating friend request:", error);
  }
}

//Xóa bạn bè
async function apiUnfriend(targetID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "DELETE", // Sử dụng phương thức DELETE
      url: `${URL}/api/friends/unfriend`,
      headers: {
        token: localStorageToken,
        'Content-Type': 'application/json'
      },
      data: {
        targetID: targetID
      }
    });

    if (response.status === 200) {
      console.log("Unfriend successful:", response.data);
    } else {
      console.log("Failed to unfriend:", response.data);
    }
  } catch (error) {
    console.error("Error unfriending:", error);
  }
}

