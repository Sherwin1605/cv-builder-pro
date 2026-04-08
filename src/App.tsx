import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { 
  Download, 
  Save, 
  ChevronLeft, 
  Layout, 
  Eye, 
  Edit3, 
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  ArrowRight
} from 'lucide-react';
import { CVEditor } from './components/CVEditor';
import { ModernGreenTemplate } from './components/ModernGreenTemplate';
import { MinimalistTemplate } from './components/MinimalistTemplate';
import { ProfessionalTemplate } from './components/ProfessionalTemplate';
import { CreativeTemplate } from './components/CreativeTemplate';
import { CoverLetterTemplate } from './components/CoverLetterTemplate';
import { ModernCoverLetter } from './components/ModernCoverLetter';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { TemplateGallery } from './components/TemplateGallery';
import { CVData } from './types';
import { INITIAL_DATA } from './constants';
import { SAMPLE_CV_DATA, SAMPLE_LETTER_DATA } from './samples';
import { supabase, isSupabaseConfigured, checkSupabaseConnection } from './lib/supabase';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, ExternalLink as ExternalLinkIcon, CheckCircle2 as CheckIcon, Loader2 } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'builder' | 'dashboard' | 'auth' | 'cv-samples' | 'letter-samples'>('landing');
  const [cvData, setCvData] = useState<CVData>(INITIAL_DATA);
  const [user, setUser] = useState<any>(null);

  const handleAuthSuccess = (mockUser?: any) => {
    if (mockUser) {
      setUser(mockUser);
    }
    setView('dashboard');
  };
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string; loading: boolean }>({
    success: false,
    message: '',
    loading: true
  });

  const componentRef = useRef(null);

  useEffect(() => {
    const verifyConnection = async () => {
      const result = await checkSupabaseConnection();
      setConnectionStatus({ ...result, loading: false });
    };
    verifyConnection();

    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `CV_${cvData.fullName || 'Builder'}`,
  });

  const updateField = (field: string, value: any) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
      alert('Vui lòng cấu hình Supabase trong Settings để sử dụng tính năng này.');
      return;
    }

    if (!user) {
      setView('auth');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('cvs')
        .upsert({
          user_id: user.id,
          title: cvData.title,
          content: cvData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Đã lưu CV thành công!');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu CV.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen flex flex-col">
        {!connectionStatus.loading && !connectionStatus.success && (
          <div className="bg-amber-50 border-b border-amber-100 p-3 text-center text-amber-800 text-sm font-medium flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            {connectionStatus.message} Vui lòng cấu hình NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY trong Settings.
          </div>
        )}
        {connectionStatus.success && (
          <div className="bg-emerald-50 border-b border-emerald-100 p-2 text-center text-emerald-800 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <CheckIcon size={12} />
            Hệ thống đã kết nối thành công với Supabase
          </div>
        )}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
                <span className="text-white font-black text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-primary-900 tracking-tight">CV Builder Pro</span>
            </div>
            
            <div className="hidden md:flex items-center gap-10 text-gray-600 font-semibold">
              <button onClick={() => setView('cv-samples')} className="hover:text-primary-700 transition-colors">Mẫu CV</button>
              <button onClick={() => setView('letter-samples')} className="hover:text-primary-700 transition-colors">Thư xin việc</button>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <button 
                  onClick={() => setView('dashboard')}
                  className="flex items-center gap-2 text-primary-900 font-bold px-4 py-2 hover:bg-primary-50 rounded-xl transition-all"
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </button>
              ) : (
                <button 
                  onClick={() => setView('auth')}
                  className="text-primary-900 font-bold px-5 py-2.5 hover:bg-primary-50 rounded-xl transition-all"
                >
                  Đăng nhập
                </button>
              )}
              <button 
                onClick={() => setView('builder')}
                className="bg-primary-900 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-800 transition-all shadow-xl shadow-primary-900/20 active:scale-95"
              >
                Tạo CV ngay
              </button>
            </div>
          </nav>
        </header>

        <main className="flex-1">
          <section className="relative overflow-hidden bg-white pt-24 pb-32">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-50 rounded-full blur-[120px] opacity-60"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="text-center max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-800 text-sm font-bold border border-primary-100 mb-8">
                    <CheckIcon size={16} />
                    Nền tảng tạo CV số 1 Việt Nam
                  </span>
                  <h1 className="text-5xl md:text-7xl font-black text-primary-900 leading-[1.1] tracking-tight mb-8">
                    Tạo CV chuyên nghiệp <br/> chỉ trong <span className="text-emerald-600">5 phút</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                    Nền tảng cung cấp các mẫu CV và Thư xin việc chuẩn ATS, giúp bạn ấn tượng hơn trong mắt nhà tuyển dụng. Miễn phí và dễ sử dụng.
                  </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <button 
                  onClick={() => setView('builder')}
                  className="bg-primary-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-primary-800 hover:shadow-2xl hover:shadow-primary-900/30 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                >
                  Bắt đầu thiết kế ngay
                  <ArrowRight size={24} />
                </button>
                <button 
                  onClick={() => setView('cv-samples')}
                  className="bg-white text-primary-900 border-2 border-primary-900 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                >
                  Xem mẫu CV
                </button>
              </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-24"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Mẫu chuẩn ATS",
                      desc: "Tăng 80% cơ hội vượt qua vòng lọc hồ sơ tự động của các tập đoàn lớn.",
                      icon: <CheckIcon className="text-emerald-500" size={32} />,
                      bg: "bg-emerald-50"
                    },
                    {
                      title: "Tùy chỉnh 100%",
                      desc: "Thay đổi màu sắc, phông chữ và bố cục chỉ với vài cú click chuột.",
                      icon: <Edit3 className="text-blue-500" size={32} />,
                      bg: "bg-blue-50"
                    },
                    {
                      title: "Xuất PDF sắc nét",
                      desc: "File PDF được tối ưu hóa cho in ấn và hiển thị trên mọi thiết bị.",
                      icon: <Download className="text-purple-500" size={32} />,
                      bg: "bg-purple-50"
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all group">
                      <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-primary-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <TemplateGallery onSelect={(data) => {
                setCvData(data);
                setView('builder');
              }} />

              {/* Testimonials Section */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-32 pt-20 border-t border-gray-100"
              >
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-black text-primary-900 mb-4">Được tin dùng bởi hàng ngàn ứng viên</h2>
                  <p className="text-gray-500 font-medium">Lắng nghe những câu chuyện thành công từ người dùng của chúng tôi</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      name: "Nguyễn Minh Anh",
                      role: "Software Engineer @ FPT",
                      content: "Giao diện cực kỳ dễ dùng. Mình chỉ mất 10 phút để có một bản CV chuyên nghiệp và đã nhận được lời mời phỏng vấn ngay sau đó.",
                      avatar: "https://i.pravatar.cc/150?u=1"
                    },
                    {
                      name: "Trần Thu Hà",
                      role: "UI/UX Designer",
                      content: "Khả năng tùy chỉnh màu sắc và phông chữ rất tuyệt vời. Nó giúp mình thể hiện được cá tính riêng ngay trên bản CV.",
                      avatar: "https://i.pravatar.cc/150?u=2"
                    },
                    {
                      name: "Lê Hoàng Nam",
                      role: "Marketing Manager",
                      content: "Mẫu thư xin việc đi kèm rất hữu ích. Hệ thống lưu trữ đám mây giúp mình có thể chỉnh sửa CV ở bất cứ đâu.",
                      avatar: "https://i.pravatar.cc/150?u=3"
                    }
                  ].map((review, i) => (
                    <div key={i} className="bg-gray-50 p-8 rounded-[2rem] relative">
                      <div className="flex items-center gap-4 mb-6">
                        <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-bold text-primary-900">{review.name}</h4>
                          <p className="text-xs text-gray-500 font-medium">{review.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 italic leading-relaxed">"{review.content}"</p>
                      <div className="absolute top-8 right-8 text-primary-100">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V12C6.017 12.5523 5.56929 13 5.017 13H3.017V21H5.017Z" /></svg>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <footer className="bg-primary-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-primary-900 font-black">C</span>
                  </div>
                  <span className="text-2xl font-bold tracking-tight">CV Builder Pro</span>
                </div>
                <p className="text-primary-100 max-w-sm leading-relaxed">
                  Giúp hàng triệu ứng viên Việt Nam tiếp cận cơ hội việc làm mơ ước thông qua những bản CV chuyên nghiệp và ấn tượng.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-6">Sản phẩm</h4>
                <ul className="space-y-4 text-primary-200">
                  <li><a href="#" className="hover:text-white transition">Mẫu CV</a></li>
                  <li><a href="#" className="hover:text-white transition">Thư xin việc</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-6">Hỗ trợ</h4>
                <ul className="space-y-4 text-primary-200">
                  <li><a href="#" className="hover:text-white transition">Hướng dẫn</a></li>
                  <li><a href="#" className="hover:text-white transition">Liên hệ</a></li>
                  <li><a href="#" className="hover:text-white transition">Điều khoản</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-20 pt-8 border-t border-primary-800 text-center text-primary-300 text-sm">
              © 2026 CV Builder Pro. Tất cả quyền được bảo lưu.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <Auth 
        onSuccess={handleAuthSuccess} 
        onBack={() => setView('landing')} 
      />
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView('landing')}>
              <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
                <span className="text-white font-black text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-primary-900 tracking-tight">CV Builder Pro</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 bg-primary-100 text-primary-900 rounded-full flex items-center justify-center font-bold">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-bold text-gray-700">{user?.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Đăng xuất"
              >
                <LogOut size={22} />
              </button>
            </div>
          </nav>
        </header>
        <main className="flex-1">
          <Dashboard 
            user={user}
            onEdit={(cv) => {
              setCvData({ ...INITIAL_DATA, ...cv });
              setView('builder');
            }}
            onCreate={() => {
              setCvData(INITIAL_DATA);
              setView('builder');
            }}
          />
        </main>
      </div>
    );
  }

  if (view === 'cv-samples' || view === 'letter-samples') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView(user ? 'dashboard' : 'landing')}>
              <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
                <span className="text-white font-black text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-primary-900 tracking-tight">CV Builder Pro</span>
            </div>
            <button 
              onClick={() => setView(user ? 'dashboard' : 'landing')}
              className="text-primary-900 font-bold flex items-center gap-2 hover:gap-3 transition-all"
            >
              <ChevronLeft size={20} />
              Quay lại {user ? 'bảng điều khiển' : 'trang chủ'}
            </button>
          </nav>
        </header>
        <main className="flex-1">
          <TemplateGallery 
            initialTab={view === 'cv-samples' ? 'cv' : 'letter'}
            onSelect={(data) => {
              setCvData(data);
              setView('builder');
            }} 
          />
        </main>
      </div>
    );
  }

  if (view === 'builder') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-primary-900 text-white h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView(user ? 'dashboard' : 'landing')}
              className="p-2 hover:bg-primary-800 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="h-6 w-px bg-primary-800 hidden md:block"></div>
            <div className="flex flex-col">
              <input 
                className="bg-transparent border-none outline-none font-bold text-sm md:text-base focus:ring-1 ring-primary-700 rounded px-1 w-40 md:w-64"
                value={cvData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
              />
              <span className="text-[10px] text-primary-300 uppercase font-bold tracking-widest ml-1">Đang chỉnh sửa</span>
            </div>
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                <select 
                  className="bg-white text-primary-900 text-xs font-bold px-3 py-1.5 rounded-lg outline-none shadow-sm"
                  value={cvData.templateId}
                  onChange={(e) => updateField('templateId', e.target.value)}
                >
                  <optgroup label="Mẫu CV">
                    <option value="modern-green">Mẫu Hiện đại</option>
                    <option value="minimalist">Mẫu Tối giản</option>
                    <option value="professional">Mẫu Chuyên nghiệp</option>
                    <option value="creative">Mẫu Sáng tạo</option>
                  </optgroup>
                  <optgroup label="Thư xin việc">
                    <option value="cover-letter">Thư xin việc Chuẩn</option>
                    <option value="modern-cover-letter">Thư xin việc Hiện đại</option>
                  </optgroup>
                </select>
              </div>
            </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="hidden md:flex items-center gap-2 bg-primary-800 hover:bg-primary-700 text-white px-5 py-2 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Đang lưu...' : 'Lưu CV'}
            </button>
            <button 
              onClick={handlePrint}
              className="bg-white text-primary-900 px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-50 transition-all shadow-lg active:scale-95"
            >
              <Download size={18} />
              <span className="hidden md:inline">Xuất PDF</span>
            </button>
          </div>
        </header>

        <div className="md:hidden bg-white border-b flex p-1 sticky top-16 z-40">
          <button 
            onClick={() => setActiveTab('edit')}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
              activeTab === 'edit' ? "bg-primary-50 text-primary-900" : "text-gray-500"
            )}
          >
            <Edit3 size={18} /> Nhập liệu
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
              activeTab === 'preview' ? "bg-primary-50 text-primary-900" : "text-gray-500"
            )}
          >
            <Eye size={18} /> Xem trước
          </button>
        </div>

        <main className="flex-1 flex overflow-hidden">
          {/* Editor Column */}
          <div className={cn(
            "flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 custom-scrollbar",
            activeTab === 'preview' ? "hidden md:block" : "block"
          )}>
            <div className="max-w-3xl mx-auto">
              <CVEditor cvData={cvData} updateField={updateField} />
            </div>
          </div>

          {/* Preview Column */}
          <div className={cn(
            "flex-1 bg-gray-200 overflow-y-auto p-4 md:p-12 flex justify-center custom-scrollbar",
            activeTab === 'edit' ? "hidden lg:flex" : "flex"
          )}>
            <div className="w-full max-w-[210mm] origin-top scale-[0.9] md:scale-100">
              <div ref={componentRef} className="shadow-2xl">
                {cvData.templateId === 'cover-letter' ? (
                  <CoverLetterTemplate data={cvData} />
                ) : cvData.templateId === 'modern-cover-letter' ? (
                  <ModernCoverLetter data={cvData} />
                ) : cvData.templateId === 'minimalist' ? (
                  <MinimalistTemplate data={cvData} />
                ) : cvData.templateId === 'professional' ? (
                  <ProfessionalTemplate data={cvData} />
                ) : cvData.templateId === 'creative' ? (
                  <CreativeTemplate data={cvData} />
                ) : (
                  <ModernGreenTemplate data={cvData} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
