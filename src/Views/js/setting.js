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
    const avatarImgs = document.querySelectorAll("#avatarPreview");
    const nameUser = document.querySelectorAll("#username");
    const emailUser = document.querySelectorAll("#email");
    const phoneUser = document.querySelectorAll("#phone");
    const sexUser = document.querySelectorAll("#sex");
    avatarImgs.forEach(avatarImg => {
        if (user.AnhDaiDien) {
            avatarImg.src = `../../../public/img/${user.AnhDaiDien}`;
        } else {
            avatarImg.src = "noimg.png";
        }
    });
    nameUser.forEach(name => {
        if (user.HoTen) {
            name.value = user.HoTen;
        } else {
            name.value = " ";
        }
    });
    emailUser.forEach(email => {
        if (user.Email) {
            email.value = user.Email;
        } else {
            email.value = " ";
        }
    });
    phoneUser.forEach(phone => {
        if (user.SDT !== undefined && user.SDT.trim() !== "" && user.SDT !== "0") {
            phone.value = user.SDT;
        } else {
            phone.value = "";
        }
    });
    
    sexUser.forEach(sex => {
        if (user.GioiTinh) {
            sex.value = user.GioiTinh;
        } else {
            sex.value = " ";
        }
    })
}