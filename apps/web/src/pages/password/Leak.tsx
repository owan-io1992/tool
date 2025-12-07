import React from 'react';
import { useTranslation } from 'react-i18next';

const PasswordLeak: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-slate-100 transition-colors">{t('menu.passwordLeak')}</h2>
      <p className="text-gray-600 dark:text-slate-400 transition-colors">Coming soon...</p>
    </div>
  );
};

export default PasswordLeak;