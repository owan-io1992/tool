import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Network, Clock } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-500 mb-4 transition-colors">{t('home.welcome')}</h1>
        <p className="text-xl text-amber-800 dark:text-slate-300 transition-colors">{t('home.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-amber-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-amber-100 dark:border-slate-700 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3 text-amber-700 dark:text-amber-400">
            <Shield size={24} />
            <h3 className="text-lg font-semibold">{t('menu.password')}</h3>
          </div>
          <p className="text-amber-900/70 dark:text-slate-400">{t('home.passwordDesc')}</p>
        </div>

        <div className="bg-amber-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-amber-100 dark:border-slate-700 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3 text-amber-700 dark:text-amber-400">
            <Network size={24} />
            <h3 className="text-lg font-semibold">{t('menu.network')}</h3>
          </div>
          <p className="text-amber-900/70 dark:text-slate-400">{t('home.networkDesc')}</p>
        </div>

        <div className="bg-amber-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-amber-100 dark:border-slate-700 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3 text-amber-700 dark:text-amber-400">
            <Clock size={24} />
            <h3 className="text-lg font-semibold">{t('menu.epoch')}</h3>
          </div>
          <p className="text-amber-900/70 dark:text-slate-400">{t('home.epochDesc')}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;