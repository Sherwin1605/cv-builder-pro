import React from 'react';
import { CVData } from '../types';

interface TemplateProps {
  data: CVData;
}

export const CoverLetterTemplate: React.FC<TemplateProps> = ({ data }) => {
  const today = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="bg-white w-full min-h-[1100px] p-20 shadow-sm flex flex-col gap-10" style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-primary-900 pb-8 gap-8 min-h-[120px]">
        <div className="flex gap-8 flex-1 min-w-0">
          {data.profileImage && (
            <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img 
                src={data.profileImage} 
                alt={data.fullName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight mb-2 leading-tight break-words">
              {data.fullName || "HỌ VÀ TÊN"}
            </h1>
            <div className="flex flex-col gap-1 text-sm text-gray-500">
              <span className="break-all">{data.email || "email@example.com"}</span>
              <span>{data.phone || "0123 456 789"}</span>
              <span className="break-words">{data.address || "Địa chỉ liên hệ"}</span>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-primary-900 font-bold text-lg">THƯ XIN VIỆC</p>
          <p className="text-gray-400 text-sm mt-1">Ngày {today}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 text-gray-700 leading-relaxed text-justify">
        <p className="font-bold text-gray-800">Kính gửi Bộ phận Tuyển dụng / Ban Giám đốc,</p>
        
        <p>
          Tôi viết thư này để bày tỏ sự quan tâm sâu sắc của mình đối với vị trí công việc mà quý công ty đang tuyển dụng. Với những kinh nghiệm và kỹ năng mà tôi đã tích lũy được trong suốt thời gian qua, tôi tin rằng mình là một ứng viên phù hợp cho vị trí này.
        </p>

        <p>
          {data.summary || "Trong suốt quá trình làm việc, tôi đã có cơ hội phát triển các kỹ năng chuyên môn cũng như kỹ năng mềm cần thiết. Tôi luôn nỗ lực hoàn thành tốt mọi nhiệm vụ được giao và không ngừng học hỏi để nâng cao trình độ bản thân."}
        </p>

        <p>
          Tôi rất ấn tượng với môi trường làm việc chuyên nghiệp và những thành tựu mà quý công ty đã đạt được. Tôi mong muốn được đóng góp năng lực của mình vào sự phát triển chung của công ty và tin rằng đây sẽ là nơi lý tưởng để tôi phát huy tối đa khả năng của mình.
        </p>

        <p>
          Tôi đã đính kèm bản CV chi tiết để quý công ty có cái nhìn rõ nét hơn về quá trình học tập và làm việc của tôi. Rất mong nhận được phản hồi từ quý công ty để tôi có cơ hội được trao đổi trực tiếp hơn trong buổi phỏng vấn.
        </p>

        <p>Trân trọng,</p>
        
        <div className="mt-8">
          <p className="font-black text-xl text-primary-900 italic">{data.fullName || "Họ và tên"}</p>
        </div>
      </div>
    </div>
  );
};
