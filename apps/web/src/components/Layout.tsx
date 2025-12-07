import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Lock,
  Network,
  Clock,
  ChevronDown,
  ChevronRight,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      id: 'password',
      label: t('menu.password'),
      icon: <Lock size={20} />,
      children: [
        { id: 'password-generator', label: t('menu.passwordGenerator'), path: '/password/generator' },
        { id: 'password-leak', label: t('menu.passwordLeak'), path: '/password/leak' },
      ],
    },
    {
      id: 'network',
      label: t('menu.network'),
      icon: <Network size={20} />,
      children: [
        { id: 'cidr-calculator', label: t('menu.cidrCalculator'), path: '/network/cidr' },
      ],
    },
    {
      id: 'epoch',
      label: t('menu.epoch'),
      icon: <Clock size={20} />,
      children: [
        { id: 'epoch-converter', label: t('menu.epochConverter'), path: '/epoch/converter' },
      ],
    },
  ];

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => {
      // If clicking already open menu, close it
      if (prev.includes(id)) {
        return [];
      }
      // Otherwise close all others and open this one
      return [id];
    });
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex h-screen bg-amber-50/30 dark:bg-slate-900 transition-colors duration-200">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 shadow-md flex flex-col border-r border-amber-100 dark:border-slate-700 transition-colors duration-200">
        <div className="p-4 border-b border-amber-100 dark:border-slate-700">
          <Link to="/" className="text-xl font-bold text-amber-900 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
            {t('app.title')}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id} className="mb-2">
                <div
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${expandedMenus.includes(item.id)
                      ? 'bg-amber-50 text-amber-900 dark:bg-slate-700 dark:text-amber-400'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-amber-50/50 dark:hover:bg-slate-700/50 hover:text-amber-800 dark:hover:text-amber-400'
                    }`}
                  onClick={() => item.children ? toggleMenu(item.id) : null}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.children && (
                    expandedMenus.includes(item.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  )}
                </div>

                {item.children && expandedMenus.includes(item.id) && (
                  <ul className="ml-9 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          to={child.path || '#'}
                          className={`block p-2 rounded text-sm transition-colors ${location.pathname === child.path
                              ? 'bg-amber-100 text-amber-900 dark:bg-slate-700 dark:text-amber-400 font-medium'
                              : 'text-gray-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700/50 hover:text-amber-800 dark:hover:text-amber-400'
                            }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Language Switcher & Theme Toggle */}
        <div className="p-4 border-t border-amber-100 dark:border-slate-700 bg-amber-50/30 dark:bg-slate-900/30">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 mb-4 p-2 rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-slate-400">
            <Globe size={16} />
            <span>{t('common.language')}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 text-xs rounded border transition-colors ${i18n.language === 'en'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-300 dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-slate-700'
                }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('zh-TW')}
              className={`px-3 py-1 text-xs rounded border transition-colors ${i18n.language === 'zh-TW'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-300 dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-slate-700'
                }`}
            >
              繁中
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;