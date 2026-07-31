import { UserCourseProgress, QuizAttempt, RecentActivity, Notification } from "@/types/academy";

const getStorageKey = (key: string, userId: string) => `mervox_academy_${key}_${userId}`;

const syncToCloud = async (users: any[]) => {
  try {
    await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fb828537555d5", {
      method: "PUT",
      body: JSON.stringify({
        name: "Mervox Academy DB - users",
        data: { list: users }
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {}
};

const syncAnnouncementsToCloud = async (list: any[]) => {
  try {
    await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fb828557755d6", {
      method: "PUT",
      body: JSON.stringify({
        name: "Mervox Academy DB - announcements",
        data: { list }
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {}
};

const syncLiveClassesToCloud = async (list: any[]) => {
  try {
    await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fb8285b7555d7", {
      method: "PUT",
      body: JSON.stringify({
        name: "Mervox Academy DB - live_classes",
        data: { list }
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {}
};

const syncCoursesToCloud = async (list: any[]) => {
  try {
    await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fb8285e0455d8", {
      method: "PUT",
      body: JSON.stringify({
        name: "Mervox Academy DB - courses",
        data: { list }
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {}
};

const syncAssignmentsToCloud = async (list: any[]) => {
  try {
    await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fb8285fc255d9", {
      method: "PUT",
      body: JSON.stringify({
        name: "Mervox Academy DB - assignments",
        data: { list }
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {}
};

export const AcademyDB = {
  // Course progress functions
  getProgress(userId: string): UserCourseProgress[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(getStorageKey("progress", userId));
    return data ? JSON.parse(data) : [];
  },

  saveProgress(userId: string, progress: UserCourseProgress[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(getStorageKey("progress", userId), JSON.stringify(progress));
    this.syncUserData(userId);
  },

  enroll(userId: string, courseId: string, courseTitle: string): UserCourseProgress {
    const progress = this.getProgress(userId);
    let existing = progress.find((p) => p.courseId === courseId);
    
    if (!existing) {
      existing = {
        courseId,
        progress: 0,
        status: "In Progress",
        lessonsCompleted: 0,
        totalLessons: 20,
        completedLessons: [],
        studyMinutes: 0,
      };
      progress.push(existing);
      this.saveProgress(userId, progress);

      // Log activity
      this.logActivity(userId, "enroll", `Enrolled in ${courseTitle}`);
      
      // Trigger notification
      this.addNotification(userId, `You have successfully enrolled in ${courseTitle}. Start learning now!`);
    }
    
    return existing;
  },

  completeLesson(userId: string, courseId: string, courseTitle: string, lessonIndex: number, lessonTitle: string): UserCourseProgress {
    const progress = this.getProgress(userId);
    const item = progress.find((p) => p.courseId === courseId);
    if (!item) return { courseId, progress: 0, status: "In Progress", lessonsCompleted: 0, totalLessons: 20, completedLessons: [], studyMinutes: 0 };

    const isCompleted = item.completedLessons.includes(lessonIndex);
    if (isCompleted) {
      // Un-complete lesson
      item.completedLessons = item.completedLessons.filter((i) => i !== lessonIndex);
      item.lessonsCompleted = item.completedLessons.length;
      item.studyMinutes = Math.max(0, item.studyMinutes - 25);
    } else {
      // Complete lesson
      item.completedLessons.push(lessonIndex);
      item.lessonsCompleted = item.completedLessons.length;
      item.studyMinutes += 25;

      // Log activity
      this.logActivity(userId, "lesson", `Completed Lesson: ${lessonTitle} (${courseTitle})`);

      // Custom notifications for lesson completions
      if (item.lessonsCompleted === 1) {
        this.addNotification(userId, `Congratulations on completing your first lesson in ${courseTitle}!`);
      } else if (item.lessonsCompleted === 5) {
        this.addNotification(userId, `Unlock Quiz 1: Tapped 5 lessons in ${courseTitle}.`);
      }
    }

    item.progress = Math.round((item.lessonsCompleted / item.totalLessons) * 100);
    
    if (item.progress === 100) {
      item.status = "Completed";
      this.addNotification(userId, `Course progress completed 100% for ${courseTitle}! Finish all quizzes to unlock certificate.`);
      this.checkAndIssueCertificate(userId, courseId, courseTitle);
    } else {
      item.status = "In Progress";
    }

    this.saveProgress(userId, progress);
    return item;
  },

  // Quiz functions
  getQuizzes(userId: string): QuizAttempt[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(getStorageKey("quizzes", userId));
    return data ? JSON.parse(data) : [];
  },

  saveQuizzes(userId: string, attempts: QuizAttempt[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(getStorageKey("quizzes", userId), JSON.stringify(attempts));
    this.syncUserData(userId);
  },

  saveQuizAttempt(userId: string, courseId: string, courseTitle: string, score: number, passed: boolean): QuizAttempt {
    const attempts = this.getQuizzes(userId);
    let matched = attempts.find((a) => a.courseId === courseId);

    if (matched) {
      matched.attempts += 1;
      matched.score = Math.max(matched.score, score); // keep highest score
      matched.passed = matched.passed || passed;
      matched.date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } else {
      matched = {
        id: Math.random().toString(36).substring(2, 9),
        courseId,
        score,
        passed,
        attempts: 1,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      attempts.push(matched);
    }

    this.saveQuizzes(userId, attempts);

    // Log activity
    this.logActivity(userId, "quiz", `${passed ? "Passed" : "Attempted"} Quiz for ${courseTitle} with score ${score}/3`);

    // Trigger notification
    if (passed) {
      this.addNotification(userId, `You successfully passed the ${courseTitle} certification quiz!`);
      this.checkAndIssueCertificate(userId, courseId, courseTitle);
    } else {
      this.addNotification(userId, `Quiz attempt failed for ${courseTitle}. Try reviewing lessons and attempt again.`);
    }

    return matched;
  },

  // Certificate helpers
  checkAndIssueCertificate(userId: string, courseId: string, courseTitle: string) {
    const progressList = this.getProgress(userId);
    const courseProgress = progressList.find((p) => p.courseId === courseId);
    
    const quizAttempts = this.getQuizzes(userId);
    const quizPassed = quizAttempts.find((a) => a.courseId === courseId && a.passed);

    if (courseProgress && courseProgress.progress === 100 && quizPassed) {
      // Award certificate
      const certificates = this.getCertificates(userId);
      if (!certificates.includes(courseId)) {
        certificates.push(courseId);
        localStorage.setItem(getStorageKey("certificates", userId), JSON.stringify(certificates));
        this.syncUserData(userId);
        
        // Log activity
        this.logActivity(userId, "certificate", `Earned Certificate in ${courseTitle}`);
        
        // Notify user
        this.addNotification(userId, `🎉 Congratulations! Your Certificate for ${courseTitle} is ready to download.`);
      }
    }
  },

  getCertificates(userId: string): string[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(getStorageKey("certificates", userId));
    return data ? JSON.parse(data) : [];
  },

  // Activities logs
  getActivities(userId: string): RecentActivity[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(getStorageKey("activity", userId));
    return data ? JSON.parse(data) : [];
  },

  logActivity(userId: string, type: RecentActivity["type"], description: string) {
    if (typeof window === "undefined") return;
    const activities = this.getActivities(userId);
    const newActivity: RecentActivity = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      description,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    activities.unshift(newActivity); // add to top
    // Limit to latest 20 activities
    if (activities.length > 20) activities.pop();
    localStorage.setItem(getStorageKey("activity", userId), JSON.stringify(activities));
    this.syncUserData(userId);
  },

  // Notifications manager
  getNotifications(userId: string): Notification[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(getStorageKey("notifications", userId));
    return data ? JSON.parse(data) : [];
  },

  addNotification(userId: string, title: string) {
    if (typeof window === "undefined") return;
    const notifications = this.getNotifications(userId);
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      time: "Just now",
      unread: true,
    };
    notifications.unshift(newNotif);
    if (notifications.length > 30) notifications.pop();
    localStorage.setItem(getStorageKey("notifications", userId), JSON.stringify(notifications));
    this.syncUserData(userId);
  },

  markNotificationsRead(userId: string) {
    if (typeof window === "undefined") return;
    const notifications = this.getNotifications(userId);
    notifications.forEach((n) => (n.unread = false));
    localStorage.setItem(getStorageKey("notifications", userId), JSON.stringify(notifications));
    this.syncUserData(userId);
  },

  // Announcements manager
  getAnnouncements(): any[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("mervox_academy_announcements");
    return data ? JSON.parse(data) : [];
  },

  // Cross-device sync functions
  syncUserData(userId: string) {
    if (typeof window === "undefined" || !userId) return;

    const progress = this.getProgress(userId);
    const quizzes = this.getQuizzes(userId);
    const certificates = this.getCertificates(userId);
    const activity = this.getActivities(userId);
    const notifications = this.getNotifications(userId);

    const usersJson = localStorage.getItem("mervox_academy_users");
    if (usersJson) {
      try {
        const users = JSON.parse(usersJson);
        const updated = users.map((u: any) => {
          if (u.id === userId) {
            return {
              ...u,
              progress,
              quizzes,
              certificates,
              activity,
              notifications,
            };
          }
          return u;
        });

        localStorage.setItem("mervox_academy_users", JSON.stringify(updated));
        syncToCloud(updated);
      } catch (err) {
        console.error("Failed to sync user data in DB", err);
      }
    }
  },

  async syncFromCloud(): Promise<any[] | null> {
    if (typeof window === "undefined") return null;
    try {
      // 1. Sync Users
      const res = await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fb828537555d5");
      if (res.ok) {
        const payload = await res.json();
        const cloudUsers = payload.data?.list || [];
        if (Array.isArray(cloudUsers)) {
          const localJson = localStorage.getItem("mervox_academy_users");
          const localUsers = localJson ? JSON.parse(localJson) : [];
          
          const mergedMap = new Map();
          localUsers.forEach((u: any) => mergedMap.set(u.id, u));
          cloudUsers.forEach((u: any) => {
            const existing = mergedMap.get(u.id);
            if (!existing) {
              mergedMap.set(u.id, u);
            } else {
              const localLessons = existing.progress?.reduce((acc: number, p: any) => acc + (p.lessonsCompleted || 0), 0) || 0;
              const cloudLessons = u.progress?.reduce((acc: number, p: any) => acc + (p.lessonsCompleted || 0), 0) || 0;
              if (cloudLessons >= localLessons) {
                mergedMap.set(u.id, u);
              }
            }
          });
          
          const mergedUsers = Array.from(mergedMap.values());
          localStorage.setItem("mervox_academy_users", JSON.stringify(mergedUsers));
        }
      }

      // 2. Sync Announcements
      try {
        const resAnn = await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fb828557755d6");
        if (resAnn.ok) {
          const payload = await resAnn.json();
          const cloudAnn = payload.data?.list || [];
          if (Array.isArray(cloudAnn)) {
            localStorage.setItem("mervox_academy_announcements", JSON.stringify(cloudAnn));
          }
        }
      } catch (err) {}

      // 3. Sync Live Classes
      try {
        const resLive = await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fb8285b7555d7");
        if (resLive.ok) {
          const payload = await resLive.json();
          const cloudLive = payload.data?.list || [];
          if (Array.isArray(cloudLive)) {
            localStorage.setItem("mervox_academy_live_classes", JSON.stringify(cloudLive));
          }
        }
      } catch (err) {}

      // 4. Sync Courses
      try {
        const resCourses = await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fb8285e0455d8");
        if (resCourses.ok) {
          const payload = await resCourses.json();
          const cloudCourses = payload.data?.list || [];
          if (Array.isArray(cloudCourses)) {
            localStorage.setItem("mervox_academy_courses", JSON.stringify(cloudCourses));
          }
        }
      } catch (err) {}

      // 5. Sync Assignments
      try {
        const resAsg = await fetch("https://api.restful-api.dev/objects/ff8081819f7e10ae019fb8285fc255d9");
        if (resAsg.ok) {
          const payload = await resAsg.json();
          const cloudAsg = payload.data?.list || [];
          if (Array.isArray(cloudAsg)) {
            localStorage.setItem("mervox_academy_assignments_list", JSON.stringify(cloudAsg));
          }
        }
      } catch (err) {}

      const usersJson = localStorage.getItem("mervox_academy_users");
      return usersJson ? JSON.parse(usersJson) : [];

    } catch (err) {
      console.warn("Cross-device sync offline. Falling back to local storage.", err);
    }
    return null;
  },

  // Dynamic Courses Management
  getCourses(): any[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("mervox_academy_courses");
    if (!data) {
      const defaultCourses = [
        {
          id: "forex-trading",
          title: "Forex Trading Masterclass",
          description: "Learn price action, market structure, risk management, and trading psychology from scratch.",
          thumbnail: "/course-forex-v3.webp",
          progress: 0,
          status: "Not Started",
          lessonsCompleted: 0,
          totalLessons: 20,
          published: true,
          lessons: Array.from({ length: 20 }).map((_, idx) => `Lesson ${idx + 1}: Technical Analysis & Market Structures - Part ${idx + 1}`),
        },
        {
          id: "ai-automation",
          title: "AI & Business Automation",
          description: "Integrate LLMs, design bots, set workflow triggers, and automate client processes with Make.com.",
          thumbnail: "/course-ai-v3.webp",
          progress: 0,
          status: "Not Started",
          lessonsCompleted: 0,
          totalLessons: 20,
          published: true,
          lessons: Array.from({ length: 20 }).map((_, idx) => `Lesson ${idx + 1}: AI Automation & Trigger Funnels - Part ${idx + 1}`),
        },
        {
          id: "web-dev",
          title: "Web & Software Development",
          description: "Build interactive apps using React, Tailwind CSS, TypeScript, and modern frameworks.",
          thumbnail: "/course-webdev-v3.webp",
          progress: 0,
          status: "Not Started",
          lessonsCompleted: 0,
          totalLessons: 20,
          published: true,
          lessons: Array.from({ length: 20 }).map((_, idx) => `Lesson ${idx + 1}: React Components & NextJS APIs - Part ${idx + 1}`),
        },
        {
          id: "youtube-monetization",
          title: "YouTube Algorithm Monetization",
          description: "Master niche creation, scriptwriting, video editing pipelines, and CTR optimization.",
          thumbnail: "/course-youtube-v3.webp",
          progress: 0,
          status: "Not Started",
          lessonsCompleted: 0,
          totalLessons: 20,
          published: true,
          lessons: Array.from({ length: 20 }).map((_, idx) => `Lesson ${idx + 1}: YouTube Niches & SEO Mechanics - Part ${idx + 1}`),
        }
      ];
      localStorage.setItem("mervox_academy_courses", JSON.stringify(defaultCourses));
      return defaultCourses;
    }
    return JSON.parse(data);
  },

  saveCourses(courses: any[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem("mervox_academy_courses", JSON.stringify(courses));
    syncCoursesToCloud(courses);
  },

  // Live Classes CRUD
  getLiveClasses(): any[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("mervox_academy_live_classes");
    if (!data) {
      const defaultLive = [
        {
          id: "live-forex",
          courseId: "forex-trading",
          title: "Live Forex Market Review & Trade setups",
          instructor: "JPForex Mentor",
          date: "July 31, 2026",
          time: "16:00 BST",
          link: "https://zoom.us/j/123456789",
        },
        {
          id: "live-ai",
          courseId: "ai-automation",
          title: "ChatGPT Prompts Deep Dive & Make.com workflows",
          instructor: "AI Automation Specialist",
          date: "August 2, 2026",
          time: "18:00 BST",
          link: "https://zoom.us/j/123456790",
        },
        {
          id: "live-web",
          courseId: "web-dev",
          title: "React Server Components & Next.js 16 APIs",
          instructor: "Lead Web Developer",
          date: "August 5, 2026",
          time: "17:00 BST",
          link: "https://zoom.us/j/123456791",
        },
      ];
      localStorage.setItem("mervox_academy_live_classes", JSON.stringify(defaultLive));
      return defaultLive;
    }
    return JSON.parse(data);
  },

  saveLiveClasses(classes: any[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem("mervox_academy_live_classes", JSON.stringify(classes));
    syncLiveClassesToCloud(classes);
  },

  // Announcements CRUD
  saveAnnouncements(list: any[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem("mervox_academy_announcements", JSON.stringify(list));
    syncAnnouncementsToCloud(list);
  },

  // Student Audits
  getStudents(): any[] {
    if (typeof window === "undefined") return [];
    const usersJson = localStorage.getItem("mervox_academy_users");
    const users = usersJson ? JSON.parse(usersJson) : [];
    return users.filter((u: any) => u.email !== "marvelousotugalu012@gmail.com");
  },

  suspendStudent(studentId: string, suspended: boolean) {
    if (typeof window === "undefined") return;
    const usersJson = localStorage.getItem("mervox_academy_users");
    if (usersJson) {
      const users = JSON.parse(usersJson);
      const updated = users.map((u: any) => {
        if (u.id === studentId) {
          return { ...u, suspended };
        }
        return u;
      });
      localStorage.setItem("mervox_academy_users", JSON.stringify(updated));
      syncToCloud(updated);
    }
  },

  deleteStudent(studentId: string) {
    if (typeof window === "undefined") return;
    const usersJson = localStorage.getItem("mervox_academy_users");
    if (usersJson) {
      const users = JSON.parse(usersJson);
      const updated = users.filter((u: any) => u.id !== studentId);
      localStorage.setItem("mervox_academy_users", JSON.stringify(updated));
      syncToCloud(updated);
    }
  },

  // Quiz Editor
  getQuizQuestions(): Record<string, any[]> {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem("mervox_academy_quiz_questions");
    if (!data) {
      const defaults = {
        "forex-trading": [
          {
            q: "Which analysis form focuses on price charts, candlesticks, and market patterns?",
            options: ["Fundamental Analysis", "Technical Analysis", "Sentiment Analysis"],
            answer: 1,
          },
          {
            q: "What is risk management's primary rule?",
            options: ["Leverage as much as possible", "Never risk more than 1-2% per trade", "Trade only high volatility markets"],
            answer: 1,
          },
          {
            q: "A bullish candlestick indicates what market sentiment?",
            options: ["Sellers are dominant", "Buyers are dominant", "Market is consolidation range"],
            answer: 1,
          },
        ],
        "ai-automation": [
          {
            q: "What is the primary role of Make.com in automation?",
            options: ["Hosting LLMs", "Connecting APIs and automating workflow data", "Writing raw Python code"],
            answer: 1,
          },
          {
            q: "Which component triggers a workflow sequence in Make?",
            options: ["Router", "Webhook or Instant Trigger", "JSON Parser"],
            answer: 1,
          },
          {
            q: "To prevent API timeouts, which strategy is best?",
            options: ["Shorten LLM prompts", "Increase script concurrency / queues", "Add delay timers"],
            answer: 1,
          },
        ],
        "web-dev": [
          {
            q: "Next.js App Router renders pages by default as what component type?",
            options: ["Client Components", "Server Components", "Stateful Components"],
            answer: 1,
          },
          {
            q: "Which Tailwind utility sets fixed flex sizes?",
            options: ["flex-grow", "shrink-0", "basis-auto"],
            answer: 1,
          },
          {
            q: "React Hydration mismatches commonly happen due to what?",
            options: ["Render logic differences between server and client states", "Mismatching package versions", "Missing TS interfaces"],
            answer: 0,
          },
        ],
        "youtube-monetization": [
          {
            q: "What are the two key metrics driving YouTube click-through visibility?",
            options: ["CTR and AVD (Average View Duration)", "Likes and Shares", "Comments and Playlists"],
            answer: 0,
          },
          {
            q: "When launching a new faceless channel, which step is most crucial?",
            options: ["Uploading 10 videos immediately", "Subscribing to competitors", "Defining a focused sub-niche structure"],
            answer: 2,
          },
          {
            q: "To maximize thumbnail CTR, you should do what?",
            options: ["Use high-contrast visuals with 3-5 bold keywords", "Put the entire video title on the thumbnail", "Use dark backgrounds exclusively"],
            answer: 0,
          },
        ]
      };
      localStorage.setItem("mervox_academy_quiz_questions", JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  },

  saveQuizQuestions(questions: Record<string, any[]>) {
    if (typeof window === "undefined") return;
    localStorage.setItem("mervox_academy_quiz_questions", JSON.stringify(questions));
  },

  // Certificates Manager
  getAllCertificates(): any[] {
    if (typeof window === "undefined") return [];
    const users = this.getStudents();
    const certs: any[] = [];
    users.forEach((student: any) => {
      const studentCerts = student.certificates || [];
      studentCerts.forEach((courseId: string) => {
        certs.push({
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentEmail: student.email,
          courseId,
          dateIssued: "July 2026",
        });
      });
    });
    return certs;
  },

  revokeCertificate(studentId: string, courseId: string) {
    if (typeof window === "undefined") return;
    const usersJson = localStorage.getItem("mervox_academy_users");
    if (usersJson) {
      const users = JSON.parse(usersJson);
      const updated = users.map((u: any) => {
        if (u.id === studentId) {
          const certs = u.certificates || [];
          return {
            ...u,
            certificates: certs.filter((id: string) => id !== courseId),
          };
        }
        return u;
      });
      localStorage.setItem("mervox_academy_users", JSON.stringify(updated));
      syncToCloud(updated);
    }
  },

  regenerateCertificate(studentId: string, courseId: string) {
    if (typeof window === "undefined") return;
    const usersJson = localStorage.getItem("mervox_academy_users");
    if (usersJson) {
      const users = JSON.parse(usersJson);
      const updated = users.map((u: any) => {
        if (u.id === studentId) {
          const certs = u.certificates || [];
          if (!certs.includes(courseId)) {
            certs.push(courseId);
          }
          return {
            ...u,
            certificates: certs,
          };
        }
        return u;
      });
      localStorage.setItem("mervox_academy_users", JSON.stringify(updated));
      syncToCloud(updated);
    }
  },

  // Assignments & Project Review
  getAssignments(): any[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("mervox_academy_assignments_list");
    if (!data) {
      const defaults = [
        {
          id: "asg-forex",
          courseId: "forex-trading",
          courseTitle: "Forex Trading Masterclass",
          title: "Support & Resistance Area Marking Practice",
          dueDate: "August 10, 2026",
        },
        {
          id: "asg-ai",
          courseId: "ai-automation",
          courseTitle: "AI & Business Automation",
          title: "ChatGPT Lead-Gen Workflow Make.com Setup Blueprint",
          dueDate: "August 15, 2026",
        },
        {
          id: "asg-web",
          courseId: "web-dev",
          courseTitle: "Web & Software Development",
          title: "React Modular Dashboard Layout Build",
          dueDate: "August 20, 2026",
        },
      ];
      localStorage.setItem("mervox_academy_assignments_list", JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  },

  saveAssignments(list: any[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem("mervox_academy_assignments_list", JSON.stringify(list));
    syncAssignmentsToCloud(list);
  },

  getSubmissions(): any[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("mervox_academy_all_submissions");
    if (!data) {
      const defaults = [
        {
          id: "sub-1",
          studentId: "student-1",
          studentName: "John Doe",
          assignmentId: "asg-forex",
          courseTitle: "Forex Trading Masterclass",
          assignmentTitle: "Support & Resistance Area Marking Practice",
          fileName: "Forex_S_R_Assignment.pdf",
          dateSubmitted: "July 28, 2026",
          status: "Pending",
          grade: "",
          feedback: "",
        },
        {
          id: "sub-2",
          studentId: "student-2",
          studentName: "Sarah Connor",
          assignmentId: "asg-ai",
          courseTitle: "AI & Business Automation",
          assignmentTitle: "ChatGPT Lead-Gen Workflow Make.com Setup Blueprint",
          fileName: "AI_Workflow_Make_Blueprint.json",
          dateSubmitted: "July 29, 2026",
          status: "Graded",
          grade: "A+",
          feedback: "Incredible attention to detail on Make.com routing modules. Well done!",
        }
      ];
      localStorage.setItem("mervox_academy_all_submissions", JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  },

  gradeSubmission(submissionId: string, grade: string, feedback: string) {
    if (typeof window === "undefined") return;
    const list = this.getSubmissions();
    const updated = list.map((sub: any) => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status: "Graded",
          grade,
          feedback,
        };
      }
      return sub;
    });
    localStorage.setItem("mervox_academy_all_submissions", JSON.stringify(updated));

    const sub = list.find((s: any) => s.id === submissionId);
    if (sub) {
      const savedKey = `mervox_academy_assignments_${sub.studentId}`;
      const savedData = localStorage.getItem(savedKey);
      if (savedData) {
        const studentAsgs = JSON.parse(savedData);
        const updatedStudentAsgs = studentAsgs.map((asg: any) => {
          if (asg.id === sub.assignmentId) {
            return {
              ...asg,
              status: "Graded",
              grade,
              feedback,
            };
          }
          return asg;
        });
        localStorage.setItem(savedKey, JSON.stringify(updatedStudentAsgs));
        this.syncUserData(sub.studentId);
        this.addNotification(sub.studentId, `Your assignment "${sub.assignmentTitle}" has been graded: ${grade}.`);
      }
    }
  },

  // Admin Direct Chat Channels
  getAllMessageThreads(): any[] {
    if (typeof window === "undefined") return [];
    const students = this.getStudents();
    const threads: any[] = [];
    const channels = ["forex-mentor", "ai-support", "helpdesk"];
    
    students.forEach((student: any) => {
      channels.forEach((channelId) => {
        const savedKey = `mervox_academy_msg_${student.id}_${channelId}`;
        const data = localStorage.getItem(savedKey);
        if (data) {
          const messages = JSON.parse(data);
          if (messages.length > 0) {
            threads.push({
              studentId: student.id,
              studentName: `${student.firstName} ${student.lastName}`,
              channelId,
              lastMessage: messages[messages.length - 1].text,
              lastMessageTime: messages[messages.length - 1].time,
              messages,
            });
          }
        }
      });
    });
    return threads;
  },

  sendAdminReply(studentId: string, channelId: string, text: string) {
    if (typeof window === "undefined") return;
    const savedKey = `mervox_academy_msg_${studentId}_${channelId}`;
    const data = localStorage.getItem(savedKey);
    const messages = data ? JSON.parse(data) : [];
    
    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const newMsg = {
      id: Math.random().toString(36).substring(2, 9),
      sender: "mentor" as const,
      text,
      time: timestamp,
    };
    
    messages.push(newMsg);
    localStorage.setItem(savedKey, JSON.stringify(messages));
    
    this.addNotification(studentId, `New direct message from your instructor.`);
    this.syncUserData(studentId);
  },

  // Admin Configuration Settings
  getAdminSettings(): any {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem("mervox_academy_admin_settings");
    if (!data) {
      const defaults = {
        logoUrl: "/logo.png",
        academyName: "Mervox Academy",
        contactEmail: "support@mervoxdynamic.com",
        contactPhone: "+234 812 345 6789",
        twitter: "https://twitter.com/mervoxdynamic",
        github: "https://github.com/mervoxdynamic",
        linkedin: "https://linkedin.com/company/mervoxdynamic",
        emailProvider: "SMTP (Default)",
        paymentProvider: "Stripe Test",
      };
      localStorage.setItem("mervox_academy_admin_settings", JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  },

  saveAdminSettings(settings: any) {
    if (typeof window === "undefined") return;
    localStorage.setItem("mervox_academy_admin_settings", JSON.stringify(settings));
  },
};
export default AcademyDB;
