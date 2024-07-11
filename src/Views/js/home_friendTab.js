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
        getNoti(); 
        getNonFriends();
    } else {
        console.log("UserID không tồn tại trong localStorage");
    }
});

function getElement(selector) {
    return document.querySelector(selector);
}

//Lấy thông tin Người dung
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
        console.log("Lỗi thông tin lấy Người Dùng");
    }
}

//Render Thong Tin Nguoi Dung
function renderInfo(user) {
    const avatarImgs = document.querySelectorAll("#avarta");
    avatarImgs.forEach(avatarImg => {
        if (user.AnhDaiDien) {
            avatarImg.src = `../../../public/img/${user.AnhDaiDien}`;
        } else {
            avatarImg.src = "noimg.png";
        }
    });
}

//lấy thông tin thông báo
async function getNoti(){
    try{
        const data_thong_bao = await apiGetNotifications();
        const ThongBaoArray = data_thong_bao.map(items =>{
            return new ThongBao(
                items.MaThongBao,
                items.NguoiNhan,
                items.NoiDung,
                items.ThoiGian
            )
        })
        renderNotification(ThongBaoArray);
    }
    catch(error){
        console.log(error);
    }
}

//lấy thông tin bạn bè
async function getFriend(){
    try{
        const data = await apiGetFriends();
        const BanBeArray = data.map(items =>{
            return new Banbe(
                items.BanBeId,
                items.TrangThai,
                items.HoTen,
                items.AnhDaiDien
            )
        })
        RenderFriend(BanBeArray);
    }
    catch(error){
        console.log(error);
        console.log('Lỗi lấy thông tin bà bè')
    }
}

//lấy thông tin yêu cầu của bạn gửi
async function getYourRequest(){
    try{
        const data = await apiGetYourRequests()
        const YourRequestArray = data.map(items =>{
            return new Banbe(
                items.YeuCauGuiToiId,
                items.TrangThai,
                items.HoTen,
                items.AnhDaiDien
            )
        })
        
      console.log(YourRequestArray);
      RenderYourRequest(YourRequestArray);
    
    }
    catch(error){
        console.log(error);
        console.log('Lỗi lấy thông tin bà bè')
    }
}

//lấy thông tin yêu cầu nhận được
async function getFriendRequest(){
    try{
        const data = await apiGetFriendRequests()
        const FriendRequestArray = data.map(items =>{
            return new Banbe(
                items.YeuCauCuaId,
                items.TrangThai,
                items.HoTen,
                items.AnhDaiDien
            )
        })
        
      
        RenderFriendRequest(FriendRequestArray);
    }
    catch(error){
        console.log(error);
        console.log('Lỗi lấy thông tin bà bè')
    }
}

//lấy thông tin các người bạn có thể kết bạn
async function getNonFriends(){
    try{
        const data = await apiGetNonFriends()
        const NonFriendRequestArray = data.map(items =>{
            return new Banbe(
                items.MaNguoiDung,
                "Chua Ket Ban",
                items.HoTen,
                items.AnhDaiDien
            )
        })
        
       RenderNonFriend(NonFriendRequestArray);
    }
    catch(error){
        console.log(error);
        console.log('Lỗi lấy thông tin những người có thể kết bạn')
    }
}

//render các người có thể kết bạn
function RenderNonFriend(BanBeArray) {
    const rightSelectionDiv = document.querySelector('.RightSelection');
    rightSelectionDiv.innerHTML = ''; 

    BanBeArray.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = 'FriendCard';

        const img = document.createElement('img');
        img.src = friend.AnhDaiDien
                ? `../../../public/img/${friend.AnhDaiDien}`
                : "/public/img/noimg.png";
        friendCard.appendChild(img);

        const name = document.createElement('p');
        name.className = 'name';
        name.textContent = friend.HoTen;
        friendCard.appendChild(name);

        const button = document.createElement('button');
        button.textContent = 'Add Friend';
        friendCard.appendChild(button);

        rightSelectionDiv.appendChild(friendCard);

        button.addEventListener('click', () => {
            apiCreateRelationship(friend.MaBanBe);
            alert(`Đã gửi yêu cầu đến ${friend.HoTen}`);
        });

        
    });
}
//render bạn bè
function RenderFriend(BanBeArray) {
    const rightSelectionDiv = document.querySelector('.RightSelection');
    rightSelectionDiv.innerHTML = ''; 

    BanBeArray.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = 'FriendCard';

        const img = document.createElement('img');
        img.src = friend.AnhDaiDien
                ? `../../../public/img/${friend.AnhDaiDien}`
                : "/public/img/noimg.png";
        friendCard.appendChild(img);

        const name = document.createElement('p');
        name.className = 'name';
        name.textContent = friend.HoTen;
        friendCard.appendChild(name);

        const button = document.createElement('button');
        button.className = 'rf_btn';
        button.textContent = 'Remove friend';
        friendCard.appendChild(button);

        rightSelectionDiv.appendChild(friendCard);

        button.addEventListener('click', () => {
            apiUnfriend(friend.MaBanBe);
            alert(`Đã hủy kết bạn với ${friend.HoTen}`);
        })

    });
}

//render các yêu cầu nhận được
function RenderFriendRequest(BanBeArray) {
    const rightSelectionDiv = document.querySelector('.RightSelection');
    rightSelectionDiv.innerHTML = ''; 

    BanBeArray.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = 'FriendCard';
        friendCard.id = friend.MaBanBe;

        const img = document.createElement('img');
        img.src = friend.AnhDaiDien
                ? `../../../public/img/${friend.AnhDaiDien}`
                : "/public/img/noimg.png";
        friendCard.appendChild(img);

        const name = document.createElement('p');
        name.className = 'name';
        name.textContent = friend.HoTen;
        friendCard.appendChild(name);

        const button = document.createElement('button');
        button.textContent = 'Accept Request';
        friendCard.appendChild(button);

        rightSelectionDiv.appendChild(friendCard);

        button.addEventListener('click', ()=>{
            apiBeFriend(friend.MaBanBe);
            alert(`Đã trở thành bạn bè với ${friend.HoTen}`);
        });

    });
}

//render các yêu cầu bạn gửi
function RenderYourRequest(BanBeArray) {
    const rightSelectionDiv = document.querySelector('.RightSelection');
    rightSelectionDiv.innerHTML = ''; 

    BanBeArray.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = 'FriendCard';

        const img = document.createElement('img');
        img.src = friend.AnhDaiDien
                ? `../../../public/img/${friend.AnhDaiDien}`
                : "/public/img/noimg.png";
        friendCard.appendChild(img);

        const name = document.createElement('p');
        name.className = 'name';
        name.textContent = friend.HoTen;
        friendCard.appendChild(name);

        const status = document.createElement('p');
        status.className="status";

        const icon = document.createElement('i')
        icon.className='fa-solid fa-hourglass-start';

        status.appendChild(icon);

        status.innerHTML = '<i class="fa-solid fa-hourglass-start"></i> Chờ phản hồi...';
        friendCard.appendChild(status);

        rightSelectionDiv.appendChild(friendCard);
    });
}

//render thông báo
function renderNotification(ThongBaoArray){
    const container = document.querySelector('.noti-container');
    container.innerHTML = ''; // Clear existing content

    ThongBaoArray.forEach(items => {
        const notiItem = document.createElement('div');
        notiItem.classList.add('noti-items');

        const notiImg = document.createElement('img');
        notiImg.src = '../../../public/img/fb_logo.png';

        const notiDetail = document.createElement('div');
        notiDetail.classList.add('noti-detail');

        const notiTitle = document.createElement('h3');
        notiTitle.textContent = items.NoiDungThongBao;

        const notiTime = document.createElement('p');
        notiTime.textContent = items.ThoiGian;

        notiDetail.appendChild(notiTitle);
        notiDetail.appendChild(notiTime);
        notiItem.appendChild(notiImg);
        notiItem.appendChild(notiDetail);

        container.appendChild(notiItem);
    });
}

// Mở menu Người dùng
function openCard(){
    var cardWarp =document.getElementById('cardWarp')
    var notificationWarp = document.getElementById('notificationWarp')
    cardWarp.classList.toggle('open-menu');
    if(notificationWarp.classList.toggle('open-noti')){
        notificationWarp.classList.toggle('open-noti')
    }
}

// Mở menu thông báo
function openNotifications(){
    var cardWarp =document.getElementById('cardWarp')
    var notificationWarp = document.getElementById('notificationWarp')
    notificationWarp.classList.toggle('open-noti')
    if(  cardWarp.classList.toggle('open-menu')){
        cardWarp.classList.toggle('open-menu');
    }
}

// Chuyển tới messenger
document.getElementById("messengerButton").addEventListener("click", function(){
    window.location.href = "fb_messenger.html";
});


function YourFriend(){
    getFriend();
}

function FriendRequest(){
    getFriendRequest();
}

function YourFriendRequest(){
    getYourRequest();
}

function Reccommendation(){
    getNonFriends();
}
