document.addEventListener("DOMContentLoaded", function() {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (!localStorageToken) {
        window.location.href = "fb_signin.html";
        return; 
    }

    const decodedToken = localStorageToken ? JSON.parse(atob(localStorageToken.split('.')[1])) : null;
    const userID = decodedToken && decodedToken.data && decodedToken.data.MaNguoiDung;
    const userRole = decodedToken && decodedToken.data && decodedToken.data.MaVaiTro;

    if (userRole !== 3) {
        window.location.href = "fb_home.html";
        return;
    }

    if (userID) {
        getUserQL();
    } else {
        console.log("UserID không tồn tại trong localStorage");
    }
});

function getElement(selector) {
    return document.querySelector(selector);
}

async function getUserQL(){
    try {
        const users = await apiGetUserAll();
        const userObj =  users.map((user) => new NguoiDung(
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
            user.NgayDangKy,
            user.MaVaiTro_VaiTro
        ));
        renderUsers(userObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderUsers(users) {
    const html = users.reduce((result, user) => {
      return (
        result +
        `
            <tr>
              <td>${user.MaNguoiDung}</td>
              <td>${user.SDT}</td>
              <td>${truncateContent(user.Email)}</td>
              <td>${user.NgaySinh}</td>
              <td>${user.GioiTinh}</td>
              <td>${user.HoTen}</td>
              <td class="d-flex justify-content-center"><img width="50" height="50" src="/public/img/${user.AnhDaiDien}"><img/></td>
              <td>${user.MaVaiTro_VaiTro.TenVaiTro}</td>
              <td>
                <div class="d-flex justify-content-center">
                    ${user.Daxoa 
                        ? '<span style="color: red;">●</span>' 
                        : '<span style="color: #64f317;">●</span>'}
                </div>
              </td>
              <td>
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-primary mx-2" onclick="selectNews('${user.MaNguoiDung}'); resetTB();">Xem</button>
                    <button class="btn btn-danger" onclick="deleteNews('${user.MaNguoiDung}')">Xoá</button>
                </div>
              </td>
            </tr>
          `
      );
    }, "");
  
    document.getElementById("tblDanhSachND").innerHTML = html;
  }

  function truncateContent(content, maxLength = 10) {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  }