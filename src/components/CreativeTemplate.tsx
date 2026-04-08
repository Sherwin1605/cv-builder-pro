import React from 'react';
import { CVData } from '../types';

interface TemplateProps {
  data: CVData;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const primaryColor = data.color || '#be185d';

  return (
    <div className="bg-white w-full min-h-[1100px] shadow-sm flex flex-col overflow-hidden" style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
      {/* Header with Background */}
      <div className="p-16 text-white relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        
        <div className="relative z-10 flex items-center gap-8">
          {data.profileImage && (
            <div className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src={data.profileImage} 
                alt={data.fullName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-6xl font-black mb-4 tracking-tight leading-none break-words">
              {data.fullName || "HỌ VÀ TÊN"}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-white/80">
              <span className="break-all">{data.email}</span>
              <span>•</span>
              <span>{data.phone}</span>
              <span>•</span>
              <span className="break-words">{data.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-16 grid grid-cols-3 gap-16">
        <div className="col-span-2 flex flex-col gap-12">
          <section>
            <h3 className="text-2xl font-black mb-6 flex items-center gap-4" style={{ color: primaryColor }}>
              <span className="w-12 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Kinh nghiệm
            </h3>
            <div className="space-y-10">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-8 border-l-2 border-gray-100">
                  <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: primaryColor }}></div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-xl font-bold text-gray-800">{exp.role}</h4>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">{exp.period}</span>
                  </div>
                  <p className="text-sm font-bold mb-4" style={{ color: primaryColor }}>{exp.company}</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-black mb-6 flex items-center gap-4" style={{ color: primaryColor }}>
              <span className="w-12 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Học vấn
            </h3>
            <div className="grid grid-cols-2 gap-8">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-lg font-bold text-gray-800 mb-1">{edu.school}</p>
                  <p className="text-sm font-medium text-gray-500 mb-2">{edu.degree}</p>
                  <p className="text-xs font-bold" style={{ color: primaryColor }}>{edu.period}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-1 flex flex-col gap-12">
          <section>
            <h3 className="text-2xl font-black mb-6" style={{ color: primaryColor }}>Giới thiệu</h3>
            <p className="text-sm text-gray-600 leading-loose text-justify font-medium">
              {data.summary || "Mô tả sáng tạo về bản thân."}
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-black mb-6" style={{ color: primaryColor }}>Kỹ năng</h3>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2" style={{ borderColor: `${primaryColor}20`, color: primaryColor, backgroundColor: `${primaryColor}05` }}>
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
