import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  MoreVertical, 
  Clock, 
  ExternalLink,
  Loader2,
  LayoutGrid,
  List,
  Users,
  TrendingUp,
  Layout as LayoutIcon,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { CVData } from '../types';
import { INITIAL_DATA } from '../constants';

interface DashboardProps {
  onEdit: (cv: CVData) => void;
  onCreate: () => void;
  user: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ onEdit, onCreate, user }) => {
  const [cvs, setCvs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [adminTab, setAdminTab] = useState<'users' | 'templates' | 'settings'>('users');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkAdmin();
    }
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }
    fetchCVs();
  }, [user]);

  const checkAdmin = async () => {
    if (!user) return;

    // Demo bypass check first
    if (user.email === 'admin@gmail.com' || user.id === 'demo-admin-id') {
      setIsAdmin(true);
      fetchStats();
      fetchUsers();
      return;
    }

    if (!isSupabaseConfigured) return;

    // Check role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      setIsAdmin(true);
      fetchStats();
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Mock users for demo
      setUsers([
        { id: '1', full_name: 'Nguyễn Văn A', email: 'vana@gmail.com', role: 'user', updated_at: new Date().toISOString() },
        { id: '2', full_name: 'Trần Thị B', email: 'thib@gmail.com', role: 'user', updated_at: new Date().toISOString() },
        { id: '3', full_name: 'Admin Demo', email: 'admin@gmail.com', role: 'admin', updated_at: new Date().toISOString() },
      ]);
    }
  };

  const fetchStats = async () => {
    try {
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      setStats({ userCount: userCount || 3 });
    } catch (err) {
      setStats({ userCount: 3 });
    }
  };

  const deleteUser = async (id: string) => {
    if (id === 'demo-admin-id' || id === '3') {
      alert('Không thể xóa tài khoản Admin hệ thống.');
      return;
    }
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      // Mock delete for demo
      setUsers(users.filter(u => u.id !== id));
      alert('Đã xóa người dùng (Chế độ Demo).');
    }
  };

  const updateUserRole = async (id: string, newRole: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id);
      if (error) throw error;
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      // Mock update for demo
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      setEditingUser(null);
    }
  };

  const filteredUsers = (users || []).filter(u => {
    const matchesSearch = (u.full_name || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                         (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    const joinDate = new Date(u.updated_at);
    const matchesStartDate = !startDate || joinDate >= new Date(startDate);
    const matchesEndDate = !endDate || joinDate <= new Date(endDate + 'T23:59:59');
    
    return matchesSearch && matchesRole && matchesStartDate && matchesEndDate;
  });

  const fetchCVs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setCvs(data || []);
    } catch (err) {
      console.error(err);
      // Mock CVs for demo
      const mockCVContent = {
        ...INITIAL_DATA,
        fullName: 'Nguyễn Văn A',
        experience: [
          { id: '1', company: 'Công ty Công nghệ ABC', role: 'Software Engineer', period: '2021 - Hiện tại', description: 'Phát triển ứng dụng web...' }
        ],
        education: [
          { id: '1', school: 'Đại học Bách Khoa', degree: 'Kỹ sư CNTT', period: '2017 - 2021' }
        ],
        skills: ['ReactJS', 'Node.js', 'TypeScript']
      };
      
      setCvs([
        { id: '1', title: 'CV Kỹ sư phần mềm', updated_at: new Date().toISOString(), content: mockCVContent },
        { id: '2', title: 'CV Nhân viên Marketing', updated_at: new Date().toISOString(), content: { ...mockCVContent, title: 'CV Nhân viên Marketing', fullName: 'Trần Thị B' } }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCV = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa CV này?')) return;
    
    try {
      const { error } = await supabase.from('cvs').delete().eq('id', id);
      if (error) throw error;
      setCvs(cvs.filter(cv => cv.id !== id));
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa CV.');
    }
  };

  const filteredCvs = (cvs || []).filter(cv => 
    (cv.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cv.content?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {isAdmin && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-500 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                <Users size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Tổng người dùng</p>
                <p className="text-2xl font-black text-gray-800">{stats.userCount}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-orange-500 p-4 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                <LayoutIcon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Mẫu thiết kế</p>
                <p className="text-2xl font-black text-gray-800">6</p>
              </div>
            </div>
          </div>
        )}

        {isAdmin ? (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
              <button 
                onClick={() => setAdminTab('users')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${adminTab === 'users' ? 'bg-primary-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Quản lý Người dùng
              </button>
              <button 
                onClick={() => setAdminTab('templates')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${adminTab === 'templates' ? 'bg-primary-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Quản lý Mẫu thiết kế
              </button>
              <button 
                onClick={() => setAdminTab('settings')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${adminTab === 'settings' ? 'bg-primary-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Cài đặt hệ thống
              </button>
            </div>

            {adminTab === 'users' ? (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-gray-600 min-w-[140px]"
                      >
                        <option value="all">Tất cả vai trò</option>
                        <option value="user">Người dùng</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-transparent focus-within:bg-white focus-within:border-primary-500 transition-all">
                        <span className="text-xs font-black text-gray-400 uppercase">Từ</span>
                        <input 
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-transparent outline-none text-sm font-bold text-gray-600"
                        />
                        <span className="text-xs font-black text-gray-400 uppercase ml-2">Đến</span>
                        <input 
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-transparent outline-none text-sm font-bold text-gray-600"
                        />
                      </div>
                      {(userSearchQuery || roleFilter !== 'all' || startDate || endDate) && (
                        <button 
                          onClick={() => {
                            setUserSearchQuery('');
                            setRoleFilter('all');
                            setStartDate('');
                            setEndDate('');
                          }}
                          className="px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all text-sm"
                        >
                          Xóa lọc
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Người dùng</th>
                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Email</th>
                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Vai trò</th>
                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Ngày tham gia</th>
                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary-100 text-primary-900 rounded-full flex items-center justify-center font-bold">
                                {u.full_name?.[0] || 'U'}
                              </div>
                              <span className="font-bold text-gray-800">{u.full_name || 'Chưa cập nhật'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-gray-600 font-medium">{u.email}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-gray-500 font-medium">
                            {new Date(u.updated_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setEditingUser(u)}
                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                title="Chỉnh sửa vai trò"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button 
                                onClick={() => deleteUser(u.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Xóa người dùng"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : adminTab === 'templates' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { id: 'modern-green', name: 'Modern Green', desc: 'Thiết kế hiện đại, chuyên nghiệp' },
                  { id: 'minimalist', name: 'Minimalist', desc: 'Tối giản, tinh tế và thanh lịch' },
                  { id: 'professional', name: 'Professional', desc: 'Phong cách truyền thống, tin cậy' },
                  { id: 'creative', name: 'Creative', desc: 'Phá cách, nổi bật sự sáng tạo' },
                  { id: 'cover-letter', name: 'Cover Letter', desc: 'Mẫu thư xin việc chuẩn' },
                  { id: 'modern-letter', name: 'Modern Letter', desc: 'Thư xin việc phong cách hiện đại' }
                ].map((t) => (
                  <div key={t.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <LayoutIcon className="text-orange-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-primary-900 mb-2">{t.name}</h3>
                    <p className="text-gray-500 mb-6">{t.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Hoạt động</span>
                      <button className="text-primary-900 font-bold text-sm hover:underline">Xem chi tiết</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LayoutIcon className="text-primary-900" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Cài đặt hệ thống</h3>
                <div className="max-w-md mx-auto space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="text-left">
                      <p className="font-bold text-gray-800">Đăng ký người dùng</p>
                      <p className="text-xs text-gray-500">Cho phép người dùng mới tạo tài khoản</p>
                    </div>
                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="text-left">
                      <p className="font-bold text-gray-800">Bảo trì hệ thống</p>
                      <p className="text-xs text-gray-500">Tạm thời đóng cửa để cập nhật</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-primary-900 text-white rounded-2xl font-bold hover:bg-primary-800 transition-all mt-6">
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-black text-primary-900 tracking-tight mb-2">CV của tôi</h1>
                <p className="text-gray-500 font-medium">Quản lý và chỉnh sửa các bản CV chuyên nghiệp của bạn</p>
              </div>
              <button 
                onClick={onCreate}
                className="bg-primary-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-800 transition-all shadow-xl shadow-primary-900/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus size={24} /> Tạo CV mới
              </button>
            </header>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  placeholder="Tìm kiếm CV theo tiêu đề hoặc tên..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button className="p-2 bg-white text-primary-900 rounded-lg shadow-sm"><LayoutGrid size={20} /></button>
                <button className="p-2 text-gray-400 hover:text-gray-600"><List size={20} /></button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="animate-spin text-primary-900" size={48} />
                <p className="text-gray-500 font-bold">Đang tải danh sách CV...</p>
              </div>
            ) : filteredCvs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCvs?.map((cv) => (
                  <motion.div 
                    key={cv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary-900/10 transition-all duration-500 flex flex-col"
                  >
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                      <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/40 transition-all duration-500 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 z-10">
                        <button 
                          onClick={() => onEdit(cv.content)}
                          className="bg-white text-primary-900 p-3 rounded-xl hover:scale-110 transition-transform shadow-xl"
                        >
                          <Edit3 size={20} />
                        </button>
                        <button 
                          onClick={() => deleteCV(cv.id)}
                          className="bg-white text-red-500 p-3 rounded-xl hover:scale-110 transition-transform shadow-xl"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div className="w-full h-full p-4 origin-top scale-[0.4] group-hover:scale-[0.42] transition-transform duration-700">
                        <div className="pointer-events-none shadow-2xl">
                          {/* CV Preview Thumbnail - Simplified */}
                          <div className="bg-white w-[210mm] min-h-[297mm] p-10 border border-gray-200">
                            <div className="w-48 h-8 bg-primary-900 mb-4"></div>
                            <div className="w-full h-4 bg-gray-100 mb-2"></div>
                            <div className="w-3/4 h-4 bg-gray-100 mb-8"></div>
                            <div className="grid grid-cols-3 gap-8">
                              <div className="col-span-1 space-y-4">
                                <div className="w-full h-32 bg-gray-50"></div>
                                <div className="w-full h-32 bg-gray-50"></div>
                              </div>
                              <div className="col-span-2 space-y-4">
                                <div className="w-full h-64 bg-gray-50"></div>
                                <div className="w-full h-64 bg-gray-50"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-primary-900 transition-colors line-clamp-1">
                        {cv.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(cv.updated_at).toLocaleDateString('vi-VN')}
                      </p>
                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary-700 bg-primary-50 px-2 py-1 rounded">
                          Modern Green
                        </span>
                        <button 
                          onClick={() => onEdit(cv.content)}
                          className="text-primary-900 hover:underline font-bold text-sm flex items-center gap-1"
                        >
                          Chỉnh sửa <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={48} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Chưa có CV nào</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-10">
                  Bạn chưa tạo bản CV nào. Hãy bắt đầu ngay để sở hữu một bản CV chuyên nghiệp chuẩn ATS.
                </p>
                <button 
                  onClick={onCreate}
                  className="bg-primary-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-800 transition-all shadow-xl shadow-primary-900/20"
                >
                  Tạo CV đầu tiên
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="bg-primary-900 p-8 text-white">
              <h3 className="text-2xl font-bold">Chỉnh sửa người dùng</h3>
              <p className="text-primary-200 text-sm mt-1">{editingUser.email}</p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Vai trò hệ thống</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => updateUserRole(editingUser.id, 'user')}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${editingUser.role === 'user' ? 'border-primary-900 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <p className="font-bold text-gray-800">User</p>
                    <p className="text-xs text-gray-500">Quyền hạn cơ bản</p>
                  </button>
                  <button 
                    onClick={() => updateUserRole(editingUser.id, 'admin')}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${editingUser.role === 'admin' ? 'border-primary-900 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <p className="font-bold text-gray-800">Admin</p>
                    <p className="text-xs text-gray-500">Toàn quyền quản trị</p>
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => updateUserRole(editingUser.id, editingUser.role)}
                  className="flex-1 py-4 bg-primary-900 text-white rounded-2xl font-bold hover:bg-primary-800 transition-all"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
