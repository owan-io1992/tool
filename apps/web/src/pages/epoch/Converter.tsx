import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Clock, Globe } from 'lucide-react';

const formatLocalTime = (date: Date, tz: string) => {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      // ISO-like format YYYY-MM-DD
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    })
      .format(date)
      .replace(', ', ' ');
  } catch {
    return date.toLocaleString();
  }
};

const getRelativeTime = (date: Date, now: number) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diffInSeconds = (date.getTime() - now) / 1000;

  if (Math.abs(diffInSeconds) < 60) return rtf.format(Math.round(diffInSeconds), 'second');
  if (Math.abs(diffInSeconds) < 3600) return rtf.format(Math.round(diffInSeconds / 60), 'minute');
  if (Math.abs(diffInSeconds) < 86400) return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
  if (Math.abs(diffInSeconds) < 604800) return rtf.format(Math.round(diffInSeconds / 86400), 'day');
  if (Math.abs(diffInSeconds) < 2592000)
    return rtf.format(Math.round(diffInSeconds / 604800), 'week');
  if (Math.abs(diffInSeconds) < 31536000)
    return rtf.format(Math.round(diffInSeconds / 2592000), 'month');
  return rtf.format(Math.round(diffInSeconds / 31536000), 'year');
};

const parseDateInput = (input: string): Date | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;
  let date: Date | null = null;

  // Try parsing as number (Unix Timestamp)
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const num = parseFloat(trimmed);
    // Guess unit based on magnitude
    if (Math.abs(num) < 1e11) {
      // Seconds
      date = new Date(num * 1000);
    } else if (Math.abs(num) < 1e14) {
      // Milliseconds
      date = new Date(num);
    } else if (Math.abs(num) < 1e17) {
      // Microseconds
      date = new Date(num / 1000);
    } else {
      // Nanoseconds
      date = new Date(num / 1000000);
    }
  } else {
    // Try parsing as String
    date = new Date(trimmed);
  }

  // Check if valid date
  if (date && !isNaN(date.getTime())) {
    try {
      date.toISOString();
      return date;
    } catch {
      return null;
    }
  }
  return null;
};

const EpochConverter: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState<string>(() => Math.floor(Date.now() / 1000).toString());
  const [timeZone, setTimeZone] = useState<string>('UTC');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Current Unix Time ticker
  const [currentUnixTime, setCurrentUnixTime] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUnixTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeZones = useMemo(() => {
    try {
      const supported = Intl.supportedValuesOf('timeZone');
      return supported.includes('UTC') ? supported : ['UTC', ...supported];
    } catch (e) {
      console.error(e);
      return ['UTC', 'Asia/Taipei', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];
    }
  }, []);

  const parsedResults = useMemo(() => {
    const lines = input
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '');
    if (lines.length === 0) return [];

    return lines.map((line) => ({
      original: line,
      date: parseDateInput(line),
    }));
  }, [input]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getSingleOutputValues = (date: Date) => {
    return [
      {
        label: t('epochConverter.timestampSeconds'),
        value: Math.floor(date.getTime() / 1000).toString(),
      },
      {
        label: t('epochConverter.timestampMillis'),
        value: date.getTime().toString(),
      },
      {
        label: t('epochConverter.iso8601'),
        value: date.toISOString(),
      },
      {
        label: t('epochConverter.local'),
        value: formatLocalTime(date, timeZone),
      },
      {
        label: t('epochConverter.relative'),
        value: getRelativeTime(date, currentUnixTime * 1000),
      },
    ];
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
          {t('epochConverter.title')}
        </h2>

        {/* Timezone Selector - Top Right */}
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-gray-500" />
          <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('epochConverter.timezone')}:
          </label>
          <select
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column: Input */}
        <div className="flex flex-col gap-4">
          <div className="h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {t('epochConverter.input')}
              </h3>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('epochConverter.inputPlaceholder')}
              className="h-96 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              spellCheck={false}
            />
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Supports: Unix timestamp (seconds, ms, μs, ns), ISO 8601, Date strings</p>
              <p className="mt-1 text-xs opacity-75">One per line for batch conversion</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setInput(Math.floor(Date.now() / 1000).toString())}
                className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                Now (Sec)
              </button>
              <button
                onClick={() => setInput(Date.now().toString())}
                className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                Now (Ms)
              </button>
              <button
                onClick={() => setInput(new Date().toISOString())}
                className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                Now (ISO)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col gap-4">
          <div className="h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              {t('epochConverter.output')}
            </h3>

            {parsedResults.length > 1 ? (
              // Batch View
              <div className="flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-2">
                {parsedResults.map((res, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700/50"
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600">
                      <span className="mr-2 font-mono text-xs break-all text-gray-500 dark:text-gray-400">
                        {res.original}
                      </span>
                      {res.date && (
                        <button
                          onClick={() =>
                            copyToClipboard(res.date?.toISOString() || '', `iso-${index}`)
                          }
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          title="Copy ISO"
                        >
                          {copiedField === `iso-${index}` ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                    {res.date ? (
                      <div className="grid gap-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="w-16 text-xs text-gray-500 dark:text-gray-400">ISO</span>
                          <span className="truncate font-mono text-sm text-gray-900 dark:text-gray-200">
                            {res.date.toISOString()}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="w-16 text-xs text-gray-500 dark:text-gray-400">
                            Local
                          </span>
                          <span className="truncate font-mono text-sm text-gray-900 dark:text-gray-200">
                            {formatLocalTime(res.date, timeZone)}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="w-16 text-xs text-gray-500 dark:text-gray-400">
                            Relative
                          </span>
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                            {getRelativeTime(res.date, currentUnixTime * 1000)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-red-500">Invalid Date</span>
                    )}
                  </div>
                ))}
              </div>
            ) : parsedResults.length === 1 && parsedResults[0].date ? (
              // Single View
              <div className="space-y-4">
                {getSingleOutputValues(parsedResults[0].date).map((item, idx) => (
                  <div key={idx} className="group">
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {item.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-lg bg-gray-50 p-3 font-mono text-sm break-all text-gray-900 dark:bg-gray-700 dark:text-white">
                        {item.value}
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.value, item.label)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-200"
                        title={t('epochConverter.copy')}
                      >
                        {copiedField === item.label ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty or Invalid Single View
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
                Invalid Date or Timestamp
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Unix Time Footer */}
      <div className="mt-8 text-center">
        <div className="inline-flex flex-col items-center justify-center rounded-xl bg-gray-100 px-8 py-4 dark:bg-gray-800">
          <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Current Unix Time
          </div>
          <div className="flex items-center gap-3">
            <div className="font-mono text-3xl font-bold text-gray-900 dark:text-blue-400">
              {currentUnixTime}
            </div>
            <button
              onClick={() => copyToClipboard(currentUnixTime.toString(), 'currentUnixTime')}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              title={t('epochConverter.copy')}
            >
              {copiedField === 'currentUnixTime' ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <Copy className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpochConverter;
