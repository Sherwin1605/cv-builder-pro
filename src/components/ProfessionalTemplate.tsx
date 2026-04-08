import React from 'react';
import { CVData } from '../types';

interface TemplateProps {
  data: CVData;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const primaryColor = data.color || '#1e3a8a';

  return (
    <div className="bg-white w-full min-h-[1100px] shadow-sm flex flex-col" style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
      {/* Sidebar & Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-50 p-10 flex flex-col gap-10 border-r border-gray-100">
          {data.profileImage && (
            <div className="w-full aspect-square flex-shrink-0 rounded-xl overflow-hidden border-4 border-white shadow-lg mb-2">
              <img 
                src={data.profileImage} 
                alt={data.fullName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Liên hệ</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex flex-col"><span className="font-bold text-gray-800">Email:</span> {data.email}</p>
              <p className="flex flex-col"><span className="font-bold text-gray-800">SĐT:</span> {data.phone}</p>
              <p className="flex flex-col"><span className="font-bold text-gray-800">Địa chỉ:</span> {data.address}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Kỹ năng</h3>
            <div className="flex flex-col gap-2">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                  <span className="text-sm text-gray-700 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Học vấn</h3>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-sm font-bold text-gray-800">{edu.school}</p>
                  <p className="text-xs text-gray-500">{edu.degree}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{edu.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-12 flex flex-col gap-10">
          <header>
            <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">
              {data.fullName || "HỌ VÀ TÊN"}
            </h1>
            <div className="h-2 w-20 rounded-full mb-6" style={{ backgroundColor: primaryColor }}></div>
            <p className="text-gray-600 leading-relaxed text-sm italic">
              {data.summary || "Mô tả chuyên nghiệp về bản thân."}
            </p>
          </header>

          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px]" style={{ backgroundColor: primaryColor }}></span>
              Kinh nghiệm làm việc
            </h3>
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-base font-bold text-gray-800">{exp.role}</h4>
                    <span className="text-xs font-bold text-gray-400">{exp.period}</span>
                  </div>
                  <p className="text-sm font-bold mb-3" style={{ color: primaryColor }}>{exp.company}</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
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
