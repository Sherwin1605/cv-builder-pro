import React from 'react';
import { CVData } from '../types';

interface TemplateProps {
  data: CVData;
}

export const ModernCoverLetter: React.FC<TemplateProps> = ({ data }) => {
  const primaryColor = data.color || '#111827';

  return (
    <div className="bg-white w-full min-h-[1100px] p-20 shadow-sm flex flex-col gap-16" style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-end border-b-4 pb-12 gap-8" style={{ borderColor: primaryColor }}>
        <div className="flex items-center gap-8 flex-1 min-w-0">
          {data.profileImage && (
            <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border-4 border-gray-50 shadow-xl">
              <img 
                src={data.profileImage} 
                alt={data.fullName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none break-words mb-4">
              {data.fullName || "HỌ VÀ TÊN"}
            </h1>
            <div className="flex flex-col gap-1 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <span className="break-all">{data.email}</span>
              <span>{data.phone}</span>
              <span className="break-words">{data.address}</span>
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col gap-2 flex-shrink-0">
          <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>Thư xin việc</span>
          <span className="text-sm font-bold text-gray-500">{new Date().toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      <div className="flex flex-col gap-10 max-w-3xl">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest text-gray-400">Kính gửi,</p>
          <p className="text-xl font-bold text-gray-800">Bộ phận Tuyển dụng</p>
        </div>

        <div className="space-y-8 text-lg text-gray-700 leading-relaxed text-justify">
          <p className="font-medium">
            Tôi viết thư này để bày tỏ sự quan tâm sâu sắc của mình đối với vị trí công việc tại quý công ty. Với những kinh nghiệm và kỹ năng đã tích lũy được, tôi tin rằng mình là một ứng viên phù hợp cho vai trò này.
          </p>
          
          <p className="font-medium">
            {data.summary || "Hãy viết nội dung thư xin việc của bạn ở đây. Giới thiệu về bản thân, lý do bạn quan tâm đến vị trí này và những giá trị bạn có thể mang lại cho công ty."}
          </p>

          <p className="font-medium">
            Tôi rất mong có cơ hội được trao đổi trực tiếp với quý công ty về cách mà kinh nghiệm của tôi có thể đóng góp vào sự phát triển chung. Cảm ơn quý công ty đã dành thời gian xem xét hồ sơ của tôi.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          <p className="text-sm font-black uppercase tracking-widest text-gray-400">Trân trọng,</p>
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-black text-gray-900 italic">
              {data.fullName || "Họ và tên"}
            </p>
            <div className="h-1 w-24 rounded-full" style={{ backgroundColor: primaryColor }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
