import React from 'react';
import { useTranslation } from 'react-i18next';

const PasswordLeak: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('menu.passwordLeak')}</h2>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  );
};

export default PasswordLeak;