let globaluserID;
let globalreceiver;
let chatInterval;
let lastMessageTime = null;

document.addEventListener("DOMContentLoaded", function() {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (!localStorageToken) {
        window.location.href = "fb_signin.html";
        return; 
    }
    const decodedToken = localStorageToken ? JSON.parse(atob(localStorageToken.split('.')[1])) : null;
    const userID = decodedToken && decodedToken.data && decodedToken.data.MaNguoiDung;
    if (userID) {
        globaluserID = userID;
        getUser(userID);

        
    } else {
        console.log("UserID không tồn tại trong localStorage");
    }
    const selectedContact = localStorage.getItem('selectedContact');
    if (selectedContact) {
        const contactData = JSON.parse(selectedContact);
        const contact = new NguoiNhan(
            contactData.MaNguoiNhan,
            contactData.HoTen,
            contactData.AnhDaiDien
        );
        getChat(userID, contact);
        localStorage.removeItem('selectedContact');
    }
});

function getElement(selector) {
    return document.querySelector(selector);
}
// Lấy thông tin người dùng
async function getUser(userID) {
    try {
        //gọi api lấy thông tin người dùng
        const user = await apiGetUserID(userID);
        const userObj = new NguoiDung(
            user.MaNguoiDung,
            user.SDT,
            user.Email,
            user.MatKhau,
            user.NgaySinh,
            user.GioiTinh,
            user.HoTen,
            user.AnhDaiDien,
            user.MaVaiTro,
            user.Daxoa,
            user.NgayDangKy
        );

        // lấy các thông danh sách các liên hệ
        const receivers = await apiGetReceiver(userID);
      

        const nguoiNhanArray = receivers.map(items => {
            return new NguoiNhan(
                items.NguoiNhan,
                items.HoTen,
                items.AnhDaiDien
            );
        });

      
        renderContacts(nguoiNhanArray);
        renderInfo(userObj);
    } catch (error) {
        console.log(error + "Lấy thông tin người dùng thất bại");
    }
}

//Render info người dùng
function renderInfo(user) {
    const avatarImgs = document.querySelectorAll("#messenger-avatar");
    const userName = document.getElementById("popupMenuLabel")
    avatarImgs.forEach(avatarImg => {
        if (user.AnhDaiDien) {
            avatarImg.src = `../../../public/img/${user.AnhDaiDien}`;
        } else {
            avatarImg.src = "noimg.png";
        }

        if(user.HoTen){
            userName.textContent=`${user.HoTen}`;
        }
        else {
            userName.textContent='User name'
        }
    });
}

//Render danh sách liên hệ trong messenger
function renderContacts(nguoiNhanArray){
    const friendList = document.querySelector('.friend-list ul');
    friendList.innerHTML = '';

    nguoiNhanArray.forEach(item => {

        const listItem = document.createElement('li');
        listItem.className = 'items-contact';

        const avatar = document.createElement('img');
        avatar.className = 'contact-avatar';
  
        avatar.id = item.MaNguoiNhan;
        if(item.AnhDaiDien){
            avatar.src = `../../../public/img/${item.AnhDaiDien}`; 
        }
        else
        {
            avatar.src = "https://store-images.s-microsoft.com/image/apps.37935.9007199266245907.b029bd80-381a-4869-854f-bac6f359c5c9.91f8693c-c75b-4050-a796-63e1314d18c9?h=464";
        }
    
        const nameLink = document.createElement('a');
        nameLink.href = '#';
        nameLink.textContent = item.HoTen; 
        
        listItem.appendChild(avatar);
        listItem.appendChild(nameLink);
        friendList.appendChild(listItem);
        
        // sự kiện khi click vào contact từ list
        listItem.addEventListener('click', () => {
            getChat(globaluserID,item);
        });
    });
}

//lấy các các tin nhắn với contact được chọn
async function getChat(user, receiver) {
    try {
        globalreceiver = receiver;
     

        const chat = await apiGetMes(user, receiver.MaNguoiNhan);

        const chatArray = chat.map(items => {
            return new Chat(
                items.MaTN,
                items.NguoiGui,
                items.NguoiNhan,
                items.NoiDung,
                items.ThoiGian,
                receiver.AnhDaiDien
            );
        }).sort((a, b) => new Date(a.ThoiGian) - new Date(b.ThoiGian));

        renderChat(chatArray);

        lastMessageTime = chatArray.length > 0 ? new Date(chatArray[chatArray.length - 1].ThoiGian) : null;

        // Clear existing interval if any
        clearInterval(chatInterval);
        // Set interval to fetch new messages every 5 seconds
        chatInterval = setInterval(async () => {
            const newChat = await apiGetMes(user, receiver.MaNguoiNhan);
            const newChatArray = newChat.map(items => {
                return new Chat(
                    items.MaTN,
                    items.NguoiGui,
                    items.NguoiNhan,
                    items.NoiDung,
                    items.ThoiGian,
                    receiver.AnhDaiDien
                );
            }).sort((a, b) => new Date(a.ThoiGian) - new Date(b.ThoiGian));

            // Append only new messages
            appendNewMessages(newChatArray);

        }, 5000);

    } catch (error) {
        console.log(error + "Load tin nhắn thất bại");
    }
}

//Render các tin nhắn ra màn hình chat
function renderChat(chatArray) {
    const chatContainer = document.querySelector('.message-container'); 
    chatContainer.innerHTML = '';
    chatArray.forEach(item => {
        appendMessage(chatContainer, item);
    });
}

// Append new messages to the chat container
function appendNewMessages(chatArray) {
    const chatContainer = document.querySelector('.message-container');
    chatArray.forEach(item => {
        if (new Date(item.ThoiGian) > lastMessageTime) {
            appendMessage(chatContainer, item);
            lastMessageTime = new Date(item.ThoiGian);
        }
    });
}

// Append a single message to the chat container
function appendMessage(chatContainer, item) {
    if (globaluserID === item.MaNguoiGui) {
        const myMes = document.createElement('div');
        myMes.className = 'my-message';

        const myMesText = document.createElement('div');
        myMesText.className = 'my-message-text';

        myMesText.textContent = decryptMessage(item.NoiDungChat) ;

        myMes.appendChild(myMesText);
        chatContainer.appendChild(myMes);
    } else {
        const targetAv = document.createElement('img');
        targetAv.className= 'target-avatar';
        if(item.NguoiNhan_AnhDaiDien){
            targetAv.src = `../../../public/img/${item.NguoiNhan_AnhDaiDien}`; 
        } else {
            targetAv.src = "https://store-images.s-microsoft.com/image/apps.37935.9007199266245907.b029bd80-381a-4869-854f-bac6f359c5c9.91f8693c-c75b-4050-a796-63e1314d18c9?h=464";
        }

        const targetMes = document.createElement('div');
        targetMes.className = 'target-message';

        const targetMesText = document.createElement('div');
        targetMesText.className = 'target-message-text';

        targetMesText.textContent = decryptMessage(item.NoiDungChat);

        targetMes.appendChild(targetAv);
        targetMes.appendChild(targetMesText);
        chatContainer.appendChild(targetMes);
    }
}

document.getElementById('send-btn').addEventListener('click', sendchat);

// Gửi tin nhắn 
async function sendchat() {
    try {
        const NoiDungChat = document.getElementById("inputchat").value;
        if (!NoiDungChat) {
            alert("Vui lòng nhập tin nhắn");
            return;
        }

        const EncryptedChat = NoiDungChat.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
    

        await apiPostMes(globaluserID, globalreceiver.MaNguoiNhan, EncryptedChat);
        document.getElementById("inputchat").value = '';
        
        // Fetch new messages immediately after sending
        const newChat = await apiGetMes(globaluserID, globalreceiver.MaNguoiNhan);
        const newChatArray = newChat.map(items => {
            return new Chat(
                items.MaTN,
                items.NguoiGui,
                items.NguoiNhan,
                items.NoiDung,
                items.ThoiGian,
                globalreceiver.AnhDaiDien
            );
        }).sort((a, b) => new Date(a.ThoiGian) - new Date(b.ThoiGian));

        appendNewMessages(newChatArray);

    } catch (error) {
        console.log("Gửi tin nhắn thất bại - sendchat() - messenger.js", error);
    }
}

$(document).ready(function() {
    $('#messenger-avatar').click(function() {
      $('#popupMenu').modal('show'); // Show modal when avatar is clicked
    });
  });
 
// Ve trang home
document.getElementById("home-btn").addEventListener("click", function(){
    window.location.href = "fb_home.html";
});

// logout
document.getElementById("logout-btn").addEventListener("click", async function logout() {
    try {
      const token = localStorage.getItem("localStorageToken");
      await apiLogout(token);
      localStorage.removeItem("localStorageToken");
      window.location.href = "fb_signin.html"; 
    } catch (error) {
      console.error(error);
    }
}   );

function decryptMessage(encryptedMessage) {
    return encryptedMessage.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('');
}
