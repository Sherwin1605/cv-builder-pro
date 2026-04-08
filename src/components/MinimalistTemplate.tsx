import React from 'react';
import { CVData } from '../types';

interface TemplateProps {
  data: CVData;
}

export const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => {
  const primaryColor = data.color || '#1f2937';

  return (
    <div className="bg-white w-full min-h-[1100px] p-16 shadow-sm flex flex-col gap-12" style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
      {/* Header */}
      <div className="border-b pb-10 flex items-center gap-8">
        {data.profileImage && (
          <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
            <img 
              src={data.profileImage} 
              alt={data.fullName} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-5xl font-light text-gray-900 tracking-widest uppercase mb-4 leading-tight">
            {data.fullName || "HỌ VÀ TÊN"}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
            <span>{data.email}</span>
            <span className="hidden sm:inline">|</span>
            <span>{data.phone}</span>
            <span className="hidden sm:inline">|</span>
            <span>{data.address}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-center" style={{ color: primaryColor }}>
          Giới thiệu
        </h3>
        <p className="text-sm text-gray-600 leading-loose text-center max-w-2xl mx-auto italic">
          "{data.summary || "Mô tả ngắn gọn về bản thân và mục tiêu nghề nghiệp của bạn."}"
        </p>
      </section>

      <div className="grid grid-cols-1 gap-12">
        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 border-b pb-2" style={{ color: primaryColor }}>
            Kinh nghiệm làm việc
          </h3>
          <div className="space-y-10">
            {data.experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-xs font-bold text-gray-400 pt-1 uppercase">
                  {exp.period}
                </div>
                <div className="col-span-3">
                  <h4 className="text-lg font-bold text-gray-800 mb-1">{exp.role}</h4>
                  <p className="text-sm font-bold mb-3" style={{ color: primaryColor }}>{exp.company}</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-12">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 border-b pb-2" style={{ color: primaryColor }}>
              Học vấn
            </h3>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-sm font-bold text-gray-800">{edu.school}</p>
                  <p className="text-xs text-gray-500">{edu.degree}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{edu.period}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 border-b pb-2" style={{ color: primaryColor }}>
              Kỹ năng
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-sm text-gray-700 font-medium flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
