import { UserCourseProgress, QuizAttempt, RecentActivity, Notification } from "@/types/academy";

const getStorageKey = (key: string, userId: string) => `mervox_academy_${key}_${userId}`;

const syncToCloud = async (users: any[]) => {
  try {
    await fetch("https://kvdb.io/mervox_academy_shared_db_v2/users", {
      method: "PUT",
      body: JSON.stringify(users),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    // Fail silently in offline/firewalled networks
  }
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
      const res = await fetch("https://kvdb.io/mervox_academy_shared_db_v2/users");
      if (res.ok) {
        const cloudUsers = await res.json();
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
          return mergedUsers;
        }
      }
    } catch (err) {
      console.warn("Cross-device sync offline. Falling back to local storage.", err);
    }
    return null;
  },
};
export default AcademyDB;
