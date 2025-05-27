import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { actualThemeAtom, setupThemeListener, themeModeAtom, ThemeMode } from '../stores/theme.store';

export const useTheme = () => {
  const [themeMode, setThemeMode] = useAtom(themeModeAtom);
  const [actualTheme] = useAtom(actualThemeAtom);

  // 在组件挂载时设置监听器
  useEffect(() => {
    if (themeMode === 'system') {
      return setupThemeListener(() => {
        setThemeMode('system');
      });
    }
  }, [themeMode, setThemeMode]);

  // 切换主题的函数
  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 设置特定主题的函数
  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return {
    themeMode,     
    actualTheme,   
    toggleTheme,   
    setTheme,      
  };
}; 
