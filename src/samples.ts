import { CVData } from './types';

export const SAMPLE_CV_DATA: CVData = {
  title: "CV Mẫu - Kỹ sư Phần mềm",
  fullName: "NGUYỄN VĂN A",
  email: "nguyenvana@example.com",
  phone: "0901 234 567",
  address: "Quận 1, TP. Hồ Chí Minh",
  summary: "Kỹ sư phần mềm với hơn 5 năm kinh nghiệm trong việc phát triển các ứng dụng web quy mô lớn. Chuyên gia về React, Node.js và kiến trúc hệ thống đám mây. Luôn nỗ lực tối ưu hóa hiệu suất và trải nghiệm người dùng.",
  experience: [
    {
      id: "1",
      company: "Công ty Công nghệ ABC",
      role: "Senior Fullstack Developer",
      period: "2020 - Hiện tại",
      description: "• Dẫn dắt đội ngũ 5 người phát triển nền tảng thương mại điện tử.\n• Tối ưu hóa tốc độ tải trang lên 40% bằng cách áp dụng Server-side Rendering.\n• Thiết kế và triển khai hệ thống microservices sử dụng Docker và Kubernetes."
    },
    {
      id: "2",
      company: "Tập đoàn Giải pháp XYZ",
      role: "Frontend Developer",
      period: "2018 - 2020",
      description: "• Phát triển giao diện người dùng cho ứng dụng quản lý tài chính.\n• Xây dựng thư viện UI dùng chung cho toàn công ty.\n• Phối hợp chặt chẽ với đội ngũ thiết kế UI/UX để đảm bảo tính nhất quán."
    }
  ],
  education: [
    {
      id: "1",
      school: "Đại học Bách Khoa TP.HCM",
      degree: "Cử nhân Khoa học Máy tính",
      period: "2014 - 2018"
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS", "Git", "Agile/Scrum"],
  templateId: "modern-green",
  color: "#064e3b"
};

export const SAMPLE_LETTER_DATA: CVData = {
  title: "Thư xin việc Mẫu",
  fullName: "TRẦN THỊ B",
  email: "tranthib@example.com",
  phone: "0987 654 321",
  address: "Quận Cầu Giấy, Hà Nội",
  summary: "Tôi là một chuyên viên Marketing với niềm đam mê mãnh liệt trong việc xây dựng thương hiệu và kết nối khách hàng. Với 3 năm kinh nghiệm trong lĩnh vực Digital Marketing, tôi đã giúp nhiều nhãn hàng tăng trưởng doanh thu đáng kể thông qua các chiến dịch sáng tạo.",
  experience: [],
  education: [],
  skills: [],
  templateId: "cover-letter",
  color: "#111827"
};
