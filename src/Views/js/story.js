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

async function createStory(){
    debugger
    const hinhAnh = document.getElementById("fileInput").files[0];
    try {
        const formData = new FormData();
        formData.append('HinhAnh', hinhAnh);
        await apiCreateStory(formData);
    } catch (error) {
        console.error(error);
    }
}