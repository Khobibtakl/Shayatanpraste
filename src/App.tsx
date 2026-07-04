import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Search, RotateCcw, Volume2, VolumeX, 
  ArrowLeft, Check, Plus, Trash2, Edit3, Bookmark, 
  Copy, Share2, Sparkles, Award, Clock, Flame, 
  Play, Pause, Languages, Sun, Moon, Eye, FileText, 
  Highlighter, HelpCircle, ArrowUp, ChevronRight, X, BookOpenCheck, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import appData from './assets/data.json';
import { 
  Article, Paragraph, Bookmark as BookmarkType, Highlight as HighlightType, Note as NoteType, 
  ReadingProgress, ReaderTheme, FontSize, FontFamily, LanguageMode, UserPreferences, DailyReadingLog, QuoteOfTheDay 
} from './types';

const ARTICLES = appData.articles as Article[];
const CATEGORIES = appData.categories;
const QUOTES = appData.quotes as QuoteOfTheDay[];

export default function App() {
  // Core States
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Loaded from LocalStorage or Defaults
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(() => {
    const saved = localStorage.getItem('foi_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [highlights, setHighlights] = useState<HighlightType[]>(() => {
    const saved = localStorage.getItem('foi_highlights');
    return saved ? JSON.parse(saved) : [];
  });
  const [notes, setNotes] = useState<NoteType[]>(() => {
    const saved = localStorage.getItem('foi_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [progress, setProgress] = useState<ReadingProgress[]>(() => {
    const saved = localStorage.getItem('foi_progress');
    return saved ? JSON.parse(saved) : [];
  });
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('foi_preferences');
    return saved ? JSON.parse(saved) : {
      theme: 'night',
      fontSize: 'lg',
      fontFamily: 'amiri',
      languageMode: 'ps',
      autoScrollSpeed: 0,
      dailyGoalMinutes: 10
    };
  });
  const [readingLogs, setReadingLogs] = useState<DailyReadingLog[]>(() => {
    const saved = localStorage.getItem('foi_reading_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // UI Interactive States
  const [quoteIndex, setQuoteIndex] = useState(() => {
    // Random quote on first load
    return Math.floor(Math.random() * QUOTES.length);
  });
  const [activeParagraphActionsId, setActiveParagraphActionsId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isEditingNoteId, setIsEditingNoteId] = useState<string | null>(null);
  const [copiedParagraphId, setCopiedParagraphId] = useState<string | null>(null);
  const [isReadAloudPlaying, setIsReadAloudPlaying] = useState(false);
  const [activeSpokenParagraphId, setActiveSpokenParagraphId] = useState<string | null>(null);
  const [showPreferencesMenu, setShowPreferencesMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  // New States for Splash & About Developer
  const [showSplash, setShowSplash] = useState(true);
  const [showAboutCreator, setShowAboutCreator] = useState(false);

  // Hide splash screen after 2.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('foi_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('foi_highlights', JSON.stringify(highlights));
  }, [highlights]);

  useEffect(() => {
    localStorage.setItem('foi_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('foi_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('foi_preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('foi_reading_logs', JSON.stringify(readingLogs));
  }, [readingLogs]);

  // Date helper
  const getTodayDateStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  // Stats calculations
  const getTodayMinutes = () => {
    const todayStr = getTodayDateStr();
    const log = readingLogs.find(l => l.date === todayStr);
    return log ? Number(log.minutes.toFixed(1)) : 0;
  };

  // Calculate Streak
  useEffect(() => {
    if (readingLogs.length === 0) {
      setStreakCount(0);
      return;
    }
    
    // Sort reading logs by date descending
    const sortedDates = [...readingLogs]
      .filter(log => log.minutes >= 0.1) // active reading at least some seconds
      .map(log => log.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (sortedDates.length === 0) {
      setStreakCount(0);
      return;
    }

    const todayStr = getTodayDateStr();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If no reading today or yesterday, streak is broken/0
    if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
      setStreakCount(0);
      return;
    }

    let streak = 1;
    let currentDate = new Date(sortedDates[0]);

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i]);
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else if (diffDays > 1) {
        break; // Streak broken
      }
    }
    setStreakCount(streak);
  }, [readingLogs]);

  // Reading time tracker: log minutes every 10 seconds of active reading
  useEffect(() => {
    if (!activeArticleId) return;

    const interval = setInterval(() => {
      const todayStr = getTodayDateStr();
      setReadingLogs(prev => {
        const existing = prev.find(l => l.date === todayStr);
        const addition = 1 / 6; // 10 seconds = 1/6th of a minute
        if (existing) {
          return prev.map(l => l.date === todayStr ? { ...l, minutes: l.minutes + addition } : l);
        } else {
          return [...prev, { date: todayStr, minutes: addition }];
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [activeArticleId]);

  // Handle Scroll to track reading progress and show BackToTop button
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide back to top
      setShowScrollTop(window.scrollY > 400);

      if (!activeArticleId) return;

      const doc = document.documentElement;
      const scrollPos = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const percent = scrollHeight > 0 ? (scrollPos / scrollHeight) * 100 : 0;

      setProgress(prev => {
        const existing = prev.find(p => p.articleId === activeArticleId);
        const isCompleted = percent > 92 || (existing?.completed ?? false);
        
        if (existing) {
          return prev.map(p => p.articleId === activeArticleId ? {
            ...p,
            scrollPercent: Math.max(p.scrollPercent, percent),
            completed: isCompleted,
            lastReadAt: new Date().toISOString()
          } : p);
        } else {
          return [...prev, {
            articleId: activeArticleId,
            scrollPercent: percent,
            completed: isCompleted,
            lastReadAt: new Date().toISOString()
          }];
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeArticleId]);

  // Auto-scroll handler
  useEffect(() => {
    if (!activeArticleId || preferences.autoScrollSpeed === 0) return;

    const interval = setInterval(() => {
      window.scrollBy({ top: 1, behavior: 'auto' });
    }, Math.max(10, 160 - preferences.autoScrollSpeed * 15)); // speed ranges from 1 to 10

    return () => clearInterval(interval);
  }, [activeArticleId, preferences.autoScrollSpeed]);

  // Open Article at custom position
  const handleOpenArticle = (articleId: string, paragraphId?: string) => {
    setActiveArticleId(articleId);
    setActiveParagraphActionsId(null);
    setNewNoteText('');
    setIsEditingNoteId(null);
    
    // Stop TTS speaking if any
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsReadAloudPlaying(false);
    setActiveSpokenParagraphId(null);

    // Let page render, then scroll
    setTimeout(() => {
      if (paragraphId) {
        const el = document.getElementById(paragraphId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('animate-pulse', 'border-emerald-500');
          setTimeout(() => {
            el.classList.remove('animate-pulse', 'border-emerald-500');
          }, 2500);
        }
      } else {
        const savedProg = progress.find(p => p.articleId === articleId);
        if (savedProg && savedProg.scrollPercent > 5 && savedProg.scrollPercent < 98) {
          const doc = document.documentElement;
          const scrollHeight = doc.scrollHeight - doc.clientHeight;
          const targetScroll = (savedProg.scrollPercent / 100) * scrollHeight;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }
    }, 150);
  };

  const handleBackToLibrary = () => {
    setActiveArticleId(null);
    setActiveParagraphActionsId(null);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsReadAloudPlaying(false);
    setActiveSpokenParagraphId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Text to Speech
  const speakParagraph = (paragraph: Paragraph) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Select text based on preference
    let textToSpeak = '';
    let lang = 'ps-AF';

    if (preferences.languageMode === 'en') {
      textToSpeak = paragraph.textEn || paragraph.textPs;
      lang = 'en-US';
    } else {
      textToSpeak = paragraph.textPs;
      lang = 'ps-AF'; // Pashto
    }

    // Clean up text if it contains Quranic/Arabic bits we don't want to spell out weirdly in English/Pashto voices
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    utterance.rate = 0.95; // slightly slower for better comprehension

    utterance.onstart = () => {
      setActiveSpokenParagraphId(paragraph.id);
      setIsReadAloudPlaying(true);
    };

    utterance.onend = () => {
      // Play next paragraph in the article
      const article = ARTICLES.find(a => a.id === activeArticleId);
      if (article) {
        const idx = article.paragraphs.findIndex(p => p.id === paragraph.id);
        if (idx !== -1 && idx < article.paragraphs.length - 1) {
          speakParagraph(article.paragraphs[idx + 1]);
        } else {
          setIsReadAloudPlaying(false);
          setActiveSpokenParagraphId(null);
        }
      }
    };

    utterance.onerror = () => {
      setIsReadAloudPlaying(false);
      setActiveSpokenParagraphId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleReadAloud = () => {
    if (!window.speechSynthesis) return;

    if (isReadAloudPlaying) {
      window.speechSynthesis.cancel();
      setIsReadAloudPlaying(false);
      setActiveSpokenParagraphId(null);
    } else {
      const article = ARTICLES.find(a => a.id === activeArticleId);
      if (article && article.paragraphs.length > 0) {
        // Start from first paragraph
        speakParagraph(article.paragraphs[0]);
      }
    }
  };

  // Bookmark Toggle
  const handleToggleBookmark = (articleId: string, paragraphId?: string) => {
    const article = ARTICLES.find(a => a.id === articleId);
    if (!article) return;

    const bookmarkId = paragraphId ? `${articleId}-${paragraphId}` : articleId;
    const exists = bookmarks.find(b => b.id === bookmarkId);

    if (exists) {
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } else {
      const newBookmark: BookmarkType = {
        id: bookmarkId,
        articleId,
        paragraphId,
        savedAt: new Date().toISOString(),
        titlePs: paragraphId 
          ? `${article.titlePs} (یاد بنسټيزه کرښه)` 
          : article.titlePs,
        titleEn: paragraphId 
          ? `${article.titleEn} (Marked Paragraph)` 
          : article.titleEn
      };
      setBookmarks(prev => [newBookmark, ...prev]);
    }
  };

  // Highlight paragraph
  const handleHighlight = (paragraphId: string, color: string) => {
    if (!activeArticleId) return;

    if (color === 'clear') {
      setHighlights(prev => prev.filter(h => h.paragraphId !== paragraphId));
    } else {
      setHighlights(prev => {
        const filtered = prev.filter(h => h.paragraphId !== paragraphId);
        const newHighlight: HighlightType = {
          id: `${activeArticleId}-${paragraphId}`,
          articleId: activeArticleId,
          paragraphId,
          color,
          savedAt: new Date().toISOString()
        };
        return [newHighlight, ...filtered];
      });
    }
    setActiveParagraphActionsId(null);
  };

  // Notes CRUD
  const handleSaveNote = (paragraphId: string, paragraphTextPs: string) => {
    if (!activeArticleId || !newNoteText.trim()) return;

    if (isEditingNoteId) {
      setNotes(prev => prev.map(n => n.id === isEditingNoteId ? {
        ...n,
        text: newNoteText,
        savedAt: new Date().toISOString()
      } : n));
      setIsEditingNoteId(null);
    } else {
      const newNote: NoteType = {
        id: `${activeArticleId}-${paragraphId}-${Date.now()}`,
        articleId: activeArticleId,
        paragraphId,
        text: newNoteText,
        savedAt: new Date().toISOString(),
        paragraphPs: paragraphTextPs
      };
      setNotes(prev => [newNote, ...prev]);
    }

    setNewNoteText('');
    setActiveParagraphActionsId(null);
  };

  const handleEditNoteStart = (note: NoteType) => {
    setIsEditingNoteId(note.id);
    setNewNoteText(note.text);
    setActiveParagraphActionsId(note.paragraphId);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  // Clipboard Copier
  const handleCopyText = (paragraph: Paragraph) => {
    const textToCopy = `${paragraph.textAr ? paragraph.textAr + '\n' : ''}${paragraph.textPs}${paragraph.textEn ? '\n' : ''}${paragraph.textEn || ''}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedParagraphId(paragraph.id);
      setTimeout(() => setCopiedParagraphId(null), 2000);
    });
  };

  // Web Share
  const handleShareArticle = (article: Article) => {
    if (navigator.share) {
      navigator.share({
        title: article.titlePs,
        text: `${article.summaryPs}\n\nلوستل په: ${window.location.href}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.titlePs}\n${article.summaryPs}\n${window.location.href}`);
      alert("لینک کاپي شو!");
    }
  };

  // Mock Active reading progress (+1 minute) for quick testing/user delight
  const handleMockReadProgress = () => {
    const todayStr = getTodayDateStr();
    setReadingLogs(prev => {
      const existing = prev.find(l => l.date === todayStr);
      if (existing) {
        return prev.map(l => l.date === todayStr ? { ...l, minutes: l.minutes + 1 } : l);
      } else {
        return [...prev, { date: todayStr, minutes: 1 }];
      }
    });
  };

  // Filter and Search Articles
  const filteredArticles = ARTICLES.filter(article => {
    // Category match
    const categoryMatch = selectedCategory === 'all' || 
      article.categoryPs === CATEGORIES.find(c => c.id === selectedCategory)?.ps;

    // Search query match (in Pashto or English titles/summaries/paragraphs)
    const query = searchQuery.toLowerCase().trim();
    if (!query) return categoryMatch;

    const searchMatch = 
      article.titlePs.toLowerCase().includes(query) ||
      article.titleEn.toLowerCase().includes(query) ||
      article.summaryPs.toLowerCase().includes(query) ||
      article.summaryEn.toLowerCase().includes(query) ||
      article.paragraphs.some(p => 
        p.textPs.toLowerCase().includes(query) || 
        (p.textEn && p.textEn.toLowerCase().includes(query)) ||
        (p.textAr && p.textAr.toLowerCase().includes(query))
      );

    return categoryMatch && searchMatch;
  });

  // Themes Styling Object
  const themeClasses = {
    natural: {
      bg: 'bg-[#FDFCF8] text-[#3E362E]',
      card: 'bg-white border-[#D6CFC1] shadow-sm text-[#3E362E]',
      border: 'border-[#D6CFC1]',
      primary: 'bg-[#5A6E4B] text-white hover:bg-[#48583B] hover:shadow-md transition-all',
      accent: 'text-[#5A6E4B]',
      accentBg: 'bg-[#E5E2D9] text-[#2C2721] border-[#D6CFC1]',
      secondaryBg: 'bg-[#F7F5F0] text-[#3E362E]',
      textMuted: 'text-[#8A7E72]',
      headerBg: 'from-[#EFECE3] to-[#EFECE3] text-[#2C2721] border-b border-[#D6CFC1]',
      headerText: 'text-[#2C2721]',
      headerSub: 'text-[#8A7E72]',
      headerIcon: 'bg-[#5A6E4B] text-white border-[#5A6E4B]/10',
      headerBtn: 'bg-white hover:bg-[#E5E2D9] border-[#D6CFC1] text-[#3E362E] shadow-sm',
      input: 'bg-white border-[#D6CFC1] focus:border-[#5A6E4B] focus:ring-[#5A6E4B]/20 text-[#3E362E]',
      footerBg: 'bg-[#2C2721]',
      footerText: 'text-[#AFA191]',
      divider: 'bg-[#5A6E4B]',
      btnActive: 'bg-[#5A6E4B] text-white border-[#5A6E4B] shadow-sm font-semibold',
      btnInactive: 'bg-transparent border-[#D6CFC1] hover:bg-[#E5E2D9] text-[#3E362E]',
      statusBarColor: '#EFECE3',
      isStatusBarDark: false,
    },
    light: {
      bg: 'bg-slate-50 text-slate-900',
      card: 'bg-white border-slate-200 shadow-sm text-slate-900',
      border: 'border-slate-200',
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md transition-all',
      accent: 'text-emerald-600',
      accentBg: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      secondaryBg: 'bg-slate-100 text-slate-700',
      textMuted: 'text-slate-500',
      headerBg: 'from-emerald-800 to-emerald-900 text-white',
      headerText: 'text-white',
      headerSub: 'text-emerald-200',
      headerIcon: 'bg-white/10 text-emerald-300 border-white/20',
      headerBtn: 'bg-white/10 hover:bg-white/20 border-white/15 text-white',
      input: 'bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-200 text-slate-900',
      footerBg: 'bg-white',
      footerText: 'text-slate-500',
      divider: 'bg-emerald-600',
      btnActive: 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-semibold',
      btnInactive: 'bg-transparent border-slate-300 hover:bg-slate-100 text-slate-700',
      statusBarColor: '#064e3b',
      isStatusBarDark: true,
    },
    dark: {
      bg: 'bg-slate-950 text-slate-100',
      card: 'bg-slate-900 border-slate-800 shadow-xl shadow-black/20 text-slate-100',
      border: 'border-slate-800',
      primary: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-medium hover:shadow-md transition-all',
      accent: 'text-emerald-400',
      accentBg: 'bg-emerald-950/40 text-emerald-300 border-emerald-900/50',
      secondaryBg: 'bg-slate-800 text-slate-300',
      textMuted: 'text-slate-400',
      headerBg: 'from-slate-950 to-emerald-950 text-slate-100 border-b border-emerald-900/40',
      headerText: 'text-slate-100',
      headerSub: 'text-slate-400',
      headerIcon: 'bg-white/5 text-emerald-400 border-white/10',
      headerBtn: 'bg-white/10 hover:bg-white/20 border-white/15 text-white',
      input: 'bg-slate-900 border-slate-800 focus:border-emerald-500 focus:ring-emerald-900 text-slate-100',
      footerBg: 'bg-slate-900',
      footerText: 'text-slate-400',
      divider: 'bg-emerald-500',
      btnActive: 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-semibold',
      btnInactive: 'bg-transparent border-slate-800 hover:bg-slate-800 text-slate-300',
      statusBarColor: '#020617',
      isStatusBarDark: true,
    },
    sepia: {
      bg: 'bg-[#fbf6eb] text-[#433422]',
      card: 'bg-[#f4ecd8] border-[#e4d6bc] shadow-sm text-[#433422]',
      border: 'border-[#e4d6bc]',
      primary: 'bg-[#a0522d] text-white hover:bg-[#8b4513] hover:shadow-md transition-all',
      accent: 'text-[#a0522d]',
      accentBg: 'bg-[#eadfca] text-[#783e1e] border-[#dfceab]',
      secondaryBg: 'bg-[#eae0ca] text-[#5c4a37]',
      textMuted: 'text-[#846b52]',
      headerBg: 'from-[#6e3a1f] to-[#432311] text-[#fbf6eb]',
      headerText: 'text-[#fbf6eb]',
      headerSub: 'text-[#dfceab]',
      headerIcon: 'bg-white/10 text-[#fbf6eb] border-white/25',
      headerBtn: 'bg-white/10 hover:bg-white/20 border-white/15 text-white',
      input: 'bg-[#fdfbf7] border-[#dfceab] focus:border-[#a0522d] focus:ring-[#f5ecd8] text-[#433422]',
      footerBg: 'bg-[#f4ecd8]',
      footerText: 'text-[#846b52]',
      divider: 'bg-[#a0522d]',
      btnActive: 'bg-[#a0522d] text-white border-[#a0522d] shadow-sm font-semibold',
      btnInactive: 'bg-transparent border-[#dfceab] hover:bg-[#eadfca] text-[#5c4a37]',
      statusBarColor: '#432311',
      isStatusBarDark: true,
    },
    emerald: {
      bg: 'bg-emerald-50/50 text-emerald-950',
      card: 'bg-white border-emerald-100 shadow-sm text-emerald-950',
      border: 'border-emerald-100',
      primary: 'bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-md transition-all',
      accent: 'text-emerald-700',
      accentBg: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      secondaryBg: 'bg-emerald-50 text-emerald-900',
      textMuted: 'text-emerald-800/70',
      headerBg: 'from-emerald-800 to-emerald-950 text-white',
      headerText: 'text-white',
      headerSub: 'text-emerald-200',
      headerIcon: 'bg-white/10 text-emerald-300 border-white/20',
      headerBtn: 'bg-white/10 hover:bg-white/20 border-white/15 text-white',
      input: 'bg-white border-emerald-100 focus:border-emerald-500 focus:ring-emerald-200 text-emerald-950',
      footerBg: 'bg-white',
      footerText: 'text-emerald-800/70',
      divider: 'bg-emerald-700',
      btnActive: 'bg-emerald-700 text-white border-emerald-700 shadow-sm font-semibold',
      btnInactive: 'bg-transparent border-emerald-100 hover:bg-emerald-50 text-emerald-900',
      statusBarColor: '#064e3b',
      isStatusBarDark: true,
    },
    night: {
      bg: 'bg-[#09090b] text-[#f4f4f5]',
      card: 'bg-[#18181b] border-[#27272a] shadow-lg shadow-black/45 text-[#f4f4f5]',
      border: 'border-[#27272a]',
      primary: 'bg-amber-500 text-neutral-950 hover:bg-amber-400 font-semibold hover:shadow-md transition-all',
      accent: 'text-amber-500',
      accentBg: 'bg-[#1c1917] text-amber-400 border-amber-500/25',
      secondaryBg: 'bg-[#18181b] text-neutral-300',
      textMuted: 'text-[#a1a1aa]',
      headerBg: 'from-[#09090b] to-[#18181b] text-[#f4f4f5] border-b border-[#27272a]',
      headerText: 'text-[#f4f4f5]',
      headerSub: 'text-amber-500',
      headerIcon: 'bg-[#18181b] text-amber-500 border-[#27272a]',
      headerBtn: 'bg-[#18181b] hover:bg-[#27272a] border-[#27272a] text-[#f4f4f5]',
      input: 'bg-[#09090b] border-[#27272a] focus:border-amber-500 focus:ring-amber-500/20 text-[#f4f4f5]',
      footerBg: 'bg-[#09090b]',
      footerText: 'text-[#71717a]',
      divider: 'bg-amber-500',
      btnActive: 'bg-amber-500 text-neutral-950 border-amber-500 shadow-sm font-semibold',
      btnInactive: 'bg-transparent border-[#27272a] hover:bg-[#18181b] text-neutral-300',
      statusBarColor: '#09090b',
      isStatusBarDark: true,
    },
    rose: {
      bg: 'bg-[#FCF8F8] text-[#4A3232]',
      card: 'bg-white border-[#EEDADA] shadow-sm text-[#4A3232]',
      border: 'border-[#EEDADA]',
      primary: 'bg-[#A25A5A] text-white hover:bg-[#8B4848] hover:shadow-md transition-all',
      accent: 'text-[#A25A5A]',
      accentBg: 'bg-[#F5E6E6] text-[#693939] border-[#EEDADA]',
      secondaryBg: 'bg-[#FBF2F2] text-[#4A3232]',
      textMuted: 'text-[#967474]',
      headerBg: 'from-[#8B4848] to-[#A25A5A] text-white',
      headerText: 'text-white',
      headerSub: 'text-[#F5E6E6]',
      headerIcon: 'bg-white/10 text-white border-white/20',
      headerBtn: 'bg-white/10 hover:bg-white/20 border-white/15 text-white',
      input: 'bg-white border-[#EEDADA] focus:border-[#A25A5A] focus:ring-[#A25A5A]/20 text-[#4A3232]',
      footerBg: 'bg-[#FCF8F8]',
      footerText: 'text-[#967474]',
      divider: 'bg-[#A25A5A]',
      btnActive: 'bg-[#A25A5A] text-white border-[#A25A5A] shadow-sm font-semibold',
      btnInactive: 'bg-transparent border-[#EEDADA] hover:bg-[#F5E6E6] text-[#4A3232]',
      statusBarColor: '#8B4848',
      isStatusBarDark: true,
    },
    royal: {
      bg: 'bg-[#060B18] text-[#E2E8F0]',
      card: 'bg-[#0D1527] border-[#1E294B] shadow-xl shadow-black/30 text-[#E2E8F0]',
      border: 'border-[#1E294B]',
      primary: 'bg-[#38BDF8] text-[#030712] hover:bg-[#0EA5E9] font-semibold hover:shadow-md transition-all',
      accent: 'text-[#38BDF8]',
      accentBg: 'bg-[#0C1E3A] text-sky-200 border-[#1E294B]/50',
      secondaryBg: 'bg-[#0F172A] text-slate-300',
      textMuted: 'text-slate-400',
      headerBg: 'from-[#030712] to-[#0D1527] text-white border-b border-[#1E294B]',
      headerText: 'text-white',
      headerSub: 'text-sky-300',
      headerIcon: 'bg-white/5 text-sky-400 border-white/10',
      headerBtn: 'bg-white/10 hover:bg-white/20 border-white/15 text-white',
      input: 'bg-[#0D1527] border-[#1E294B] focus:border-[#38BDF8] focus:ring-[#38BDF8]/20 text-white',
      footerBg: 'bg-[#030712]',
      footerText: 'text-slate-500',
      divider: 'bg-[#38BDF8]',
      btnActive: 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-sm font-semibold',
      btnInactive: 'bg-transparent border-[#1E294B] hover:bg-[#0F172A] text-slate-300',
      statusBarColor: '#030712',
      isStatusBarDark: true,
    },
    crimson: {
      bg: 'bg-[#120707] text-[#fceeed]',
      card: 'bg-[#1d0e0e] border-[#371919] shadow-lg text-[#fceeed]',
      border: 'border-[#371919]',
      primary: 'bg-[#e11d48] text-white hover:bg-[#be123c] font-semibold hover:shadow-md transition-all',
      accent: 'text-[#fda4af]',
      accentBg: 'bg-[#371213] text-[#fda4af] border-[#fda4af]/20',
      secondaryBg: 'bg-[#180909] text-[#f3cbd0]',
      textMuted: 'text-[#c084fc]/70',
      headerBg: 'from-[#120707] to-[#1d0e0e] text-white border-b border-[#371919]',
      headerText: 'text-white',
      headerSub: 'text-[#fda4af]',
      headerIcon: 'bg-[#1d0e0e] text-[#fda4af] border-[#371919]',
      headerBtn: 'bg-[#180909] hover:bg-[#371213] border-[#371919] text-white',
      input: 'bg-[#1d0e0e] border-[#371919] focus:border-[#e11d48] focus:ring-[#e11d48]/20 text-[#fceeed]',
      footerBg: 'bg-[#120707]',
      footerText: 'text-[#cca7ab]',
      divider: 'bg-[#e11d48]',
      btnActive: 'bg-[#e11d48] text-white border-[#e11d48] shadow-sm font-semibold',
      btnInactive: 'bg-transparent border-[#371919] hover:bg-[#1d0e0e] text-[#f3cbd0]',
      statusBarColor: '#120707',
      isStatusBarDark: true,
    },
    teal: {
      bg: 'bg-[#F0F7F7] text-[#132A2A]',
      card: 'bg-white border-[#D0E2E2] shadow-sm text-[#132A2A]',
      border: 'border-[#D0E2E2]',
      primary: 'bg-[#147B7D] text-white hover:bg-[#0E5B5D] hover:shadow-md transition-all',
      accent: 'text-[#147B7D]',
      accentBg: 'bg-[#E2F0F0] text-[#0A3D3E] border-[#D0E2E2]',
      secondaryBg: 'bg-[#EBF3F3] text-[#132A2A]',
      textMuted: 'text-[#608282]',
      headerBg: 'from-[#0E5B5D] to-[#147B7D] text-white',
      headerText: 'text-white',
      headerSub: 'text-[#E2F0F0]',
      headerIcon: 'bg-white/10 text-white border-white/20',
      headerBtn: 'bg-white/10 hover:bg-white/20 border-white/15 text-white',
      input: 'bg-white border-[#D0E2E2] focus:border-[#147B7D] focus:ring-[#147B7D]/20 text-[#132A2A]',
      footerBg: 'bg-[#EBF3F3]',
      footerText: 'text-[#608282]',
      divider: 'bg-[#147B7D]',
      btnActive: 'bg-[#147B7D] text-white border-[#147B7D] shadow-sm font-semibold',
      btnInactive: 'bg-transparent border-[#D0E2E2] hover:bg-[#E2F0F0] text-[#132A2A]',
      statusBarColor: '#0E5B5D',
      isStatusBarDark: true,
    }
  };

  const fontClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    amiri: 'font-amiri'
  };

  const fontSizeClasses = {
    sm: 'text-sm md:text-base leading-relaxed',
    md: 'text-base md:text-lg leading-relaxed',
    lg: 'text-lg md:text-xl leading-relaxed',
    xl: 'text-xl md:text-2xl leading-loose',
    '2xl': 'text-2xl md:text-3xl leading-loose'
  };

  const activeTheme = themeClasses[preferences.theme] || themeClasses.emerald;
  const isRtl = preferences.languageMode !== 'en';

  // Status Bar and Theme Sync effect
  useEffect(() => {
    // 1. Sync HTML Meta theme-color
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const color = activeTheme.statusBarColor || '#064e3b';
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', color);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }

    // 2. Sync Android Capacitor Status Bar
    const syncStatusBar = async () => {
      try {
        const { StatusBar: CapStatusBar, Style: CapStyle } = await import('@capacitor/status-bar');
        await CapStatusBar.setBackgroundColor({ color });
        await CapStatusBar.setStyle({
          style: activeTheme.isStatusBarDark ? CapStyle.Dark : CapStyle.Light
        });
      } catch (e) {
        console.log('Capacitor StatusBar plugin not available on web:', e);
      }
    };
    syncStatusBar();
  }, [preferences.theme, activeTheme]);

  // Capacitor Android Back Button Router Connection
  const activeArticleIdRef = useRef<string | null>(null);
  const showAboutCreatorRef = useRef(false);

  useEffect(() => {
    activeArticleIdRef.current = activeArticleId;
  }, [activeArticleId]);

  useEffect(() => {
    showAboutCreatorRef.current = showAboutCreator;
  }, [showAboutCreator]);

  useEffect(() => {
    let handler: any;
    const setupBackButton = async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        handler = await CapApp.addListener('backButton', () => {
          if (showAboutCreatorRef.current) {
            setShowAboutCreator(false);
          } else if (activeArticleIdRef.current !== null) {
            handleBackToLibrary();
          } else {
            // If on home screen and no dialogs are open, close the app gracefully
            CapApp.exitApp();
          }
        });
      } catch (e) {
        console.log('Capacitor App plugin not available on web:', e);
      }
    };
    setupBackButton();
    return () => {
      if (handler && typeof handler.remove === 'function') {
        handler.remove();
      }
    };
  }, []);

  // Highlight color helper map
  const highlightColorClasses = {
    yellow: 'bg-yellow-100 dark:bg-yellow-950/60 border-r-4 border-yellow-400 pl-2 pr-1 rounded-sm py-0.5',
    green: 'bg-green-100 dark:bg-green-950/60 border-r-4 border-green-400 pl-2 pr-1 rounded-sm py-0.5',
    blue: 'bg-blue-100 dark:bg-blue-950/60 border-r-4 border-blue-400 pl-2 pr-1 rounded-sm py-0.5',
    rose: 'bg-rose-100 dark:bg-rose-950/60 border-r-4 border-rose-400 pl-2 pr-1 rounded-sm py-0.5',
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${activeTheme.bg} ${fontClasses[preferences.fontFamily]}`}>
      
      {/* SPLASH SCREEN */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#09090b] text-white z-50 flex flex-col items-center justify-center p-6 select-none"
          >
            {/* Elegant scholastic background pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-radial-gradient"></div>
            
            <div className="relative text-center space-y-6 max-w-md w-full flex flex-col items-center">
              {/* Glowing Book Logo */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="p-5 bg-amber-500/5 rounded-3xl border border-amber-500/25 shadow-2xl relative"
              >
                <div className="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full"></div>
                <BookOpenCheck className="w-20 h-20 text-amber-500 relative z-10" />
              </motion.div>

              {/* Title & Slogan */}
              <div className="space-y-3">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-4xl md:text-5xl font-extrabold tracking-wide font-amiri text-amber-100"
                >
                  د شیطان پرستۍ پېژندنه
                </motion.h1>
                <motion.p
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xs font-sans uppercase tracking-widest text-amber-500/80"
                >
                  لومړۍ برخه: تاریخ، نظریات او حقیقتونه
                </motion.p>
              </div>

              {/* Loader */}
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-6">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="w-full h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                ></motion.div>
              </div>

              {/* Footer text inside splash */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-[-100px] w-64 text-center space-y-1.5"
              >
                <p className="text-[13px] font-amiri text-amber-400 font-bold tracking-wide">
                  ترتيب کوونکی: ډاکټر فريدون احرار
                </p>
                <p className="text-[12px] font-amiri text-amber-200/80 font-semibold tracking-wide">
                  اپلکيشن جوړونکی: طالب العلم خبيب تکل
                </p>
                <p className="text-[10px] font-sans text-neutral-400 opacity-60">
                  کامل افلاین مطالعې اثر — له انټرنیټ پرته
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* GLOBAL HEADER */}
      <header className={`safe-padding-top pb-6 px-4 md:px-8 bg-gradient-to-r ${activeTheme.headerBg} shadow-md transition-all duration-300 relative overflow-hidden`}>
        {/* Subtle Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToLibrary}>
            <div className={`p-2.5 rounded-xl border transition-all ${activeTheme.headerIcon}`}>
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="text-right">
              <h1 className={`text-2xl md:text-3xl font-bold tracking-tight font-amiri ${activeTheme.headerText}`}>د شیطان پرستۍ پېژندنه</h1>
              <p className={`text-xs md:text-sm font-sans tracking-wide ${activeTheme.headerSub}`}>لومړۍ برخه — علمي او کلتوري افلاین لوستونکی</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Quick stats on Header */}
            <div className={`flex items-center gap-4 px-4 py-2 rounded-xl border text-xs transition-all ${activeTheme.headerBtn}`}>
              <div className="flex items-center gap-1.5" title="پرله پسې لوستلو ورځې">
                <Flame className="w-4.5 h-4.5 text-orange-500 animate-pulse fill-orange-500" />
                <span className="font-semibold text-sm">{streakCount} ورځ</span>
              </div>
              <div className="w-px h-4 opacity-20 bg-current"></div>
              <div className="flex items-center gap-1.5" title="نن ورځ لوستل شوي وخت">
                <Clock className="w-4.5 h-4.5 opacity-80" />
                <span className="font-semibold text-sm">{getTodayMinutes()} دققې</span>
              </div>
            </div>

            {/* Quick Day/Night Toggle Button */}
            <button 
              onClick={() => {
                const isDarkNow = ['dark', 'night', 'royal', 'crimson'].includes(preferences.theme);
                setPreferences(prev => ({ ...prev, theme: isDarkNow ? 'sepia' : 'night' }));
              }}
              className={`p-2.5 rounded-xl border transition-all ${activeTheme.headerBtn}`}
              title="دورځي او شپې موډ"
            >
              {['dark', 'night', 'royal', 'crimson'].includes(preferences.theme) ? (
                <Sun className="w-4.5 h-4.5 text-yellow-500 animate-pulse" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-indigo-500" />
              )}
            </button>

            {/* Reader Preferences Button */}
            <button 
              onClick={() => setShowPreferencesMenu(!showPreferencesMenu)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs ${
                showPreferencesMenu ? activeTheme.btnActive : activeTheme.headerBtn
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span>تنظیمات</span>
            </button>
          </div>
        </div>
      </header>

      {/* FLOATING PREFERENCES DRAWER/CARD */}
      <AnimatePresence>
        {showPreferencesMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`w-full border-b transition-all ${activeTheme.card} z-40 relative`}
          >
            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              
              {/* Theme Settings */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <Sun className="w-4 h-4" /> رنګ او ډیزاین (Theme)
                </h3>
                <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {(['natural', 'light', 'dark', 'sepia', 'emerald', 'night', 'rose', 'royal', 'crimson', 'teal'] as ReaderTheme[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setPreferences(prev => ({ ...prev, theme: t }))}
                      className={`py-1.5 px-2 rounded-lg border text-[11px] transition-all font-semibold text-right flex items-center justify-between gap-1 ${
                        preferences.theme === t 
                          ? activeTheme.btnActive 
                          : activeTheme.btnInactive
                      }`}
                    >
                      <span>
                        {t === 'natural' ? 'طبیعي 🌿' : 
                         t === 'light' ? 'روښانه ☀️' : 
                         t === 'dark' ? 'تیاره 🌙' : 
                         t === 'sepia' ? 'کتابي 📜' : 
                         t === 'emerald' ? 'زمرد 🟢' : 
                         t === 'night' ? 'تور تم 🕶️' : 
                         t === 'rose' ? 'ګلابي 🌸' : 
                         t === 'royal' ? 'شاهي 👑' : 
                         t === 'crimson' ? 'سور بخمل 🍎' : 
                         'شین بخمل 🌊'}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full border border-current opacity-70" style={{
                        backgroundColor: t === 'natural' ? '#EFECE3' :
                                         t === 'light' ? '#059669' :
                                         t === 'dark' ? '#0f172a' :
                                         t === 'sepia' ? '#a0522d' :
                                         t === 'emerald' ? '#047857' :
                                         t === 'night' ? '#000000' :
                                         t === 'rose' ? '#A25A5A' :
                                         t === 'royal' ? '#0B132B' :
                                         t === 'crimson' ? '#9E2A2B' : '#147B7D'
                      }}></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Sizing */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> د لیک بڼه (Font Size)
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  {(['sm', 'md', 'lg', 'xl', '2xl'] as FontSize[]).map(sz => (
                    <button
                      key={sz}
                      onClick={() => setPreferences(prev => ({ ...prev, fontSize: sz }))}
                      className={`flex-1 min-w-[45px] py-1.5 rounded-lg border text-xs uppercase transition-all font-semibold ${
                        preferences.fontSize === sz 
                          ? activeTheme.btnActive 
                          : activeTheme.btnInactive
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family Selector */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> د ليک ډول (Font Style)
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'amiri', name: 'الامیري (نسخ)' },
                    { id: 'sans', name: 'انټر (کوچنی)' },
                    { id: 'serif', name: 'رسمي (Serif)' },
                    { id: 'mono', name: 'تخنیکي (Mono)' }
                  ].map(font => (
                    <button
                      key={font.id}
                      onClick={() => setPreferences(prev => ({ ...prev, fontFamily: font.id as FontFamily }))}
                      className={`py-1.5 px-3 rounded-lg border text-xs transition-all font-semibold ${
                        preferences.fontFamily === font.id 
                          ? activeTheme.btnActive 
                          : activeTheme.btnInactive
                      }`}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Info Card */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> د دې علمي اثر په اړه
                </h3>
                <div className={`p-3 rounded-lg border border-dashed text-xs leading-relaxed text-justify opacity-90 ${activeTheme.border}`}>
                  <p>دا یو غني علمي او تحصیلي اثر دی چې د شیطان پرستۍ ډلو، تاریخ، معاصر وضعیت او نښو په اړه د فکري بيدارۍ او معلوماتو د زیاتوالي په موخه په پښتو ژبه وړاندې کېږي.</p>
                  <div className="mt-2 pt-2 border-t border-dashed border-slate-300/10 text-center font-amiri space-y-1">
                    <p className="font-bold text-amber-500 text-[13px]">
                      ترتيب کوونکی: ډاکټر فريدون احرار
                    </p>
                    <p className="text-slate-400 text-[12px] font-medium">
                      اپلکيشن جوړونکی: طالب العلم خبيب تکل
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Extra Tools section in Pref Drawer */}
            <div className={`px-6 py-3 border-t flex flex-wrap items-center justify-between text-xs gap-4 ${activeTheme.secondaryBg}`}>
              <div className="flex items-center gap-4">
                {/* Auto Scroll speed control */}
                <div className="flex items-center gap-2">
                  <span className="opacity-80">د خودکار سکرول سرعت:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={preferences.autoScrollSpeed} 
                    onChange={(e) => setPreferences(prev => ({ ...prev, autoScrollSpeed: parseInt(e.target.value) }))}
                    className="w-24 accent-emerald-600" 
                  />
                  <span className="font-mono bg-emerald-600/10 px-1.5 py-0.5 rounded text-emerald-600 font-semibold">{preferences.autoScrollSpeed}</span>
                </div>

                <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>

                {/* Daily target setting */}
                <div className="flex items-center gap-2">
                  <span className="opacity-80">ورځنی هدف:</span>
                  <select 
                    value={preferences.dailyGoalMinutes} 
                    onChange={(e) => setPreferences(prev => ({ ...prev, dailyGoalMinutes: parseInt(e.target.value) }))}
                    className="bg-transparent border border-slate-300 dark:border-slate-700 rounded px-1 py-0.5 text-xs text-inherit focus:outline-none"
                  >
                    {[5, 10, 15, 20, 30, 45, 60].map(m => (
                      <option key={m} value={m} className="bg-slate-800 text-white">{m} دقیقې</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reset Preferences and Close button */}
              <div className="flex items-center gap-2 ml-auto">
                <button 
                  onClick={handleMockReadProgress} 
                  className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] flex items-center gap-1 font-semibold"
                  title="د ازموینې لپاره د مطالعې وخت اضافه کړئ"
                >
                  <Plus className="w-3 h-3" /> د لوستلو وخت زیاتول (+1m)
                </button>
                <button 
                  onClick={() => setPreferences({
                    theme: 'night',
                    fontSize: 'lg',
                    fontFamily: 'amiri',
                    languageMode: 'ps',
                    autoScrollSpeed: 0,
                    dailyGoalMinutes: 10
                  })}
                  className="px-2 py-1 bg-rose-600 text-white hover:bg-rose-700 rounded text-[10px] font-semibold"
                >
                  ریسیټ کول
                </button>
                <button 
                  onClick={() => setShowPreferencesMenu(false)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[10px]"
                >
                  پټول
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN APP WORKSPACE */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: MAIN DASHBOARD & CHAPTER LIST */}
          {!activeArticleId ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              
              {/* HERO WELCOME WIDGET */}
              <div className={`p-6 rounded-2xl border transition-all relative overflow-hidden ${activeTheme.card}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10">
                  <div className="space-y-2 text-right w-full md:w-2/3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${activeTheme.accentBg}`}>
                      <Sparkles className="w-3.5 h-3.5" /> فکري بيداري او کلتوري څېړنه
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold font-amiri tracking-tight">ښه راغلاست</h2>
                    <p className={`text-sm md:text-base leading-relaxed text-justify ${activeTheme.textMuted}`}>
                      د «د شیطان پرستۍ پېژندنه» لومړي علمي او کلتوري افلاین لوستونکي اپلیکېشن ته ښه راغلاست. دلته تاسو د شیطان پرستۍ د تاریخ، د هغې د بېلابېلو بڼو، د هغوی د عمده سمبولونو او عقایدو او د دې انحرافي فکري تګلارو څخه زموږ د ځوان کهول د ژغورنې د لارو چارو په اړه پوره مستند موضوعات په پښتو ژبه مطالعه کولی شئ.
                    </p>
                  </div>
                  
                  {/* Streak & Goal Tracker Ring widget */}
                  <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-500/5 border border-slate-300/10">
                    <div className="relative flex items-center justify-center w-24 h-24">
                      {/* Circle Background */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-300 dark:text-slate-800" />
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - Math.min(1, getTodayMinutes() / preferences.dailyGoalMinutes))}
                          className={`${activeTheme.accent} transition-all duration-500`} 
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percent/Minutes Label */}
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-bold">{Math.round((getTodayMinutes() / preferences.dailyGoalMinutes) * 100)}%</span>
                        <span className="text-[9px] uppercase opacity-75">د نن هدف</span>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-xs font-medium">نن مو <span className={`font-bold ${activeTheme.accent}`}>{getTodayMinutes()} دققې</span> مطالعه کړې ده</p>
                      <p className="text-[10px] opacity-75 mt-0.5">ستاسو هدف: {preferences.dailyGoalMinutes} دقیقې</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUOTE OF THE DAY WIDGET */}
              <div className={`p-6 rounded-2xl border transition-all relative overflow-hidden ${activeTheme.card}`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-current/5 pointer-events-none opacity-30"></div>
                <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-300/20">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500 text-white rounded-lg">
                      <Sparkles className="w-4 h-4 fill-white" />
                    </div>
                    <h3 className="font-bold text-sm font-amiri">مبارک ارشاد او معنوي لارښود</h3>
                  </div>
                  <button 
                    onClick={() => setQuoteIndex(prev => (prev + 1) % QUOTES.length)}
                    className={`text-xs flex items-center gap-1 px-2.5 py-1 ${activeTheme.accent} bg-current/10 hover:bg-current/20 rounded-lg transition-all font-semibold`}
                  >
                    <RotateCcw className="w-3 h-3" /> بل قول ښودل
                  </button>
                </div>

                <div className="text-center space-y-4 py-2">
                  {QUOTES[quoteIndex].textAr && (
                    <p className={`text-xl md:text-2xl font-bold font-amiri tracking-wide leading-loose ${activeTheme.accent}`}>
                      « {QUOTES[quoteIndex].textAr} »
                    </p>
                  )}
                  
                  <p className="text-base md:text-lg font-medium leading-relaxed max-w-4xl mx-auto italic font-amiri text-slate-800 dark:text-slate-200">
                    "{QUOTES[quoteIndex].textPs}"
                  </p>

                  <div className={`text-xs font-semibold font-amiri mt-1 ${activeTheme.accent}`}>
                    — {QUOTES[quoteIndex].source}
                  </div>
                </div>
              </div>

              {/* BOOKMARKS AND NOTES HIGHLIGHT PANEL (ONLY SHOWS IF THEY EXIST) */}
              {(bookmarks.length > 0 || notes.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Saved Bookmarks mini list */}
                  {bookmarks.length > 0 && (
                    <div className={`p-5 rounded-2xl border transition-all ${activeTheme.card}`}>
                      <div className="flex items-center gap-2 mb-3 border-b pb-2.5 border-slate-300/20">
                        <Bookmark className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                        <h3 className="font-bold text-sm font-amiri">خوندي شوې نښې او مباحث ({bookmarks.length})</h3>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                        {bookmarks.map(b => (
                          <div 
                            key={b.id}
                            onClick={() => handleOpenArticle(b.articleId, b.paragraphId)}
                            className={`p-2.5 rounded-xl border border-slate-300/10 cursor-pointer flex items-center justify-between text-xs transition-all hover:bg-current/5`}
                          >
                            <div className="flex items-center gap-2 text-right">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                                {preferences.languageMode === 'en' ? b.titleEn : b.titlePs}
                              </span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookmarks(prev => prev.filter(item => item.id !== b.id));
                              }}
                              className="p-1 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-all"
                              title="ړنګول"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Saved Notes mini list */}
                  {notes.length > 0 && (
                    <div className={`p-5 rounded-2xl border transition-all ${activeTheme.card}`}>
                      <div className="flex items-center gap-2 mb-3 border-b pb-2.5 border-slate-300/20">
                        <FileText className={`w-4.5 h-4.5 ${activeTheme.accent}`} />
                        <h3 className="font-bold text-sm font-amiri">زما یادښتونه او شرحې ({notes.length})</h3>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                        {notes.map(n => {
                          const art = ARTICLES.find(a => a.id === n.articleId);
                          return (
                            <div 
                              key={n.id}
                              onClick={() => handleOpenArticle(n.articleId, n.paragraphId)}
                              className="p-2.5 rounded-xl border border-slate-300/10 cursor-pointer text-xs transition-all hover:bg-current/5 space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-[10px] opacity-75">
                                <span className={`font-semibold ${activeTheme.accent}`}>
                                  {art ? (preferences.languageMode === 'en' ? art.titleEn : art.titlePs) : 'مبحث'}
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNote(n.id);
                                  }}
                                  className="p-1 hover:text-rose-500 hover:bg-rose-500/10 rounded"
                                  title="ړنګول"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">"{n.text}"</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                                کرښه: {n.paragraphPs}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* SEARCH & CATEGORY SELECTOR */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search box */}
                <div className="w-full md:w-1/3 relative">
                  <input
                    type="text"
                    placeholder="موضوع، کلیمې یا فصلونه وپلټئ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full py-2.5 pl-4 pr-10 rounded-xl border text-sm outline-none transition-all ${activeTheme.input}`}
                  />
                  <Search className="w-4.5 h-4.5 absolute right-3.5 top-3.5 opacity-60 text-inherit" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-3 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-xs opacity-60"
                    >
                      پاکول
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="w-full md:w-2/3 flex items-center gap-1.5 overflow-x-auto pb-1 justify-start md:justify-end">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                        selectedCategory === cat.id
                          ? activeTheme.btnActive
                          : `border border-slate-300/10 ${activeTheme.secondaryBg} opacity-80 hover:opacity-100`
                      }`}
                    >
                      {cat.ps}
                    </button>
                  ))}
                </div>

              </div>

              {/* ARTICLES GRID */}
              <div>
                <h3 className={`text-lg font-bold font-amiri mb-4 border-r-4 pr-2 ${activeTheme.accent}`}>
                  د اثر علمي او تحصیلي موضوعات ({filteredArticles.length})
                </h3>

                {filteredArticles.length === 0 ? (
                  <div className={`p-12 text-center rounded-2xl border space-y-3 ${activeTheme.card}`}>
                    <FileText className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
                    <h4 className="font-bold text-base">هیڅ موضوع ونه موندل شوه</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      ستاسو د لټون پوښتنې "{searchQuery}" سره برابر هیڅ شی ونه موندل شو. مهرباني وکړئ نورې کلمې هڅه وکړئ.
                    </p>
                    <button 
                      onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTheme.primary}`}
                    >
                      د لټون پاکول
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article, index) => {
                      const articleProg = progress.find(p => p.articleId === article.id);
                      const isCompleted = articleProg?.completed ?? false;
                      const scrollPercent = articleProg?.scrollPercent ?? 0;
                      
                      return (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`rounded-2xl border transition-all hover:scale-[1.015] hover:shadow-lg flex flex-col justify-between overflow-hidden relative group ${activeTheme.card}`}
                        >
                          {/* Progress Line */}
                          {scrollPercent > 0 && (
                            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800/40 z-10">
                              <div 
                                className={`h-full transition-all duration-300 bg-amber-500`}
                                style={{ width: `${scrollPercent}%` }}
                              ></div>
                            </div>
                          )}

                          <div className="p-5 space-y-3 flex-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className={`px-2 py-0.5 rounded-full font-semibold ${activeTheme.accentBg}`}>
                                {article.categoryPs}
                              </span>
                              <span className="flex items-center gap-1 opacity-70 font-semibold">
                                <Clock className="w-3.5 h-3.5" />
                                {article.readTime} دقیقې
                              </span>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-lg font-bold font-amiri group-hover:opacity-85 transition-opacity leading-snug">
                                {article.titlePs}
                              </h4>
                            </div>

                            <p className="text-xs leading-relaxed opacity-85 text-justify">
                              {article.summaryPs}
                            </p>
                          </div>

                          {/* Footer with actions */}
                          <div className="p-5 pt-0 border-t border-slate-300/10 mt-3 flex items-center justify-between">
                            {/* Read state indicator */}
                            <div className="text-xs">
                              {isCompleted ? (
                                <span className={`font-semibold flex items-center gap-1 ${activeTheme.accent}`}>
                                  <Check className="w-4 h-4" /> لوستل شوی
                                </span>
                              ) : scrollPercent > 0 ? (
                                <span className="text-amber-500 font-semibold">
                                  د مطالعې لاندې ({Math.round(scrollPercent)}%)
                                </span>
                              ) : (
                                <span className="opacity-60 text-[11px] font-medium">پیل شوی نه دی</span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleShareArticle(article)}
                                className="p-2 hover:bg-slate-500/10 text-slate-500 hover:text-inherit rounded-xl transition-all"
                                title="شریکول یا لینک کاپي کول"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleOpenArticle(article.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${activeTheme.primary}`}
                              >
                                لوستل پیل کړئ <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

            </motion.div>
          ) : (
            
            /* VIEW 2: IMMERSIVE CHAPTER READER */
            (() => {
              const article = ARTICLES.find(a => a.id === activeArticleId);
              if (!article) return null;

              return (
                <motion.div
                  key="reader"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  
                  {/* READER ACTION TOP BAR */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 sticky top-4 z-30 shadow-md ${activeTheme.card}`}>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleBackToLibrary}
                        className="p-2 bg-slate-500/10 hover:bg-slate-500/20 text-inherit rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
                        title="کور پاڼې ته تګ"
                      >
                        <ArrowLeft className="w-4.5 h-4.5" />
                        <span>بیرته شاته</span>
                      </button>
                      <div className="hidden sm:block text-right">
                        <h4 className="font-bold text-sm font-amiri line-clamp-1">{article.titlePs}</h4>
                        <p className="text-[10px] text-slate-500 font-sans line-clamp-1">{article.titleEn}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Read Aloud Play Button */}
                      <button 
                        onClick={handleToggleReadAloud}
                        className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                          isReadAloudPlaying 
                            ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                            : `${activeTheme.accentBg} hover:opacity-95`
                        }`}
                        title={isReadAloudPlaying ? "بندول" : "په آواز اورېدل"}
                      >
                        {isReadAloudPlaying ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5 animate-bounce-slow" />}
                        <span className="hidden md:inline">{isReadAloudPlaying ? "غږ درول" : "غږیز اورېدل"}</span>
                      </button>

                      {/* Bookmark entire article */}
                      <button 
                        onClick={() => handleToggleBookmark(article.id)}
                        className={`p-2.5 rounded-xl border transition-all ${
                          bookmarks.some(b => b.id === article.id)
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-slate-500/10 hover:bg-slate-500/20 border-transparent'
                        }`}
                        title="دا موضوع نښه کول"
                      >
                        <Bookmark className="w-4.5 h-4.5 fill-current" />
                      </button>

                      {/* Share Article */}
                      <button 
                        onClick={() => handleShareArticle(article)}
                        className="p-2.5 bg-slate-500/10 hover:bg-slate-500/20 rounded-xl transition-all"
                        title="مبحث شریکول"
                      >
                        <Share2 className="w-4.5 h-4.5" />
                      </button>

                      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                      {/* Settings toggle shortcut */}
                      <button 
                        onClick={() => setShowPreferencesMenu(!showPreferencesMenu)}
                        className={`p-2.5 rounded-xl border transition-all ${
                          showPreferencesMenu ? activeTheme.btnActive : 'bg-slate-500/10 hover:bg-slate-500/20 border-transparent'
                        }`}
                        title="تنظیمات"
                      >
                        <Settings className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* ACTIVE READING HEADER */}
                  <div className="text-center space-y-2 py-6 max-w-3xl mx-auto">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${activeTheme.accentBg}`}>
                      {article.categoryPs}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold font-amiri leading-normal">
                      {article.titlePs}
                    </h2>
                    <div className={`w-16 h-1 mx-auto rounded-full mt-4 ${activeTheme.divider}`}></div>
                  </div>

                  {/* ARTICLE TEXT CONTENT */}
                  <div className={`max-w-3xl mx-auto w-full space-y-6 md:space-y-8 pb-20 ${fontSizeClasses[preferences.fontSize]}`}>
                    {article.paragraphs.map((paragraph) => {
                      const paragraphHighlight = highlights.find(h => h.paragraphId === paragraph.id);
                      const isSpoken = activeSpokenParagraphId === paragraph.id;
                      const hasNote = notes.filter(n => n.paragraphId === paragraph.id);

                      // Standard Standard Paragraph HTML markup
                      return (
                        <div 
                          key={paragraph.id}
                          id={paragraph.id}
                          className={`group relative p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-slate-500/10 ${
                            isSpoken ? `ring-2 ring-offset-2 ${activeTheme.accent === 'text-[#556b2f]' ? 'ring-[#8b5a2b]' : 'ring-emerald-500'}` : ''
                          } ${
                            paragraphHighlight ? highlightColorClasses[paragraphHighlight.color as keyof typeof highlightColorClasses] : ''
                          }`}
                        >
                          {/* PARAGRAPH INTERACTIVE HOVER FLOATING TOOLBAR */}
                          <div className={`absolute top-0 ${isRtl ? 'left-2' : 'right-2'} -translate-y-1/2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all z-20 flex items-center gap-1 px-2 py-1 rounded-lg shadow-md border ${activeTheme.card}`}>
                            
                            {/* TTS play for this paragraph */}
                            <button
                              onClick={() => speakParagraph(paragraph)}
                              className={`p-1 hover:bg-current/10 rounded transition-all ${activeTheme.accent}`}
                              title="له همدې ځایه اورېدل"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>

                            {/* Bookmark paragraph */}
                            <button
                              onClick={() => handleToggleBookmark(article.id, paragraph.id)}
                              className={`p-1 rounded ${
                                bookmarks.some(b => b.paragraphId === paragraph.id)
                                  ? 'text-amber-500 hover:bg-amber-500/10'
                                  : 'hover:bg-slate-500/10 text-slate-400'
                              }`}
                              title="کرښه نښه کول"
                            >
                              <Bookmark className="w-3.5 h-3.5 fill-current" />
                            </button>

                            {/* Highlight triggers */}
                            <div className="flex gap-0.5 items-center px-1 border-r border-l border-slate-300/20">
                              {(['yellow', 'green', 'blue', 'rose'] as const).map(color => (
                                <button
                                  key={color}
                                  onClick={() => handleHighlight(paragraph.id, color)}
                                  className={`w-3.5 h-3.5 rounded-full transition-transform hover:scale-125 ${
                                    color === 'yellow' ? 'bg-yellow-400' :
                                    color === 'green' ? 'bg-green-400' :
                                    color === 'blue' ? 'bg-blue-400' : 'bg-rose-400'
                                  }`}
                                  title={`${color} نښه کول`}
                                />
                              ))}
                              {paragraphHighlight && (
                                <button 
                                  onClick={() => handleHighlight(paragraph.id, 'clear')}
                                  className="text-[10px] text-slate-400 hover:text-rose-500 px-1"
                                >
                                  پاکول
                                </button>
                              )}
                            </div>

                            {/* Add Note */}
                            <button
                              onClick={() => {
                                setActiveParagraphActionsId(paragraph.id);
                                setNewNoteText('');
                              }}
                              className={`p-1 hover:bg-current/10 rounded transition-all ${activeTheme.accent}`}
                              title="شرحه یا نوټ کښل"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>

                            {/* Copy Paragraph */}
                            <button
                              onClick={() => handleCopyText(paragraph)}
                              className={`p-1 rounded transition-all ${copiedParagraphId === paragraph.id ? activeTheme.accent : 'hover:bg-slate-500/10 text-slate-500'}`}
                              title="کاپي کول"
                            >
                              {copiedParagraphId === paragraph.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                          </div>

                          {/* RENDER CONTENT BY TYPE */}
                          {paragraph.type === 'heading' ? (
                            <h3 className={`text-xl md:text-2xl font-bold font-amiri mt-6 mb-2 border-r-4 pr-2 leading-snug ${activeTheme.accent === 'text-[#556b2f]' ? 'border-[#8b5a2b]' : 'border-emerald-600'} ${activeTheme.accent}`}>
                              {paragraph.textPs}
                            </h3>
                          ) : paragraph.type === 'quran' ? (
                            <div className={`my-6 p-6 rounded-2xl border text-center space-y-4 bg-current/[0.03] ${activeTheme.accent === 'text-[#556b2f]' ? 'border-[#8b5a2b]/30' : 'border-emerald-500/20'}`}>
                              <span className={`text-[10px] font-bold tracking-widest uppercase ${activeTheme.accent}`}>مقدس ارشاد</span>
                              <p className={`text-2xl md:text-3xl font-extrabold font-amiri leading-loose text-center tracking-wide pr-2 ${activeTheme.accent}`}>
                                ﴿ {paragraph.textAr} ﴾
                              </p>
                              <p className="text-base md:text-lg font-medium leading-relaxed font-amiri text-slate-800 dark:text-slate-200">
                                « {paragraph.textPs} »
                              </p>
                              {paragraph.reference && (
                                <div className={`text-xs font-semibold font-amiri ${activeTheme.accent}`}>
                                  — {paragraph.reference}
                                </div>
                              )}
                            </div>
                          ) : paragraph.type === 'hadith' ? (
                            <div className="my-6 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4 text-center">
                              <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">مبارک حدیث</span>
                              {paragraph.textAr && (
                                <p className="text-xl md:text-2xl font-bold font-amiri text-amber-600 dark:text-amber-400 leading-loose">
                                  « {paragraph.textAr} »
                                </p>
                              )}
                              <p className="text-base md:text-lg font-medium leading-relaxed font-amiri text-slate-800 dark:text-slate-200">
                                "{paragraph.textPs}"
                              </p>
                              {paragraph.reference && (
                                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 font-amiri">
                                  — {paragraph.reference}
                                </div>
                              )}
                            </div>
                          ) : (
                            /* STANDARD PARAGRAPH */
                            <div className="space-y-2">
                              <p className="text-justify font-amiri leading-loose pr-2">
                                {paragraph.textPs}
                              </p>
                            </div>
                          )}

                          {/* INLINE NOTE WRITING BOX */}
                          {activeParagraphActionsId === paragraph.id && (
                            <div className={`mt-3 p-4 rounded-xl border space-y-2 ${activeTheme.card}`}>
                              <h4 className="font-bold text-xs flex items-center gap-1">
                                <Edit3 className="w-3.5 h-3.5" /> 
                                {isEditingNoteId ? 'یادښت اصلاح کړئ' : 'شخصي تشریح یا یادښت کښل'}
                              </h4>
                              <textarea
                                value={newNoteText}
                                onChange={(e) => setNewNoteText(e.target.value)}
                                placeholder="دا موضوع څنګه پوه شوئ؟ د مطالعې دغه نقطه مو دلته ولیکئ..."
                                rows={3}
                                className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-2 ${activeTheme.input}`}
                              />
                              <div className="flex justify-end gap-2 text-[10px]">
                                <button
                                  onClick={() => {
                                    setActiveParagraphActionsId(null);
                                    setIsEditingNoteId(null);
                                    setNewNoteText('');
                                  }}
                                  className="px-3 py-1.5 bg-slate-500/10 rounded-lg"
                                >
                                  بندول
                                </button>
                                <button
                                  onClick={() => handleSaveNote(paragraph.id, paragraph.textPs)}
                                  className={`px-3 py-1.5 text-white font-semibold rounded-lg transition-all ${activeTheme.primary}`}
                                >
                                  خوندي کول
                                </button>
                              </div>
                            </div>
                          )}

                          {/* DISPLAY ATTACHED PERSONAL NOTES IN-LINE */}
                          {hasNote.length > 0 && (
                            <div className={`mt-3 space-y-2 pl-4 border-r-2 ${activeTheme.accent === 'text-[#556b2f]' ? 'border-[#8b5a2b]' : 'border-emerald-500'}`}>
                              {hasNote.map(note => (
                                <div key={note.id} className={`p-3 rounded-xl text-xs space-y-1.5 border ${activeTheme.card}`}>
                                  <div className="flex items-center justify-between opacity-80 text-[10px]">
                                    <span className={`font-semibold ${activeTheme.accent}`}>ستاسو یادښت</span>
                                    <div className="flex gap-1.5">
                                      <button 
                                        onClick={() => handleEditNoteStart(note)}
                                        className={`hover:opacity-80 font-semibold ${activeTheme.accent}`}
                                      >
                                        سمول
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="hover:text-rose-500"
                                      >
                                        پاکول
                                      </button>
                                    </div>
                                  </div>
                                  <p className="font-bold text-slate-800 dark:text-slate-100">{note.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                  {/* BOTTOM NEXT/PREV ARTICLE BUTTONS */}
                  <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${activeTheme.card}`}>
                    <div className="text-center md:text-right">
                      <h4 className="font-bold text-base font-amiri">تاسو ددې موضوع لوستل بشپړ کړل!</h4>
                      <p className="text-xs text-slate-500 mt-1">ستاسو د مطالعې دغه وخت په ورځنیو لاګونو کې په بشپړ ډول اضافه شو.</p>
                    </div>

                    <button
                      onClick={handleBackToLibrary}
                      className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-all ${activeTheme.primary}`}
                    >
                      بېرته کور پاڼې ته تلل <ArrowLeft className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                </motion.div>
              );
            })()
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className={`py-8 px-4 text-center border-t text-xs mt-auto transition-all ${activeTheme.footerBg} ${activeTheme.footerText}`}>
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="font-amiri text-sm">بېشکه د علم لاسته راوړل پر هر انسان روښنايي او برکت خپروي.</p>
          
          <button
            onClick={() => setShowAboutCreator(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold rounded-xl border border-amber-500/25 transition-all text-xs cursor-pointer shadow-sm animate-bounce"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            د اپلیکیشن جوړونکي په اړه (Developer Info)
          </button>

          <p className="font-sans text-xs leading-relaxed">
            © 2026 د شیطان پرستۍ پېژندنه (لومړۍ برخه) — ټول حقونه خوندي دي. <br className="sm:hidden" />
            <span className="font-bold text-amber-500">ترتيب کوونکی: ډاکټر فريدون احرار</span> | <span className="font-bold text-amber-500">اپلکيشن جوړونکی: طالب العلم خبيب تکل</span> — د کامل افلاین مطالعې لپاره.
          </p>
        </div>
      </footer>

      {/* BACK TO TOP FLOATING BUTTON */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-40 ${activeTheme.primary}`}
          title="پورته تلل"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* ABOUT CREATOR OVERLAY / MODAL */}
      <AnimatePresence>
        {showAboutCreator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl relative overflow-hidden text-right max-h-[90vh] overflow-y-auto ${activeTheme.card} ${activeTheme.border}`}
            >
              {/* Corner decorative shape */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-br-full pointer-events-none border-b border-r border-amber-500/10"></div>
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-200/15 mb-4">
                <button
                  onClick={() => setShowAboutCreator(false)}
                  className="p-1.5 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all cursor-pointer"
                  title="تړل"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${activeTheme.accent}`} />
                  <h3 className="font-amiri text-xl font-bold">د اپلیکیشن جوړونکي په اړه</h3>
                </div>
              </div>

              <div className="space-y-4 text-justify font-sans leading-relaxed text-sm">
                <div className="grid grid-cols-2 gap-4 py-2 text-center border-b border-slate-200/10 pb-4">
                  {/* Compiler Info */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-white border border-white/5">
                        <span className="font-amiri text-lg font-bold text-amber-400">فريدون</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-amiri text-sm font-bold">ډاکټر فريدون احرار</h4>
                      <p className="text-[10px] text-slate-400">د علمي اثر کتاب ترتیب کوونکی</p>
                    </div>
                  </div>

                  {/* Developer Info */}
                  <div className="flex flex-col items-center gap-2 border-r border-slate-200/10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 p-0.5 shadow-md flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-white border border-white/5">
                        <span className="font-amiri text-lg font-bold text-amber-500">خبيب</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-amiri text-sm font-bold">طالب العلم خبيب تکل</h4>
                      <p className="text-[10px] text-slate-400">اپلیکیشن جوړونکی او خپروونکی</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
                  <p className="font-medium text-slate-800 dark:text-slate-100 font-amiri text-base leading-relaxed text-right">
                    الحمد لله رب العالمين والصلوة والسلام على رسوله الکريم. د دې علمي اپلیکیشن د جوړولو او خپرولو هدف زموږ د مسلمانه ټولنې، په ځانګړې توګه د ځوان نسل فکري بيداري، او د هغوی د عقیدوي او فکري انحرافاتو څخه ژغورل دي. په دې پروګرام کې د ډاکټر فریدون احرار لخوا د شیطان پرستۍ د تاریخ، ډولونو، خطرونو او نښو په اړه علمي، دقیق او څېړنیز معلومات په پوره امانتدارۍ راټول او په اسانه او افلاین ډول وړاندې شوي دي. هیله ده د دې علمي خدمت په قبلېدو کې راسره په دعاګانو کې برخه واخلئ.
                  </p>
                  <p className="font-bold text-left font-amiri text-amber-500 pt-1.5 text-sm border-t border-amber-500/10 flex flex-col items-end gap-1">
                    <span>— د کتاب ترتیب کوونکی: ډاکټر فريدون احرار</span>
                    <span>— د اپلیکیشن جوړونکی: طالب العلم خبيب تکل</span>
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <h5 className="font-bold text-xs uppercase tracking-wider opacity-70 border-b border-slate-200/10 pb-1 flex items-center justify-end gap-1.5">
                    اړیکې او ټولنیز ادرسونه
                  </h5>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href="https://www.facebook.com/khobaib.takal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-semibold rounded-xl border border-[#1877F2]/20 transition-all text-center"
                    >
                      <span className="font-mono text-[11px] text-left">khobaib.takal</span>
                      <span>فیسبوک 🔵</span>
                    </a>

                    <a
                      href="https://t.me/khubaib_takl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] font-semibold rounded-xl border border-[#0088cc]/20 transition-all text-center"
                    >
                      <span className="font-mono text-[11px] text-left">@khubaib_takl</span>
                      <span>ټلګرام ✈️</span>
                    </a>

                    <a
                      href="https://wa.me/93765443156"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-semibold rounded-xl border border-[#25D366]/20 transition-all text-center"
                    >
                      <span className="font-mono text-[11px] text-left">+93765443156</span>
                      <span>واټساپ 🟢</span>
                    </a>

                    <a
                      href="mailto:khobibtakl@gmail.com"
                      className="flex items-center justify-between p-2.5 bg-[#EA4335]/10 hover:bg-[#EA4335]/20 text-[#EA4335] font-semibold rounded-xl border border-[#EA4335]/20 transition-all text-center"
                    >
                      <span className="font-mono text-[11px] text-left">khobibtakl@gmail</span>
                      <span>بریښنالیک ✉️</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
