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
        getPostQL();
    } else {
        console.log("UserID không tồn tại trong localStorage");
    }
});

function getElement(selector) {
    return document.querySelector(selector);
}

async function getPostQL(){
    try {
        const posts = await apiGetPostQL();
        const postObj =  posts.map((post) => new BaiViet(
            post.MaBV,
            post.NguoiDung,
            post.HinhAnh,
            post.NoiDung,
            post.ThoiGian,
            post.CheDoRiengTu,
            post.TrangThaiKiemDuyet
        ));
        renderPosts(postObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderPosts(posts) {
    const html = posts.reduce((result, post) => {
        // Chuyển đổi thời gian từ chuỗi thành đối tượng Date
        const date = new Date(post.ThoiGian);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        // Định dạng lại ngày giờ thành chuỗi DD/MM/YYYY HH:mm:ss
        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

        // Kiểm tra TrangThaiKiemDuyet để quyết định hiển thị nút Duyệt và Xóa
        let actionButtons = '';
        if (post.TrangThaiKiemDuyet === 'Chờ kiểm duyệt') {
            actionButtons = `
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-success mx-2" onclick="accessPost('${post.MaBV}') "><i class="fa-solid fa-check" style="font-size: 20px"></i></button>
                    <button class="btn btn-danger" onclick="denyPost('${post.MaBV}')"><i class="fa-solid fa-xmark" style="font-size: 20px"></i></button>
                </div>
            `;
        }

        return (
            result +
            `
            <tr>
                <td>${post.MaBV}</td>
                <td>${truncateContent(post.NguoiDung)}</td>
                <td class="d-flex justify-content-center"><img width="50" height="50" src="/public/img/${post.HinhAnh}"><img/></td>
                <td>${post.NoiDung}</td>
                <td>${formattedDateTime}</td>
                <td>${post.CheDoRiengTu}</td>
                <td>${post.TrangThaiKiemDuyet}</td>
                <td>${actionButtons}</td>
            </tr>
            `
        );
    }, "");

    document.getElementById("tblDanhSachBV").innerHTML = html;
}

async function accessPost(postID) {
    try {
        await apiAccessPostStatus(postID);
        await getPostQL();

    } catch (error) {
        console.log("Lỗi khi truy cập vào bài viết", error);
    }
}

async function denyPost(postID) {
    try {
        await apiDenyPostStatus(postID);
        await getPostQL();

    } catch (error) {
        console.log("Lỗi khi truy cập vào bài viết", error);
    }
}

function truncateContent(content, maxLength = 30) {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
}