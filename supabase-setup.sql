-- ==========================================
-- SUPABASE DATABASE SETUP SCRIPT
-- Dự án: CV Builder Pro
-- ==========================================

-- 1. Bảng Profiles (Thông tin người dùng)
-- Bảng này lưu trữ thông tin bổ sung của người dùng từ auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  updated_at timestamp with time zone default now()
);

-- 2. Bảng CVs (Danh sách CV)
-- Lưu trữ nội dung CV dưới dạng JSONB để linh hoạt
create table if not exists public.cvs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content jsonb not null,
  updated_at timestamp with time zone default now()
);

-- 3. Kích hoạt Row Level Security (RLS)
-- Bảo mật dữ liệu ở cấp độ dòng
alter table public.profiles enable row level security;
alter table public.cvs enable row level security;

-- 4. Chính sách bảo mật cho bảng Profiles
create policy "Profiles công khai cho mọi người xem" on public.profiles
  for select using (true);

create policy "Người dùng có thể tạo profile của chính mình" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Người dùng có thể cập nhật profile của chính mình" on public.profiles
  for update using (auth.uid() = id);

-- 5. Chính sách bảo mật cho bảng CVs
create policy "Người dùng chỉ xem được CV của chính mình" on public.cvs
  for select using (auth.uid() = user_id);

create policy "Người dùng có thể tạo CV mới" on public.cvs
  for insert with check (auth.uid() = user_id);

create policy "Người dùng có thể cập nhật CV của chính mình" on public.cvs
  for update using (auth.uid() = user_id);

create policy "Người dùng có thể xóa CV của chính mình" on public.cvs
  for delete using (auth.uid() = user_id);

-- 6. Chính sách cho Admin (Xem được tất cả CV)
create policy "Admin có quyền xem tất cả CV" on public.cvs
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- 7. Hàm và Trigger tự động tạo Profile khi có User mới đăng ký
-- Giúp đồng bộ dữ liệu từ Auth sang bảng Profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    case when new.email = 'admin@gmail.com' then 'admin' else 'user' end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger này sẽ chạy sau mỗi lần có user mới được tạo trong auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
