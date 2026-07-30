// lib/theme/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { themeMap, ThemeKey } from '@/lib/theme';

// 定義 Context 的資料結構
interface ThemeContextType {
  themeKey: ThemeKey;
  theme: typeof themeMap[ThemeKey];
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  // 預設主題為 'white'
  const [themeKey, setThemeKey] = useState<ThemeKey>('white');

  // 【優化】從瀏覽器 localStorage 讀取使用者上次的選擇
  useEffect(() => {
    const savedTheme = localStorage.getItem('user-app-theme') as ThemeKey;
    if (savedTheme && themeMap[savedTheme]) {
      setThemeKey(savedTheme);
    }
  }, []);

  const changeTheme = (key: ThemeKey) => {
    setThemeKey(key);
    localStorage.setItem('user-app-theme', key);
  };

  const value = {
    themeKey,
    theme: themeMap[themeKey], // 這裡就是關鍵！動態指向對應的檔案物件
    setTheme: changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {/* 最外層用一個 div 包裹，並把 page 的背景色和文字色套上去，確保底色跟著主題變 */}
      <div className={themeMap[themeKey].classes.layout.page + " min-h-screen"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// 建立一個好用的 Hook 讓各組件方便呼叫
export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within CustomThemeProvider');
  return context;
}