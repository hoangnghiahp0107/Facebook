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
        getUser();
    } else {
        console.log("UserID không tồn tại trong localStorage");
    }
});

function getElement(selector) {
    return document.querySelector(selector);
}

async function getUser() {
    try {
        const totalUsers = await apiCountAllUser();
        const usersCreatedThisWeek = await apiCountUserWeek();
        const usersCreatedThisMonth = await apiCountUserMonth();
        const growthPercentageWeek = await apiGrowWeek();
        const growthPercentageMonth = await apiGrowMonth();
        renderTotalUser(totalUsers);
        renderTotalUserWeek(usersCreatedThisWeek);
        renderTotalUserMonth(usersCreatedThisMonth);
        renderGrowUserWeek(growthPercentageWeek);
        renderGrowUserMonth(growthPercentageMonth);
        const users = await apiGetNewUsers();
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
            user.NgayDangKy
        ));
        renderNewsUser(userObj);
        const posts = await apiGetPostsNew();
        const postObj = posts.map((post) => new KiemDuyet(
            post.MaKiemDuyet, 
            post.BaiVietID,
            post.NguoiDuyet,
            post.TrangThaiKiemDuyet,
            post.ThoiGian,
            post.NguoiDuyet_NguoiDung,
            post.BaiViet
        ))
        renderNewsPost(postObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ");
    }
}

function renderNewsUser(users) {
    const currentTime = new Date(); // Thời gian hiện tại

    const html = users.reduce((result, user) => {
        const registrationDate = new Date(user.NgayDangKy);
        const timeDifference = Math.floor((currentTime - registrationDate) / (1000 * 60));

        // Hàm chuyển đổi số phút thành đơn vị thời gian tương ứng
        const formatTimeDifference = (difference) => {
            if (difference < 60) {
                return `${difference} phút trước`;
            } else if (difference < 1440) {
                const hours = Math.floor(difference / 60);
                return `${hours} giờ trước`;
            } else if (difference < 43200) {
                const days = Math.floor(difference / 1440);
                return `${days} ngày trước`;
            } else {
                const months = Math.floor(difference / 43200);
                return `${months} tháng trước`;
            }
        };

        return (
            result +
            `   
                <div class="user">
                    <img src="/public/img/${user.AnhDaiDien}" alt="">
                    <h2>${user.HoTen}</h2>
                    <p>${formatTimeDifference(timeDifference)}</p>
                </div>
            `
        );
    }, "");

    document.getElementById("user-list").innerHTML = html;
}

function renderNewsPost(posts) {
    const currentTime = new Date(); // Thời gian hiện tại

    const html = posts.reduce((result, post, index) => {
        const registrationDate = new Date(post.ThoiGian);
        const timeDifference = Math.floor((currentTime - registrationDate) / (1000 * 60));

        // Hàm chuyển đổi số phút thành đơn vị thời gian tương ứng
        const formatTimeDifference = (difference) => {
            if (difference < 60) {
                return `${difference} phút trước`;
            } else if (difference < 1440) {
                const hours = Math.floor(difference / 60);
                return `${hours} giờ trước`;
            } else if (difference < 43200) {
                const days = Math.floor(difference / 1440);
                return `${days} ngày trước`;
            } else {
                const months = Math.floor(difference / 43200);
                return `${months} tháng trước`;
            }
        };
      return (
        result +
        `
            <tr>
                <td>${index+1}</td>
                <td>${post.NguoiDuyet_NguoiDung.HoTen}</td>
                <td>${formatTimeDifference(timeDifference)}</td>
                <td>${post.TrangThaiKiemDuyet}</td>
            </tr>
        `
      );
    }, "");
  
    document.getElementById("tblDanhSachBVNews").innerHTML = html;
}

function renderTotalUser(totalUsers) {
    const userCountElement = document.getElementById("userCount");
    userCountElement.textContent = totalUsers.totalUsers;
}

function renderTotalUserWeek(usersCreatedThisWeek) {
    const userCountWeekElement = document.getElementById("userWeek");
    userCountWeekElement.textContent = usersCreatedThisWeek.usersCreatedThisWeek;
}

function renderTotalUserMonth(usersCreatedThisMonth) {
    const userCountMonthElement = document.getElementById("userMonth");
    userCountMonthElement.textContent = usersCreatedThisMonth.usersCreatedThisMonth;
}

function renderGrowUserWeek(growthPercentageWeek) {
    const userGrowWeekElement = document.getElementById("growWeek");
    userGrowWeekElement.textContent = growthPercentageWeek.growthPercentageWeek;
}

function renderGrowUserMonth(growthPercentageMonth) {
    const userGrowMonthElement = document.getElementById("growMonth");
    userGrowMonthElement.textContent = growthPercentageMonth.growthPercentageMonth;
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
