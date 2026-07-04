export type ParagraphType = 'standard' | 'quran' | 'hadith' | 'heading';

export interface Paragraph {
  id: string;
  type: ParagraphType;
  textAr?: string; // Arabic text for verses/hadiths
  textPs: string; // Pashto text (primary)
  textEn?: string; // English translation (optional)
  reference?: string; // Reference for verse or hadith (e.g., "سورة البقرة: ۲۵۶")
}

export interface Article {
  id: string;
  titlePs: string;
  titleEn: string;
  categoryPs: string;
  categoryEn: string;
  summaryPs: string;
  summaryEn: string;
  readTime: number; // in minutes
  paragraphs: Paragraph[];
}

export interface Bookmark {
  id: string;
  articleId: string;
  paragraphId?: string;
  savedAt: string;
  titlePs: string;
  titleEn: string;
}

export interface Highlight {
  id: string;
  articleId: string;
  paragraphId: string;
  color: string; // hex code or tailwind color class
  savedAt: string;
}

export interface Note {
  id: string;
  articleId: string;
  paragraphId: string;
  text: string;
  savedAt: string;
  paragraphPs: string;
}

export interface ReadingProgress {
  articleId: string;
  scrollPercent: number; // 0 to 100
  lastReadAt: string;
  completed: boolean;
}

export type ReaderTheme = 'natural' | 'light' | 'dark' | 'sepia' | 'emerald' | 'night' | 'rose' | 'royal' | 'crimson' | 'teal';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'amiri';
export type LanguageMode = 'ps' | 'en' | 'bilingual';

export interface UserPreferences {
  theme: ReaderTheme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  languageMode: LanguageMode;
  autoScrollSpeed: number; // 0 for off, otherwise seconds/scroll
  dailyGoalMinutes: number;
}

export interface DailyReadingLog {
  date: string; // YYYY-MM-DD
  minutes: number;
}

export interface QuoteOfTheDay {
  textAr?: string;
  textPs: string;
  textEn: string;
  source: string;
}
