import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Network, Clock } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-amber-900 transition-colors dark:text-amber-500">
          {t('home.welcome')}
        </h1>
        <p className="text-xl text-amber-800 transition-colors dark:text-slate-300">
          {t('home.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center gap-3 text-amber-700 dark:text-amber-400">
            <Shield size={24} />
            <h3 className="text-lg font-semibold">{t('menu.password')}</h3>
          </div>
          <p className="text-amber-900/70 dark:text-slate-400">{t('home.passwordDesc')}</p>
        </div>

        <div className="rounded-lg border border-amber-100 bg-amber-50 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center gap-3 text-amber-700 dark:text-amber-400">
            <Network size={24} />
            <h3 className="text-lg font-semibold">{t('menu.network')}</h3>
          </div>
          <p className="text-amber-900/70 dark:text-slate-400">{t('home.networkDesc')}</p>
        </div>

        <div className="rounded-lg border border-amber-100 bg-amber-50 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center gap-3 text-amber-700 dark:text-amber-400">
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
