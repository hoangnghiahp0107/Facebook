document.addEventListener('DOMContentLoaded', () => {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (!localStorageToken) {
        window.location.href = "fb_signin.html";
        return; 
    }

    const decodedToken = localStorageToken ? JSON.parse(atob(localStorageToken.split('.')[1])) : null;
    const userRole = decodedToken && decodedToken.data && decodedToken.data.MaVaiTro;

    if (userRole !== 1) {
        window.location.href = "fb_home.html";
        return;
    }

    const accountData = localStorage.getItem('selectedAccount');

    if (accountData) {
        const account = JSON.parse(accountData);

        document.getElementById('email').value = (account.Email && account.Email !== '0') ? account.Email : '';
        document.getElementById('phone').value = (account.SDT && account.SDT !== '0') ? account.SDT : '';
        document.getElementById('hoTen').value = account.HoTen || '';
        document.getElementById('matKhau').value = ''
        if (account.NgaySinh) {
            const [year, month, day] = account.NgaySinh.split('-');
            document.getElementById('day').value = parseInt(day, 10) || '';
            document.getElementById('month').value = month || '';
            document.getElementById('year').value = year || '';
        }

        if (account.GioiTinh) {
            const genderRadio = document.querySelector(`input[name="gender"][value="${account.GioiTinh}"]`);
            if (genderRadio) {
                genderRadio.checked = true;
            }
        }
        
        if (account.Daxoa !== undefined && account.Daxoa !== null) {
            const deleteValue = account.Daxoa.toString();
            const deleteRadio = document.querySelector(`input[name="deleteUser"][value="${deleteValue}"]`);
            if (deleteRadio) {
                deleteRadio.checked = true;
            }
        }

        const userID = Number(account.MaNguoiDung);
        document.getElementById("updateButton").addEventListener("click", function() {
            updateUser(userID);
        });

    } else {
        console.log('No account data found in localStorage');
    }
});

async function updateUser(userID) {
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const hoTen = document.getElementById("hoTen").value.trim();
    const matKhau = document.getElementById("matKhau").value.trim();
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const anhDaiDien = document.getElementById("anh_dai_dien").files[0];
    const deleteUser = document.querySelector('input[name="deleteUser"]:checked').value;
    
    const dob = new Date(`${year}-${month}-${day}`);
  
    if (!email && !phone) {
        await Swal.fire({
            title: 'Lỗi',
            text: 'Bạn phải nhập ít nhất một trong hai: Email hoặc Số điện thoại.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const formData = new FormData();
    formData.append('Email', email || '0');
    formData.append('SDT', phone || '0');
    formData.append('HoTen', hoTen);
    formData.append('NgaySinh', dob.toISOString());
    formData.append('GioiTinh', gender);
    formData.append('Daxoa', deleteUser);
    formData.append('AnhDaiDien', anhDaiDien || 'noimg.png');
    
    if (matKhau) {
        formData.append('MatKhau', matKhau);
    }

    const willUpdate = await Swal.fire({
        title: "Bạn có muốn cập nhật tài khoản?",
        text: "Nhấn OK để xác nhận cập nhật.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willUpdate.isConfirmed) {
        try {
            await apiUpdateUserAD(userID, formData);
            Swal.fire('Cập nhật tài khoản thành công', '', 'success').then(() => {
                window.location.href = "fb_adminQLND.html";
            });
        } catch (error) {
            Swal.fire('Cập nhật tài khoản thất bại', '', 'error');
        }
    }
}

function logout() {
    localStorage.removeItem('localStorageToken');
    window.location.href = "fb_signin.html";
}

document.getElementById("logoutButton").addEventListener("click", function() {
    logout();
});
