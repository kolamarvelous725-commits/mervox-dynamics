export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  memberSince: string;
  avatarUrl: string;
  bio?: string;
  occupation?: string;
  dob?: string;
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number; // 0 to 100
  status: 'Not Started' | 'In Progress' | 'Completed';
  lessonsCompleted: number;
  totalLessons: number;
  lessons?: string[];
  published?: boolean;
}

export interface UserCourseProgress {
  courseId: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  lessonsCompleted: number;
  totalLessons: number;
  completedLessons: number[]; // indices of lessons completed (1-based)
  studyMinutes: number;
}

export interface QuizAttempt {
  id: string;
  courseId: string;
  score: number; // total correct
  passed: boolean;
  attempts: number;
  date: string;
}

export interface RecentActivity {
  id: string;
  type: 'lesson' | 'quiz' | 'certificate' | 'live' | 'enroll';
  description: string;
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  date: string; // e.g., "July 31, 2026"
  time: string; // e.g., "16:00 BST"
  link: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: 'academic' | 'event' | 'alert';
}
