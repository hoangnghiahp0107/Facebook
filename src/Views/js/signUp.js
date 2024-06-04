function getElement(selector) {
    return document.querySelector(selector);
}

document.addEventListener("DOMContentLoaded", () => {
  const signUpForm = document.getElementById("signUpForm");
  signUpForm.addEventListener("submit", function(event){
    event.preventDefault();
    SignUp();
  })
});

async function SignUp() {
  const fullName = getElement("#fullname").value;
  const taiKhoan = getElement("#taikhoan").value;
  const matKhau = getElement("#password").value;  
  const day = getElement("#day").value;
  const month = getElement("#month").value;
  const year = getElement("#year").value;
  const gioiTinh = document.querySelector('input[name="gender"]:checked').value;
  const dob = new Date(`${year}-${month}-${day}`);

  function isEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  }

  const isTaiKhoanEmail = isEmail(taiKhoan);

  try {
      const response = await apiSignUp({
          SDT: isTaiKhoanEmail ? null : taiKhoan,
          Email: isTaiKhoanEmail ? taiKhoan : null,
          MatKhau: matKhau,
          NgaySinh: dob.toISOString(), 
          GioiTinh: gioiTinh,
          HoTen: fullName
        });

      if (response.data === "Email hoặc số điện thoại đã tồn tại!") {
          Swal.fire('Tài khoản đã tồn tại', '', 'error');
      } else if (response.data === "Đăng ký tài khoản thành công!") {
          Swal.fire('Tạo tài khoản thành công', '', 'success').then(() => {
          window.location.href = "../layout/fb_signin.html";
        });
        } else {
          console.log('Lỗi không xác định', '', 'error');
      }
  } catch (error) {
      console.error(error);
  }
}

