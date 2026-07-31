"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, CheckSquare, Save, User, Award, CheckCircle, AlertCircle, X, HelpCircle, GraduationCap } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import { AcademyDB } from "@/utils/academyDb";

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // Index of the correct option (0-based)
}

interface StudentAttempt {
  studentName: string;
  studentEmail: string;
  score: number;
  passed: boolean;
  attempts: number;
  date: string;
}

export default function AdminQuizzesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);

  // Editing single question modal states
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  const loadData = async () => {
    try {
      const { data, error } = await supabase.from("courses").select("*");
      if (error) {
        console.error("Failed to load courses for quizzes:", error);
      } else if (data) {
        setCourses(data);
        if (data.length > 0 && !selectedCourseId) {
          setSelectedCourseId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update questions and student scores when course changes
  useEffect(() => {
    if (!selectedCourseId) return;

    // Load quiz questions
    const allQuizQuestions = AcademyDB.getQuizQuestions();
    const courseQuestions = allQuizQuestions[selectedCourseId] || [];
    setQuestions(courseQuestions);

    // Load student attempts for this course from Supabase
    const loadAttempts = async () => {
      try {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email");

        const { data: quizzes } = await supabase
          .from("quizzes")
          .select("*")
          .eq("course_id", selectedCourseId);

        if (profiles && quizzes) {
          const mappedAttempts = quizzes.map((q: any) => {
            const student = profiles.find((p) => p.id === q.user_id);
            return {
              studentName: student?.full_name || "Anonymous Student",
              studentEmail: student?.email || "",
              score: q.score,
              passed: q.passed,
              attempts: 1,
              date: "Evaluated",
            };
          });
          setAttempts(mappedAttempts);
        }
      } catch (err) {
        console.error("Failed to load quiz attempts:", err);
      }
    };
    loadAttempts();
  }, [selectedCourseId, courses]);

  const handleOpenCreateQuestion = () => {
    setEditIndex(null);
    setQuestionText("");
    setOptions(["", "", ""]);
    setCorrectAnswerIndex(0);
    setIsEditingQuestion(true);
  };

  const handleOpenEditQuestion = (index: number) => {
    const q = questions[index];
    setEditIndex(index);
    setQuestionText(q.q);
    setOptions([...q.options]);
    setCorrectAnswerIndex(q.answer);
    setIsEditingQuestion(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const newQ: QuizQuestion = {
      q: questionText.trim(),
      options: options.map((o) => o.trim()).filter((o) => o !== ""),
      answer: correctAnswerIndex,
    };

    let updatedQuestions = [...questions];
    if (editIndex !== null) {
      updatedQuestions[editIndex] = newQ;
    } else {
      updatedQuestions.push(newQ);
    }

    const allQuizQuestions = AcademyDB.getQuizQuestions();
    allQuizQuestions[selectedCourseId] = updatedQuestions;
    AcademyDB.saveQuizQuestions(allQuizQuestions);

    setQuestions(updatedQuestions);
    setIsEditingQuestion(false);
    alert("Quiz question saved successfully!");
  };

  const handleDeleteQuestion = (index: number) => {
    const confirmAct = confirm("Are you sure you want to delete this quiz question?");
    if (confirmAct) {
      const updatedQuestions = questions.filter((_, idx) => idx !== index);
      const allQuizQuestions = AcademyDB.getQuizQuestions();
      allQuizQuestions[selectedCourseId] = updatedQuestions;
      AcademyDB.saveQuizQuestions(allQuizQuestions);
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleAddOptionField = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOptionField = (index: number) => {
    if (options.length <= 2) {
      alert("Quizzes must have at least 2 choice options!");
      return;
    }
    const updated = options.filter((_, idx) => idx !== index);
    setOptions(updated);
    if (correctAnswerIndex >= updated.length) {
      setCorrectAnswerIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Evaluations Manager</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Quiz Editor & Scores</h2>
        </div>
        
        {/* Select Course dropdown */}
        <div className="space-y-1.5 self-start md:self-auto mt-3 md:mt-0 select-none">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Select Course Program</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-white dark:bg-[#18181c] border border-card-border/60 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor Modal */}
      {isEditingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#18181c] w-full max-w-md rounded-[24px] border border-card-border/60 shadow-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-heading font-black text-slate-850 dark:text-white">
              {editIndex !== null ? "Edit Question" : "Create Question"}
            </h3>
            
            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block font-heading">Question Text</label>
                <textarea
                  placeholder="e.g. Which tool connects APIs for lead-gen workflows?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
                  required
                />
              </div>

              {/* Choices listing */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block font-heading">Choice Options</label>
                  <button
                    type="button"
                    onClick={handleAddOptionField}
                    className="text-[9px] font-bold text-[#0055ff] hover:underline uppercase tracking-wide cursor-pointer"
                  >
                    Add Option
                  </button>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                  {options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-answer"
                        checked={correctAnswerIndex === oIdx}
                        onChange={() => setCorrectAnswerIndex(oIdx)}
                        className="w-4 h-4 text-[#0055ff] border-card-border cursor-pointer focus:ring-0 shrink-0"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${oIdx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                        className="w-full px-2.5 py-2 text-[11px] rounded-lg bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-850 dark:text-slate-200 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOptionField(oIdx)}
                        className="p-1.5 rounded text-red-500 hover:bg-red-55/20 cursor-pointer shrink-0 border-none bg-transparent"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingQuestion(false)}
                  className="px-5 py-2.5 border border-card-border hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-550 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: Manage Quiz questions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center pl-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Evaluation Quiz Questions ({questions.length})
            </h3>
            <button
              onClick={handleOpenCreateQuestion}
              className="text-[10px] font-bold text-[#0055ff] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {questions.length === 0 ? (
              <p className="text-xs text-slate-450 font-semibold py-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-2xl">
                No quiz evaluation questions seeded for this course yet.
              </p>
            ) : (
              questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-white leading-relaxed">
                      {idx + 1}. {q.q}
                    </h4>
                    
                    <div className="flex items-center gap-1 shrink-0 select-none">
                      <button
                        onClick={() => handleOpenEditQuestion(idx)}
                        className="p-1.5 rounded text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(idx)}
                        className="p-1.5 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* List choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-lg border truncate ${
                          q.answer === oIdx
                            ? "bg-emerald-50/40 border-emerald-100/50 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/10 dark:text-emerald-400"
                            : "border-card-border/40 bg-slate-50/30 dark:bg-slate-900/20"
                        }`}
                      >
                        <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Audit student attempts */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
            Student Attempt Records ({attempts.length})
          </h3>

          <div className="rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-card-border/40 text-[9px] font-black uppercase text-slate-455 tracking-wider text-left">
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Score</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/40 text-xs">
                  {attempts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-450 font-semibold">
                        No students have attempted this course evaluation yet.
                      </td>
                    </tr>
                  ) : (
                    attempts.map((att, index) => (
                      <tr key={index} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/20">
                        <td className="px-5 py-4">
                          <h4 className="font-bold text-slate-800 dark:text-white leading-none">
                            {att.studentName}
                          </h4>
                          <span className="text-[9px] text-slate-400 mt-1 block truncate max-w-[150px] leading-none">
                            {att.studentEmail}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-black text-slate-800 dark:text-white">
                          {att.score}/3
                        </td>
                        <td className="px-5 py-4 select-none">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            att.passed
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                          }`}>
                            {att.passed ? "Passed" : `Failed (${att.attempts} att)`}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
