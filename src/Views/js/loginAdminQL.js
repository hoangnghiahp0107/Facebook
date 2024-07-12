function getElement(selector) {
    return document.querySelector(selector);
}

document.addEventListener("DOMContentLoaded", () => {
    const signInForm = document.getElementById("signInForm");
    signInForm.addEventListener("submit", function(event) {
      event.preventDefault();
      SignIn();
    });
})

async function SignIn() {
    debugger
    const taiKhoan = getElement("#tai_khoan_login").value;
    const matKhau = getElement("#mat_khau_login").value;
    function isEmail(value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value);
    }
  
    const isTaiKhoanEmail = isEmail(taiKhoan);
    try {
      const response = await apiLoginAdminQL({
        SDT: isTaiKhoanEmail ? null : taiKhoan,
        Email: isTaiKhoanEmail ? taiKhoan : null,
        MatKhau: matKhau,
      });
  
      if (response.status === 200) {
        const token = response.data;
        localStorage.setItem("localStorageToken", token);
          Swal.fire('Đăng nhập thành công', '', 'success').then(() => {
          window.location.href = "../layout/fb_adminQLND.html";
        });
      } else if (response.status === 400) {
        Swal.fire('Tài khoản hoặc mật khẩu không đúng', '', 'error');
      } else {
        Swal.fire('Lỗi không xác định', '', 'error');
      }
    } catch (error) {
      Swal.fire('Tài khoản hoặc mật khẩu không đúng', '', 'error');
      console.error(error);
    }
  }


