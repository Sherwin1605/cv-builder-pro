import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layout, FileText, ChevronRight, ArrowRight } from 'lucide-react';
import { ModernGreenTemplate } from './ModernGreenTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { CoverLetterTemplate } from './CoverLetterTemplate';
import { ModernCoverLetter } from './ModernCoverLetter';
import { SAMPLE_CV_DATA, SAMPLE_LETTER_DATA } from '../samples';
import { CVData } from '../types';

interface TemplateGalleryProps {
  onSelect: (data: CVData) => void;
  initialTab?: 'cv' | 'letter';
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelect, initialTab = 'cv' }) => {
  const [activeTab, setActiveTab] = useState<'cv' | 'letter'>(initialTab);

  const cvTemplates = [
    { id: 'modern-green', name: 'Hiện đại (Xanh)', component: ModernGreenTemplate, color: '#064e3b' },
    { id: 'minimalist', name: 'Tối giản', component: MinimalistTemplate, color: '#1f2937' },
    { id: 'professional', name: 'Chuyên nghiệp', component: ProfessionalTemplate, color: '#1e3a8a' },
    { id: 'creative', name: 'Sáng tạo', component: CreativeTemplate, color: '#be185d' },
  ];

  const letterTemplates = [
    { id: 'cover-letter', name: 'Thư xin việc Cổ điển', component: CoverLetterTemplate, color: '#111827' },
    { id: 'modern-cover-letter', name: 'Thư xin việc Hiện đại', component: ModernCoverLetter, color: '#111827' },
  ];

  const templates = activeTab === 'cv' ? cvTemplates : letterTemplates;
  const sampleData = activeTab === 'cv' ? SAMPLE_CV_DATA : SAMPLE_LETTER_DATA;

  return (
    <div className="py-24 bg-white" id="templates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-primary-900 mb-4">Mẫu CV & Thư xin việc chuyên nghiệp</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            Lựa chọn từ các mẫu thiết kế chuẩn ATS, được tối ưu hóa cho từng ngành nghề.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1">
            <button
              onClick={() => setActiveTab('cv')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'cv' ? 'bg-white text-primary-900 shadow-sm' : 'text-gray-500 hover:text-primary-700'
              }`}
            >
              <Layout size={18} />
              Mẫu CV
            </button>
            <button
              onClick={() => setActiveTab('letter')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'letter' ? 'bg-white text-primary-900 shadow-sm' : 'text-gray-500 hover:text-primary-700'
              }`}
            >
              <FileText size={18} />
              Mẫu Thư xin việc
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {templates.map((tpl) => (
            <motion.div
              key={tpl.id}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => onSelect({ ...sampleData, templateId: tpl.id, color: tpl.color })}
            >
              <div className="aspect-[1/1.414] bg-gray-50 rounded-[2rem] border-2 border-gray-100 overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:border-primary-200 transition-all relative">
                {/* Preview Thumbnail (Scaled down template) */}
                <div className="absolute inset-0 origin-top-left scale-[0.25] w-[400%] h-[400%] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                  <tpl.component data={{ ...sampleData, templateId: tpl.id, color: tpl.color }} />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-colors flex items-center justify-center">
                  <div className="bg-white text-primary-900 px-6 py-3 rounded-xl font-bold shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all flex items-center gap-2">
                    Dùng mẫu này
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h4 className="font-bold text-primary-900 text-lg group-hover:text-emerald-600 transition-colors">{tpl.name}</h4>
                <p className="text-gray-400 text-sm font-medium mt-1">Chuẩn ATS • Miễn phí</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button 
            onClick={() => onSelect(activeTab === 'cv' ? SAMPLE_CV_DATA : SAMPLE_LETTER_DATA)}
            className="inline-flex items-center gap-3 text-primary-700 font-black text-lg hover:gap-5 transition-all group"
          >
            Xem tất cả các mẫu thiết kế
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
