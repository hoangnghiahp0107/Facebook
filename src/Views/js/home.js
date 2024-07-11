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
        getPost(userID);
        getStoryForMe(userID);
        getStory(userID); 

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

async function getPost(userID) {    
    try {
        const posts = await apiSeePost(userID);
        const postObj = posts.map((post) => new BaiViet(
            post.MaBV,
            post.NguoiDung,
            post.HinhAnh,
            post.NoiDung,
            post.ThoiGian,
            post.CheDoRiengTu,
            post.TrangThaiKiemDuyet,
        ));
        renderPost(postObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ");
    }
}

async function getStory(userID) {    
    try {
        const storys = await apiSeeStory(userID);
        const storyObj = storys.map((story) => new Story(
            story.MaStory,
            story.NguoiDung,
            story.HinhAnh,
            story.ThoiGian,
            story.CheDoRiengTuID,
        ));
        renderStory(storyObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ");
    }
}

async function getStoryForMe(userID) {    
    try {
        const story = await apiSeeStoryForMy(userID);
        const storyObj = new Story(
            story.MaStory,
            story.NguoiDung,
            story.HinhAnh,
            story.ThoiGian,
            story.CheDoRiengTuID,
        );
        renderStoryForMe(storyObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ");
    }
}

function renderPost(posts) {
    const html = posts.reduce((result, post) => {
        // Function to calculate relative time
        function timeSince(date) {
            const seconds = Math.floor((new Date() - new Date(date)) / 1000);
            let interval = Math.floor(seconds / 31536000);

            if (interval >= 1) {
                return interval + " năm";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                return interval + " tháng";
            }
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                return interval + " ngày";
            }
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
                return interval + " giờ";
            }
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                return interval + " phút";
            }
            return Math.floor(seconds) + " giây";
        }

        const timeAgo = timeSince(post.ThoiGian);

        // Check if post.HinhAnh exists
        const imageHtml = post.HinhAnh ? `<img src="/public/img/${post.HinhAnh}" alt="Hình ảnh bài viết">` : '';

        return (
            result +
            `
            <div class="post">
                <div class="post-top">
                    <div class="img-owner">
                        <img src="/public/img/${post.NguoiDung.AnhDaiDien}" alt="Hình đại diện">
                        <div class="post-owner">
                            <p class="owner-name">${post.NguoiDung.HoTen}</p>
                            <p class="time">${timeAgo}</p>
                        </div>
                    </div>
                    <div class="post-options">
                        <i class="fa-solid fa-ellipsis-h" onclick="toggleOptionsMenu(${post.MaBV})"></i>
                        <div id="optionsMenu-${post.MaBV}" class="options-menu">
                            <div class="d-flex justify-content-center align-items-center">
                                <p onclick="deletePost(${post.MaBV})"><i class="fa-solid fa-trash-can mx-2"></i></p>                            
                            </div>
                        </div>
                    </div>
                </div>
                <div class="post-detail">
                    <p class="post-text">${post.NoiDung}</p>
                    ${imageHtml} <!-- Conditional image display -->
                    <div class="interact">
                        <div class="emotion-interact">
                 
                        </div>
                    </div>
                    <hr>
                    <div class="pbottom">
                        <div class="interact-action">
                            <i class="fa-solid fa-thumbs-up"></i>
                            <p>Like</p>
                        </div>
                        <div class="interact-action">
                            <i class="fa-solid fa-comment"></i>
                            <p>Comment</p>
                        </div>
                        <div class="interact-action">
                            <i class="fa-solid fa-share"></i>
                            <p>Share</p>
                        </div>
                    </div>
                </div>
            </div>
         `
        );
    }, "");

    document.getElementById("post").innerHTML = html;
}

function renderStory(story) {
    const html = story.reduce((result, story) => {
        const imageHtml = story.HinhAnh ? `<img src="/public/img/${story.HinhAnh}" alt="Hình ảnh bài viết">` : '';
        return (
            result +
            `
             <div class="friend-story">
                    ${imageHtml} 
                    <div class="friend-profile">
                    <img src="/public/img/${story.NguoiDung.AnhDaiDien}" alt="Hình đại diện">
                    </div>
                    <div class="friend-name">
                      <p>${story.NguoiDung.HoTen}</p>
                    </div>
              </div>
         `
        );
    }, "");

    document.getElementById("story").innerHTML = html;
}

function renderStoryForMe(story) {
    const imageHtml = story.HinhAnh ? `<img src="/public/img/${story.HinhAnh}" alt="Hình ảnh bài viết">` : '';
    const html = `
        <div class="friend-story">
            ${imageHtml}
            <div class="friend-profile">
                <img src="/public/img/${story.NguoiDung.AnhDaiDien}" alt="Hình đại diện">
            </div>
            <div class="friend-name">
                      <p>${story.NguoiDung.HoTen}</p>
            </div>
        </div>
    `;

    document.getElementById("story-for-me").innerHTML = html;
}



function toggleOptionsMenu(postId) {
    const menu = document.getElementById(`optionsMenu-${postId}`);
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

async function deletePost(postId) {
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
        await apiDeletePost(postId);
        Swal.fire('Xóa tài khoản thành công', '', 'success').then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire('Xóa tài khoản thất bại', '', 'error');
      }
    }
  }
  
  document.getElementById('media-icon').addEventListener('click', function() {
    document.getElementById('file-input').click();
  });
  
async function createPost(){
    const noiDung = document.getElementById("noiDung").value;
    const hinhAnh = document.getElementById("file-input").files[0];
    try {
        const formData = new FormData();
        formData.append('NoiDung', noiDung);
        formData.append('HinhAnh', hinhAnh);
        await apiCreatePost(formData);
        Swal.fire('Bài viết của bạn đang được xét duyệt', '', 'success').then(() => {
            window.location.reload();
          });    
        }
    catch (error) {
        console.error(error);
        Swal.fire('Đăng bài viết thất bại', '', 'error');
    }
}
