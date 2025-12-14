import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Clock, Globe } from 'lucide-react';
import {
  Container,
  Select,
  Textarea,
  Button,
  Group,
  Stack,
  Paper,
  Text,
  ActionIcon,
  ThemeIcon,
  Grid,
  Code,
  ScrollArea,
  Title,
} from '@mantine/core';

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
    <Container size="xl" py="lg">
      <Group justify="space-between" mb="lg">
        <Title order={2} size="h1" fw={900}>
          {t('epochConverter.title')}
        </Title>

        <Group>
          <ThemeIcon variant="light" color="gray" size="md">
            <Globe size={18} />
          </ThemeIcon>
          <Select
            value={timeZone}
            onChange={(val) => setTimeZone(val || 'UTC')}
            data={timeZones}
            searchable
            placeholder={t('epochConverter.timezone')}
            style={{ width: 250 }}
          />
        </Group>
      </Group>

      <Grid gutter="xl">
        {/* Left Column: Input */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md" h="100%">
            <Stack>
              <Group>
                <ThemeIcon variant="light" size="lg">
                  <Clock size={20} />
                </ThemeIcon>
                <Text component="h3" size="lg" fw={600}>
                  {t('epochConverter.input')}
                </Text>
              </Group>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                placeholder={t('epochConverter.inputPlaceholder')}
                minRows={12}
                maxRows={20}
                styles={{ input: { fontFamily: 'monospace' } }}
              />

              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Supports: Unix timestamp (seconds, ms, μs, ns), ISO 8601, Date strings
                </Text>
                <Text size="xs" c="dimmed" fs="italic">
                  One per line for batch conversion
                </Text>
              </Stack>

              <Group gap="xs">
                <Button
                  variant="light"
                  size="xs"
                  onClick={() => setInput(Math.floor(Date.now() / 1000).toString())}
                >
                  Now (Sec)
                </Button>
                <Button variant="light" size="xs" onClick={() => setInput(Date.now().toString())}>
                  Now (Ms)
                </Button>
                <Button
                  variant="light"
                  size="xs"
                  onClick={() => setInput(new Date().toISOString())}
                >
                  Now (ISO)
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Right Column: Output */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md" h="100%">
            <Text component="h3" size="lg" fw={600} mb="md">
              {t('epochConverter.output')}
            </Text>

            {parsedResults.length > 1 ? (
              // Batch View
              <ScrollArea h={600} offsetScrollbars>
                <Stack gap="sm">
                  {parsedResults.map((res, index) => (
                    <Paper key={index} withBorder p="sm" bg="var(--mantine-color-gray-0)">
                      <Group justify="space-between" mb="xs">
                        <Code>{res.original}</Code>
                        {res.date && (
                          <ActionIcon
                            variant="subtle"
                            color={copiedField === `iso-${index}` ? 'teal' : 'gray'}
                            onClick={() =>
                              copyToClipboard(res.date?.toISOString() || '', `iso-${index}`)
                            }
                          >
                            {copiedField === `iso-${index}` ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </ActionIcon>
                        )}
                      </Group>

                      {res.date ? (
                        <Stack gap={4}>
                          <Group justify="space-between" align="start">
                            <Text size="xs" c="dimmed" w={60}>
                              ISO
                            </Text>
                            <Text size="sm" style={{ fontFamily: 'monospace' }}>
                              {res.date.toISOString()}
                            </Text>
                          </Group>
                          <Group justify="space-between" align="start">
                            <Text size="xs" c="dimmed" w={60}>
                              Local
                            </Text>
                            <Text size="sm" style={{ fontFamily: 'monospace' }}>
                              {formatLocalTime(res.date, timeZone)}
                            </Text>
                          </Group>
                          <Group justify="space-between" align="start">
                            <Text size="xs" c="dimmed" w={60}>
                              Relative
                            </Text>
                            <Text size="xs" c="dimmed">
                              {getRelativeTime(res.date, currentUnixTime * 1000)}
                            </Text>
                          </Group>
                        </Stack>
                      ) : (
                        <Text c="red" size="sm" fw={500}>
                          Invalid Date
                        </Text>
                      )}
                    </Paper>
                  ))}
                </Stack>
              </ScrollArea>
            ) : parsedResults.length === 1 && parsedResults[0].date ? (
              // Single View
              <Stack gap="md">
                {getSingleOutputValues(parsedResults[0].date).map((item, idx) => (
                  <div key={idx}>
                    <Text size="xs" fw={500} c="dimmed" mb={4}>
                      {item.label}
                    </Text>
                    <Group gap="xs" wrap="nowrap">
                      <Code block style={{ flex: 1, padding: '8px' }}>
                        {item.value}
                      </Code>
                      <ActionIcon
                        variant="subtle"
                        size="lg"
                        color={copiedField === item.label ? 'teal' : 'gray'}
                        onClick={() => copyToClipboard(item.value, item.label)}
                      >
                        {copiedField === item.label ? <Check size={20} /> : <Copy size={20} />}
                      </ActionIcon>
                    </Group>
                  </div>
                ))}
              </Stack>
            ) : (
              // Empty or Invalid Single View
              <Stack
                align="center"
                justify="center"
                h={300}
                style={{ border: '2px dashed var(--mantine-color-gray-3)', borderRadius: '8px' }}
              >
                <Text c="dimmed">Invalid Date or Timestamp</Text>
              </Stack>
            )}
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Current Unix Time Footer */}
      <Stack align="center" mt={50}>
        <Paper p="xl" radius="lg" withBorder>
          <Stack align="center" gap="xs">
            <Text size="xl" fw={800}>
              Current Unix Time
            </Text>
            <Group>
              <Text size="xl" fw={700} style={{ fontFamily: 'monospace', fontSize: '2rem' }}>
                {currentUnixTime}
              </Text>
              <ActionIcon
                variant="subtle"
                size="xl"
                color={copiedField === 'currentUnixTime' ? 'teal' : 'gray'}
                onClick={() => copyToClipboard(currentUnixTime.toString(), 'currentUnixTime')}
              >
                {copiedField === 'currentUnixTime' ? <Check size={24} /> : <Copy size={24} />}
              </ActionIcon>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default EpochConverter;
