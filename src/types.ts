export interface CVData {
  id?: string;
  title: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  templateId: string;
  color: string;
  profileImage?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  period: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
}
