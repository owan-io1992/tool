import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Lock,
  Network,
  Clock, 
  ChevronDown, 
  ChevronRight,
  Globe
} from 'lucide-react';

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
    <div className="flex h-screen bg-amber-50/30">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col border-r border-amber-100">
        <div className="p-4 border-b border-amber-100">
          <Link to="/" className="text-xl font-bold text-amber-900 hover:text-amber-700 transition-colors">
            {t('app.title')}
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id} className="mb-2">
                <div
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    expandedMenus.includes(item.id)
                      ? 'bg-amber-50 text-amber-900'
                      : 'text-gray-700 hover:bg-amber-50/50 hover:text-amber-800'
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
                          className={`block p-2 rounded text-sm transition-colors ${
                            location.pathname === child.path
                              ? 'bg-amber-100 text-amber-900 font-medium'
                              : 'text-gray-600 hover:bg-amber-50 hover:text-amber-800'
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

        {/* Language Switcher */}
        <div className="p-4 border-t border-amber-100 bg-amber-50/30">
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
            <Globe size={16} />
            <span>{t('common.language')}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                i18n.language === 'en'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-amber-50'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('zh-TW')}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                i18n.language === 'zh-TW'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-amber-50'
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