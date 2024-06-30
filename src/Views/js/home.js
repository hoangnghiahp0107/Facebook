document.addEventListener("DOMContentLoaded", function() {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (!localStorageToken) {
        window.location.href = "fb_signin.html";
        return; 
    }

    const decodedToken = localStorageToken ? JSON.parse(atob(localStorageToken.split('.')[1])) : null;
    const userID = decodedToken && decodedToken.data && decodedToken.data.MaNguoiDung;
    if (userID) {
        getUser(userID);
    } else {
        console.log("UserID không tồn tại trong localStorage");
    }
});

function openCard(){
    var cardWarp =document.getElementById('cardWarp')
    cardWarp.classList.toggle('open-menu');
}

function getElement(selector) {
    return document.querySelector(selector);
}


async function getUser(userID) {
    try {
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
        
        renderInfo(userObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ");
    }
}

function renderInfo(user) {
    const avatarImgs = document.querySelectorAll("#avarta");
    const nameParagraphs = document.querySelectorAll("#nameID");
    avatarImgs.forEach(avatarImg => {
        if (user.AnhDaiDien) {
            avatarImg.src = `../../../public/img/${user.AnhDaiDien}`;
        } else {
            avatarImg.src = "noimg.png";
        }
    });
    nameParagraphs.forEach(nameParagraph => {
        if (user.HoTen) {
            nameParagraph.textContent = user.HoTen;
        } else {
            nameParagraph.textContent = " ";
        }
    });
}

function logout() {
    localStorage.removeItem('localStorageToken');
    window.location.href = "fb_signin.html";
}

async function logout() {
    try {
      const token = localStorage.getItem("localStorageToken");
      await apiLogout(token);
      localStorage.removeItem("localStorageToken");
      window.location.href = "fb_signin.html"; 
    } catch (error) {
      console.error(error);
    }
}
  

document.getElementById("logoutButton").addEventListener("click", function() {
    logout();
});

// Chuyển tới messenger
document.getElementById("messengerButton").addEventListener("click", function(){
    window.location.href = "fb_messenger.html";
});

// Mở menu người dùng
function openCard(){
    var cardWarp =document.getElementById('cardWarp')
    var notificationWarp = document.getElementById('notificationWarp')
    cardWarp.classList.toggle('open-menu');
    if(notificationWarp.classList.toggle('open-noti')){
        notificationWarp.classList.toggle('open-noti')
    }
}

//Mở menu thông báo
function openNotifications(){
    var cardWarp =document.getElementById('cardWarp')
    var notificationWarp = document.getElementById('notificationWarp')
    notificationWarp.classList.toggle('open-noti')
    if(  cardWarp.classList.toggle('open-menu')){
        cardWarp.classList.toggle('open-menu');
    }
}




