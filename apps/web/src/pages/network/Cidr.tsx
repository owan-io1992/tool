import React from 'react';
import { useTranslation } from 'react-i18next';

const CidrCalculator: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('menu.cidrCalculator')}</h2>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  );
};

export default CidrCalculator;