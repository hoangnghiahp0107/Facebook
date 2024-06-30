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
