import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Settings {
  length: number;
  count: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  customSymbols: string;
}

const DEFAULT_SYMBOLS = '!?@#$%^&+-=';

const DEFAULT_SETTINGS: Settings = {
  length: 12,
  count: 1,
  useUppercase: true,
  useLowercase: true,
  useNumbers: true,
  useSymbols: true,
  customSymbols: DEFAULT_SYMBOLS,
};

const PasswordGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('passwordGeneratorSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Save settings to local storage
  useEffect(() => {
    localStorage.setItem('passwordGeneratorSettings', JSON.stringify(settings));
  }, [settings]);

  const generatePasswords = () => {
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: settings.customSymbols,
    };

    let validChars = '';
    if (settings.useUppercase) validChars += chars.uppercase;
    if (settings.useLowercase) validChars += chars.lowercase;
    if (settings.useNumbers) validChars += chars.numbers;
    if (settings.useSymbols) validChars += chars.symbols;

    if (!validChars) return;

    const newPasswords: string[] = [];
    for (let i = 0; i < settings.count; i++) {
      let password = '';
      for (let j = 0; j < settings.length; j++) {
        password += validChars.charAt(Math.floor(Math.random() * validChars.length));
      }
      newPasswords.push(password);
    }
    setPasswords(newPasswords);
    setCopiedIndex(null);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const applyProfile = (type: 'simple' | 'medium' | 'high') => {
    switch (type) {
      case 'simple':
        setSettings({ ...settings, length: 8, useUppercase: true, useLowercase: true, useNumbers: true, useSymbols: false, customSymbols: DEFAULT_SYMBOLS });
        break;
      case 'medium':
        setSettings({ ...settings, length: 12, useUppercase: true, useLowercase: true, useNumbers: true, useSymbols: true, customSymbols: DEFAULT_SYMBOLS });
        break;
      case 'high':
        setSettings({ ...settings, length: 16, useUppercase: true, useLowercase: true, useNumbers: true, useSymbols: true, customSymbols: DEFAULT_SYMBOLS });
        break;
    }
  };

  const getStrength = (pwd: string) => {
    // Simple strength calculation
    if (pwd.length < 8) return 'Weak';
    if (pwd.length < 12) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = (pwd: string) => {
    if (pwd.length < 8) return 'text-red-500';
    if (pwd.length < 12) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-6 text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        {t('generator.title')}
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{t('generator.settings')}</h3>

          {/* Profiles */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('generator.profiles')}</label>
            <div className="flex gap-2">
              <button onClick={() => applyProfile('simple')} className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">{t('generator.simple')}</button>
              <button onClick={() => applyProfile('medium')} className="rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50">{t('generator.medium')}</button>
              <button onClick={() => applyProfile('high')} className="rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50">{t('generator.high')}</button>
            </div>
          </div>

          {/* Length & Count */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('generator.length')}</label>
              <input type="number" min="4" max="64" value={settings.length} onChange={(e) => setSettings({ ...settings, length: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('generator.count')}</label>
              <input type="number" min="1" max="50" value={settings.count} onChange={(e) => setSettings({ ...settings, count: parseInt(e.target.value) || 1 })} className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          {/* Characters */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('generator.characters')}</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={settings.useUppercase} onChange={(e) => setSettings({ ...settings, useUppercase: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 ring-offset-gray-800" />
                <span className="text-gray-700 dark:text-gray-300">{t('generator.uppercase')}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={settings.useLowercase} onChange={(e) => setSettings({ ...settings, useLowercase: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 ring-offset-gray-800" />
                <span className="text-gray-700 dark:text-gray-300">{t('generator.lowercase')}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={settings.useNumbers} onChange={(e) => setSettings({ ...settings, useNumbers: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 ring-offset-gray-800" />
                <span className="text-gray-700 dark:text-gray-300">{t('generator.numbers')}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={settings.useSymbols} onChange={(e) => setSettings({ ...settings, useSymbols: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 ring-offset-gray-800" />
                <span className="text-gray-700 dark:text-gray-300">{t('generator.symbols')}</span>
              </label>
            </div>
            {settings.useSymbols && (
              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t('generator.customSymbols')}</label>
                <input type="text" value={settings.customSymbols} onChange={(e) => setSettings({ ...settings, customSymbols: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>
            )}
          </div>

          <button onClick={generatePasswords} className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {t('generator.generate')}
          </button>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {passwords.length > 0 && passwords.map((pwd, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="break-all font-mono text-lg text-gray-800 dark:text-gray-200">
                {pwd}
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className={`text-xs font-medium ${getStrengthColor(pwd)}`}>
                  {getStrength(pwd)}
                </span>
                <button onClick={() => copyToClipboard(pwd, idx)} className="rounded-lg bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                  {copiedIndex === idx ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  )}
                </button>
              </div>
            </div>
          ))}
          {passwords.length === 0 && (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-300 p-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Click Generate to create passwords
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
