import React, { useRef } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { Experience, Education } from '../types';

interface EditorSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const EditorSection: React.FC<EditorSectionProps> = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
    <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
      <div className="p-2 bg-primary-50 text-primary-900 rounded-lg">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

interface CVEditorProps {
  cvData: any;
  updateField: (field: string, value: any) => void;
}

export const CVEditor: React.FC<CVEditorProps> = ({ cvData, updateField }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      role: '',
      period: '',
      description: ''
    };
    updateField('experience', [...(cvData.experience || []), newExp]);
  };

  const removeExperience = (id: string) => {
    updateField('experience', (cvData.experience || []).filter((exp: Experience) => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    const newExp = (cvData.experience || []).map((exp: Experience) => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateField('experience', newExp);
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      period: ''
    };
    updateField('education', [...(cvData.education || []), newEdu]);
  };

  const removeEducation = (id: string) => {
    updateField('education', (cvData.education || []).filter((edu: Education) => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const newEdu = (cvData.education || []).map((edu: Education) => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateField('education', newEdu);
  };

  return (
    <div className="flex flex-col gap-2">
      <EditorSection title="Tùy chỉnh giao diện" icon={<Plus size={20} />}>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Màu chủ đạo</label>
            <div className="flex flex-wrap gap-3">
              {['#064e3b', '#1e3a8a', '#7c2d12', '#4c1d95', '#111827', '#be185d'].map(color => (
                <button
                  key={color}
                  onClick={() => updateField('color', color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${cvData.color === color ? 'border-primary-500 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input 
                type="color" 
                value={cvData.color} 
                onChange={(e) => updateField('color', e.target.value)}
                className="w-10 h-10 rounded-full border-2 border-gray-200 cursor-pointer overflow-hidden"
              />
            </div>
          </div>
        </div>
      </EditorSection>

      <EditorSection title="Thông tin cá nhân" icon={<Plus size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            {cvData.profileImage ? (
              <div className="relative group/img">
                <img 
                  src={cvData.profileImage} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg" 
                />
                <div className="absolute -top-2 -right-2 flex gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateField('profileImage', '');
                    }}
                    className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all transform hover:scale-110"
                    title="Xóa ảnh"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                  <Upload className="text-white" size={24} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary-500">
                <div className="p-4 bg-white rounded-full shadow-sm">
                  <ImageIcon size={32} />
                </div>
                <p className="font-bold text-sm">Nhấn để tải ảnh từ máy tính</p>
                <p className="text-xs">Hỗ trợ JPG, PNG (Tối đa 2MB)</p>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Họ và tên</label>
            <input 
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 ring-primary-500 outline-none transition-all" 
              placeholder="Nguyễn Văn A"
              value={cvData.fullName || ''}
              onChange={(e) => updateField('fullName', e.target.value)}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Hoặc dán URL ảnh</label>
            <div className="relative">
              <input 
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 ring-primary-500 outline-none transition-all pr-10" 
                placeholder="https://example.com/photo.jpg"
                value={cvData.profileImage || ''}
                onChange={(e) => updateField('profileImage', e.target.value)}
              />
              {cvData.profileImage && (
                <button 
                  onClick={() => updateField('profileImage', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Xóa URL"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
            <input 
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 ring-primary-500 outline-none transition-all" 
              placeholder="email@example.com"
              value={cvData.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Số điện thoại</label>
            <input 
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 ring-primary-500 outline-none transition-all" 
              placeholder="0123 456 789"
              value={cvData.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Địa chỉ</label>
            <input 
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 ring-primary-500 outline-none transition-all" 
              placeholder="Hà Nội, Việt Nam"
              value={cvData.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
            />
          </div>
        </div>
      </EditorSection>

      <EditorSection title="Giới thiệu bản thân" icon={<Plus size={20} />}>
        <textarea 
          className="w-full border border-gray-200 p-3 rounded-lg h-32 focus:ring-2 ring-primary-500 outline-none transition-all resize-none" 
          placeholder="Viết một đoạn ngắn giới thiệu về bản thân..."
          value={cvData.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
        />
      </EditorSection>

      <EditorSection title="Kinh nghiệm làm việc" icon={<Plus size={20} />}>
        <div className="space-y-4">
          {(cvData.experience || []).map((exp: Experience) => (
            <div key={exp.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
              <button 
                onClick={() => removeExperience(exp.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                  className="border border-gray-200 p-2.5 rounded-lg bg-white outline-none focus:ring-2 ring-primary-500" 
                  placeholder="Công ty"
                  value={exp.company || ''}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                />
                <input 
                  className="border border-gray-200 p-2.5 rounded-lg bg-white outline-none focus:ring-2 ring-primary-500" 
                  placeholder="Vị trí"
                  value={exp.role || ''}
                  onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                />
              </div>
              <input 
                className="w-full border border-gray-200 p-2.5 rounded-lg bg-white outline-none focus:ring-2 ring-primary-500 mb-4" 
                placeholder="Thời gian (VD: 2021 - Hiện tại)"
                value={exp.period || ''}
                onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
              />
              <textarea 
                className="w-full border border-gray-200 p-2.5 rounded-lg bg-white outline-none focus:ring-2 ring-primary-500 h-24 resize-none" 
                placeholder="Mô tả công việc..."
                value={exp.description || ''}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              />
            </div>
          ))}
          <button 
            onClick={addExperience}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} /> Thêm kinh nghiệm
          </button>
        </div>
      </EditorSection>

      <EditorSection title="Học vấn" icon={<Plus size={20} />}>
        <div className="space-y-4">
          {(cvData.education || []).map((edu: Education) => (
            <div key={edu.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative">
              <button 
                onClick={() => removeEducation(edu.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                  className="border border-gray-200 p-2.5 rounded-lg bg-white outline-none focus:ring-2 ring-primary-500" 
                  placeholder="Trường học"
                  value={edu.school || ''}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                />
                <input 
                  className="border border-gray-200 p-2.5 rounded-lg bg-white outline-none focus:ring-2 ring-primary-500" 
                  placeholder="Bằng cấp"
                  value={edu.degree || ''}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                />
              </div>
              <input 
                className="w-full border border-gray-200 p-2.5 rounded-lg bg-white outline-none focus:ring-2 ring-primary-500" 
                placeholder="Thời gian (VD: 2017 - 2021)"
                value={edu.period || ''}
                onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
              />
            </div>
          ))}
          <button 
            onClick={addEducation}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} /> Thêm học vấn
          </button>
        </div>
      </EditorSection>

      <EditorSection title="Kỹ năng" icon={<Plus size={20} />}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {(cvData.skills || []).map((skill: string, index: number) => (
              <div key={index} className="bg-primary-50 text-primary-900 px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold text-sm border border-primary-100">
                {skill}
                <button 
                  onClick={() => updateField('skills', cvData.skills.filter((_: any, i: number) => i !== index))}
                  className="text-primary-400 hover:text-primary-900"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              id="skill-input"
              className="flex-1 border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 ring-primary-500" 
              placeholder="Thêm kỹ năng mới (VD: ReactJS)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val && !cvData.skills.includes(val)) {
                    updateField('skills', [...cvData.skills, val]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <button 
              onClick={() => {
                const input = document.getElementById('skill-input') as HTMLInputElement;
                const val = input.value.trim();
                if (val && !cvData.skills.includes(val)) {
                  updateField('skills', [...cvData.skills, val]);
                  input.value = '';
                }
              }}
              className="bg-primary-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-800 transition-colors"
            >
              Thêm
            </button>
          </div>
        </div>
      </EditorSection>
    </div>
  );
};
