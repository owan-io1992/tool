import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Title,
  Grid,
  Paper,
  Text,
  Stack,
  Group,
  Button,
  NumberInput,
  Checkbox,
  TextInput,
  Badge,
  ActionIcon,
} from '@mantine/core';
import { Check, Copy } from 'lucide-react';

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
  const [passwords, setPasswords] = useState<string[]>(() => {
    // Initial generation
    if (DEFAULT_SETTINGS.count < 1) return [];

    // We can't access 'settings' here easily if it's also state created in the same render cycle unless we duplicate logic or use refs,
    // BUT we know we are using initial settings (from localStorage or defaults).
    // Simpler approach: Just let the effect run, but suppress the lint warning if we are sure, OR use a timeout.
    // Actually, recreating the logic is messy.
    // Let's use setTimeout(..., 0) inside the effect to break synchronous execution, distinct from render phase.
    return [];
  });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePasswords = React.useCallback(() => {
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

    // Save settings to localStorage
    localStorage.setItem('passwordGeneratorSettings', JSON.stringify(settings));
  }, [settings]);

  // Generate passwords on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      generatePasswords();
    }, 0);
    return () => clearTimeout(timer);
  }, [generatePasswords]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const applyProfile = (type: 'simple' | 'medium' | 'high') => {
    switch (type) {
      case 'simple':
        setSettings({
          ...settings,
          length: 8,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: false,
          customSymbols: DEFAULT_SYMBOLS,
        });
        break;
      case 'medium':
        setSettings({
          ...settings,
          length: 12,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: true,
          customSymbols: DEFAULT_SYMBOLS,
        });
        break;
      case 'high':
        setSettings({
          ...settings,
          length: 16,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: true,
          customSymbols: DEFAULT_SYMBOLS,
        });
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
    if (pwd.length < 8) return 'red';
    if (pwd.length < 12) return 'yellow';
    return 'green';
  };

  return (
    <Container size="xl" py="lg">
      <Title order={2} mb="lg">
        {t('generator.title')}
      </Title>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Text size="lg" fw={600} mb="md">
              {t('generator.settings')}
            </Text>

            <Stack>
              {/* Profiles */}
              <div>
                <Text size="sm" fw={500} mb="xs">
                  {t('generator.profiles')}
                </Text>
                <Group gap="xs">
                  <Button
                    variant="light"
                    color="blue"
                    size="xs"
                    onClick={() => applyProfile('simple')}
                  >
                    {t('generator.simple')}
                  </Button>
                  <Button
                    variant="light"
                    color="grape"
                    size="xs"
                    onClick={() => applyProfile('medium')}
                  >
                    {t('generator.medium')}
                  </Button>
                  <Button
                    variant="light"
                    color="green"
                    size="xs"
                    onClick={() => applyProfile('high')}
                  >
                    {t('generator.high')}
                  </Button>
                </Group>
              </div>

              <Group grow>
                <NumberInput
                  label={t('generator.length')}
                  min={4}
                  max={64}
                  value={settings.length}
                  onChange={(val) =>
                    setSettings({ ...settings, length: typeof val === 'number' ? val : 12 })
                  }
                />
                <NumberInput
                  label={t('generator.count')}
                  min={1}
                  max={50}
                  value={settings.count}
                  onChange={(val) =>
                    setSettings({ ...settings, count: typeof val === 'number' ? val : 1 })
                  }
                />
              </Group>

              <div>
                <Text size="sm" fw={500} mb="xs">
                  {t('generator.characters')}
                </Text>
                <Stack gap="xs">
                  <Checkbox
                    label={t('generator.uppercase')}
                    checked={settings.useUppercase}
                    onChange={(e) =>
                      setSettings({ ...settings, useUppercase: e.currentTarget.checked })
                    }
                  />
                  <Checkbox
                    label={t('generator.lowercase')}
                    checked={settings.useLowercase}
                    onChange={(e) =>
                      setSettings({ ...settings, useLowercase: e.currentTarget.checked })
                    }
                  />
                  <Checkbox
                    label={t('generator.numbers')}
                    checked={settings.useNumbers}
                    onChange={(e) =>
                      setSettings({ ...settings, useNumbers: e.currentTarget.checked })
                    }
                  />
                  <Checkbox
                    label={t('generator.symbols')}
                    checked={settings.useSymbols}
                    onChange={(e) =>
                      setSettings({ ...settings, useSymbols: e.currentTarget.checked })
                    }
                  />
                </Stack>
              </div>

              {settings.useSymbols && (
                <TextInput
                  label={t('generator.customSymbols')}
                  value={settings.customSymbols}
                  onChange={(e) =>
                    setSettings({ ...settings, customSymbols: e.currentTarget.value })
                  }
                />
              )}

              <Button fullWidth onClick={generatePasswords} mt="md">
                {t('generator.generate')}
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack>
            {passwords.map((pwd, idx) => (
              <Paper key={idx} withBorder p="md" radius="md">
                <Group justify="space-between" align="center" wrap="nowrap">
                  <Text style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{pwd}</Text>
                  <Group gap="xs" wrap="nowrap">
                    <Badge color={getStrengthColor(pwd)} variant="light">
                      {getStrength(pwd)}
                    </Badge>
                    <ActionIcon
                      variant="subtle"
                      color={copiedIndex === idx ? 'teal' : 'gray'}
                      onClick={() => copyToClipboard(pwd, idx)}
                    >
                      {copiedIndex === idx ? <Check size={18} /> : <Copy size={18} />}
                    </ActionIcon>
                  </Group>
                </Group>
              </Paper>
            ))}
            {passwords.length === 0 && (
              <Paper
                withBorder
                p="xl"
                radius="md"
                style={{ borderStyle: 'dashed', textAlign: 'center' }}
              >
                <Text c="dimmed">Click Generate to create passwords</Text>
              </Paper>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default PasswordGenerator;
