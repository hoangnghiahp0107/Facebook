class NguoiDung {
    constructor(MaNguoiDung, SDT, Email, MatKhau, NgaySinh, GioiTinh, HoTen, AnhDaiDien, MaVaiTro, Daxoa, NgayDangKy, MaVaiTro_VaiTro) {
        this.MaNguoiDung = MaNguoiDung;
        this.SDT = SDT;
        this.Email = Email;
        this.MatKhau = MatKhau;
        this.NgaySinh = NgaySinh;
        this.GioiTinh = GioiTinh;
        this.HoTen = HoTen;
        this.AnhDaiDien = AnhDaiDien;
        this.MaVaiTro = MaVaiTro;
        this.Daxoa = Daxoa;
        this.NgayDangKy = NgayDangKy;
        this.MaVaiTro_VaiTro = MaVaiTro_VaiTro
    }
}

class BaiViet {
    constructor(MaBV, NguoiDung, HinhAnh, NoiDung, ThoiGian, CheDoRiengTu, TrangThaiKiemDuyet) {
        this.MaBV = MaBV;
        this.NguoiDung = NguoiDung; 
        this.HinhAnh = HinhAnh;
        this.NoiDung = NoiDung;
        this.ThoiGian = ThoiGian;
        this.CheDoRiengTu = CheDoRiengTu;
        this.TrangThaiKiemDuyet = TrangThaiKiemDuyet;
    }
}

class KiemDuyet {
    constructor(MaKiemDuyet, BaiVietID, NguoiDuyet, TrangThaiKiemDuyet, ThoiGianKiemDuyet, NguoiDuyet_NguoiDung, BaiViet) {
        this.MaKiemDuyet = MaKiemDuyet;
        this.BaiVietID = BaiVietID;
        this.NguoiDuyet = NguoiDuyet; 
        this.TrangThaiKiemDuyet = TrangThaiKiemDuyet;
        this.ThoiGianKiemDuyet = ThoiGianKiemDuyet;
        this.NguoiDuyet_NguoiDung = NguoiDuyet_NguoiDung;
        this.BaiViet = BaiViet;
    }
}

class Chat{
    constructor(MaTinNhan,MaNguoiGui,MaNguoiNhan,NoiDungChat,ThoiGian,NguoiNhan_AnhDaiDien){
        this.MaTinNhan = MaTinNhan;
        this.MaNguoiGui = MaNguoiGui;
        this.MaNguoiNhan = MaNguoiNhan;
        this.NoiDungChat = NoiDungChat;
        this.ThoiGian = ThoiGian;
        this.NguoiNhan_AnhDaiDien= NguoiNhan_AnhDaiDien;
    }
}

class ThongBao{
    constructor(MaThongBao,MaNguoiNhan,NoiDungThongBao,ThoiGian){
        this.MaThongBao = MaThongBao;
        this.MaNguoiNhan = MaNguoiNhan;
        this.NoiDungThongBao = NoiDungThongBao;
        this.ThoiGian = ThoiGian;
    }
}

class NguoiNhan{
    constructor(MaNguoiNhan,HoTen,AnhDaiDien){
        this.MaNguoiNhan=MaNguoiNhan;
        this.HoTen=HoTen;
        this.AnhDaiDien=AnhDaiDien;
    }
}

class Story{
    constructor(MaStory, NguoiDung, HinhAnh, ThoiGian, CheDoRiengTuID){
        this.MaStory = MaStory;
        this.NguoiDung = NguoiDung;
        this.HinhAnh = HinhAnh;
        this.ThoiGian = ThoiGian;
        this.CheDoRiengTuID = CheDoRiengTuID;
    }
}

class Banbe{
    constructor(MaBanBe,TrangThai,HoTen,AnhDaiDien){
        this.MaBanBe = MaBanBe;
        this.TrangThai = TrangThai;
        this.HoTen =HoTen;
        this.AnhDaiDien = AnhDaiDien;
    }
}