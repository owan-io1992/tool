import React from 'react';
import { useTranslation } from 'react-i18next';

const PasswordLeak: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 transition-colors dark:text-slate-100">
        {t('menu.passwordLeak')}
      </h2>
      <p className="text-gray-600 transition-colors dark:text-slate-400">Coming soon...</p>
    </div>
  );
};

export default PasswordLeak;
