import React from 'react';
import { CVData } from '../types';

interface TemplateProps {
  data: CVData;
}

export const ModernGreenTemplate: React.FC<TemplateProps> = ({ data }) => {
  const primaryColor = data.color || '#064e3b';

  return (
    <div className="bg-white w-full min-h-[1100px] p-12 shadow-sm flex flex-col gap-8" style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
      {/* Header */}
      <div className="flex items-start border-l-8 pl-6 gap-8 min-h-[128px]" style={{ borderColor: primaryColor }}>
        {data.profileImage && (
          <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border-4 shadow-md bg-gray-50" style={{ borderColor: `${primaryColor}20` }}>
            <img 
              src={data.profileImage} 
              alt={data.fullName} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 py-2">
          <h1 className="text-4xl font-extrabold text-gray-800 uppercase tracking-tight break-words leading-tight">
            {data.fullName || "HỌ VÀ TÊN"}
          </h1>
          <p className="font-semibold mt-1 text-lg" style={{ color: primaryColor }}>
            Ứng viên tiềm năng
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-4">
            <span className="break-all">{data.email || "email@example.com"}</span>
            <span>•</span>
            <span>{data.phone || "0123 456 789"}</span>
            <span>•</span>
            <span className="break-words">{data.address || "Địa chỉ liên hệ"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="col-span-1 flex flex-col gap-8">
          <section>
            <h3 className="font-bold border-b-2 mb-4 uppercase text-sm tracking-wider" style={{ color: primaryColor, borderColor: primaryColor }}>
              Kỹ năng
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.length > 0 ? data.skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-bold border" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor, borderColor: `${primaryColor}20` }}>
                  {skill}
                </span>
              )) : <span className="text-gray-400 italic text-xs">Chưa có kỹ năng</span>}
            </div>
          </section>

          <section>
            <h3 className="font-bold border-b-2 mb-4 uppercase text-sm tracking-wider" style={{ color: primaryColor, borderColor: primaryColor }}>
              Học vấn
            </h3>
            <div className="flex flex-col gap-4">
              {data.education.length > 0 ? data.education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-sm font-bold text-gray-800">{edu.school}</p>
                  <p className="text-xs text-gray-600 font-medium">{edu.degree}</p>
                  <p className="text-[11px] text-gray-400 italic mt-0.5">{edu.period}</p>
                </div>
              )) : <p className="text-gray-400 italic text-xs">Chưa có thông tin học vấn</p>}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-2 flex flex-col gap-8">
          <section>
            <h3 className="font-bold flex items-center gap-2 mb-4 uppercase text-sm tracking-wider" style={{ color: primaryColor }}>
              <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Giới thiệu bản thân
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed text-justify whitespace-pre-line">
              {data.summary || "Hãy viết một đoạn ngắn giới thiệu về bản thân, mục tiêu nghề nghiệp và những giá trị bạn có thể mang lại cho doanh nghiệp."}
            </p>
          </section>

          <section>
            <h3 className="font-bold flex items-center gap-2 mb-4 uppercase text-sm tracking-wider" style={{ color: primaryColor }}>
              <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Kinh nghiệm làm việc
            </h3>
            <div className="flex flex-col gap-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l border-gray-100">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: `${primaryColor}40` }}></div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-base font-bold text-gray-800">{exp.role}</h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: primaryColor, backgroundColor: `${primaryColor}10` }}>
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: primaryColor }}>{exp.company}</p>
                  <p className="text-sm text-gray-600 text-justify whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
