document.addEventListener("DOMContentLoaded", function() {
  const localStorageToken = localStorage.getItem('localStorageToken');
  if (!localStorageToken) {
      window.location.href = "fb_signin.html";
      return; 
  }

  const decodedToken = localStorageToken ? JSON.parse(atob(localStorageToken.split('.')[1])) : null;
  const userID = decodedToken && decodedToken.data && decodedToken.data.MaNguoiDung;
  const userRole = decodedToken && decodedToken.data && decodedToken.data.MaVaiTro;

  if (userRole !== 1) {
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
      const response = await apiGetUser();
      if (response && response.length > 0) {
          users = response.map((user) => new NguoiDung(
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
          renderUsers(users);
      } else {
          console.log("Không có dữ liệu người dùng trả về từ API");
      }
  } catch (error) {
      console.log("Lỗi từ máy chủ", error);
  }
}


let currentPage = 1;
const itemsPerPage = 10; 

function renderUsers(users) {
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const html = currentUsers.reduce((result, user, index) => {
      return (
          result +
          `
          <tr>
            <td>${startIndex + index + 1}</td>
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
                  <button class="btn btn-outline-success mx-2" onclick="selectAccount('${user.MaNguoiDung}');">
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                  <button class="btn btn-outline-danger" onclick="deleteAccount('${user.MaNguoiDung}')">
                    <i class="fa-regular fa-circle-xmark"></i>
                  </button>
              </div>
            </td>
          </tr>
        `
      );
  }, "");

  document.getElementById("tblDanhSachND").innerHTML = html;

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  let paginationHtml = '';

  paginationHtml += `<button class="btn btn-outline-dark mx-1" onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`;

  for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `<button class="btn btn-outline-dark mx-1 ${currentPage === i ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  paginationHtml += `<button class="btn btn-outline-dark  mx-1" onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>`;

  document.getElementById("pagination").innerHTML = paginationHtml;
}

function prevPage() {
  if (currentPage > 1) {
      currentPage--;
      getUserQL();
  }
}

function nextPage() {
  if (currentPage < Math.ceil(users.length / itemsPerPage)) {
      currentPage++;
      getUserQL();
  }
}

function goToPage(page) {
  currentPage = page;
  getUserQL(); 
}


function truncateContent(content, maxLength = 10) {
  if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
  }
  return content;
}

async function createAccount() {
  if (!validate()) {
    return; 
  }
  const taiKhoan = document.getElementById("tai_khoan").value;
  const fullName = document.getElementById("ho_ten").value;
  const matKhau = document.getElementById("mat_khau").value;
  const day = document.getElementById("day").value;
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;
  const gioiTinh = document.querySelector('input[name="gender"]:checked').value;
  const dob = new Date(`${year}-${month}-${day}`);
  const anhDaiDien = document.getElementById("anh_dai_dien").files[0];

  function isEmail(value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value);
  }

  const isTaiKhoanEmail = isEmail(taiKhoan);

  try {
      const formData = new FormData();
      formData.append('SDT', isTaiKhoanEmail ? 0 : taiKhoan);
      formData.append('Email', isTaiKhoanEmail ? taiKhoan : 0);
      formData.append('MatKhau', matKhau);
      formData.append('NgaySinh', dob.toISOString());
      formData.append('GioiTinh', gioiTinh);
      formData.append('HoTen', fullName);
      formData.append('AnhDaiDien', anhDaiDien);

      const response = await apiCreateUser(formData);

      if (response.data === "Email hoặc số điện thoại đã tồn tại!") {
          Swal.fire({
              title: 'Tài khoản đã tồn tại',
              text: 'Vui lòng sử dụng email hoặc số điện thoại khác.',
              icon: 'error',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: true,
              allowEnterKey: true
          });
      } else if (response.data === "Đăng ký tài khoản thành công!") {
          Swal.fire({
              title: 'Tạo tài khoản thành công',
              icon: 'success',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: true,
              allowEnterKey: true
          }).then(() => {
              window.location.href = "../layout/fb_adminQLND.html";
          });
      } else {
          Swal.fire({
              title: 'Lỗi không xác định',
              icon: 'error',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: true,
              allowEnterKey: true
          });
      }
  } catch (error) {
      console.error(error);
      Swal.fire({
          title: 'Đã có lỗi xảy ra',
          text: 'Không thể hoàn thành yêu cầu của bạn. Vui lòng thử lại sau.',
          icon: 'error',
          confirmButtonText: 'OK',
          allowOutsideClick: false,
          allowEscapeKey: true,
          allowEnterKey: true
      });
  }
}


  async function deleteAccount(userID) {
    const willDelete = await Swal.fire({
      title: "Bạn có muốn xóa tài khoản?",
      text: "Nhấn OK để xác nhận xóa tài khoản.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Hủy",
    });
  
    if (willDelete.isConfirmed) {
      try {
        await apiDeleteAccount(userID);
        Swal.fire('Xóa tài khoản thành công', '', 'success').then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire('Xóa tài khoản thất bại', '', 'error');
      }
    }
  }
  
  async function selectAccount(userID) {
    try {
        const response = await apiGetUserID(userID);

        localStorage.setItem('selectedAccount', JSON.stringify(response));

        window.location.href = "fb_adminUpdateND.html";
        
    } catch (error) {
        console.log(error);
    }
}

async function getSearchUserByAccount(searchParam) {
  try {
    if (!searchParam) {
        getUserQL(users);
        return;
    }

    const response = await apiGetSearchUser(searchParam);
    if (response && response.length > 0) {
        users = response.map((user) => new NguoiDung(
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
        renderUsersByAccount(users, searchParam);
    } else {
        console.log("Không có dữ liệu người dùng trả về từ API");
    }

  } catch (error) {
      console.log("Lỗi từ máy chủ");
  }
}

function renderUsersByAccount(users, searchParam) {
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const html = currentUsers.reduce((result, user, index) => {
    if (user.Email.toLowerCase().includes(searchParam.toLowerCase()) || user.SDT.includes(searchParam) || user.HoTen.toLowerCase().includes(searchParam.toLowerCase())) {
      return (
          result +
          `
          <tr>
            <td>${startIndex + index + 1}</td>
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
                  <button class="btn btn-outline-success mx-2" onclick="selectAccount('${user.MaNguoiDung}');">
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                  <button class="btn btn-outline-danger" onclick="deleteAccount('${user.MaNguoiDung}')">
                    <i class="fa-regular fa-circle-xmark"></i>
                  </button>
              </div>
            </td>
          </tr>
        `
      );
    }
    return result;
  }, "");

  document.getElementById("tblDanhSachND").innerHTML = html;

  renderPagination(totalPages);
}

function handleSearch(event) {
  event.preventDefault(); 
  const searchTerm = document.querySelector('.search-bar input[name="search"]').value;
  getSearchUserByAccount(searchTerm);
}

function validate() {
  let isValid = true;

  let tai_khoan = document.getElementById("tai_khoan").value;
  if (!tai_khoan.trim()) {
    isValid = false;
    document.getElementById("tbAccount").innerHTML = "Vui lòng nhập tài khoản!";
  } else {
    document.getElementById("tbAccount").innerHTML = "";
  }

  let ho_ten = document.getElementById("ho_ten").value;
  if (!ho_ten.trim()) {
    isValid = false;
    document.getElementById("tbName").innerHTML = "Vui lòng nhập họ tên!";
  } else {
    document.getElementById("tbName").innerHTML = "";
  }

  let mat_khau = document.getElementById("mat_khau").value;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
  if (!mat_khau.trim()) {
    isValid = false;
    document.getElementById("tbPassword").innerHTML = "Vui lòng nhập mật khẩu!";
  } else if (!passwordRegex.test(mat_khau)) {
    isValid = false;
    document.getElementById("tbPassword").innerHTML = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái thường, 1 chữ cái hoa và 1 ký tự đặc biệt.";
  } else {
    document.getElementById("tbPassword").innerHTML = "";
  }

  const day = document.getElementById("day").value;
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;
  const dob = new Date(`${year}-${month}-${day}`);

  let all_gender = document.querySelector('input[name="gender"]:checked');
  if (!all_gender) {
    isValid = false;
    document.getElementById("tbSex").innerHTML = "Vui lòng chọn giới tính!";
  } else {
    document.getElementById("tbSex").innerHTML = "";
  }

  // Check age
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 16) {
    isValid = false;
    document.getElementById("tbAge").innerHTML = "Người dùng phải đủ 16 tuổi!";
  } else {
    document.getElementById("tbAge").innerHTML = "";
  }

  return isValid;
}


document.querySelector('.search-bar form').addEventListener('submit', handleSearch);
