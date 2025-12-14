import React, { useState } from 'react';
import {
  Title,
  Grid,
  Textarea,
  SegmentedControl,
  Paper,
  Container,
  Stack,
  Alert,
  Group,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Info, AlertCircle } from 'lucide-react';

// Helper for UTF-8 safe Base64 encoding/decoding
const toBase64 = (str: string) => {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16)),
      ),
    );
  } catch {
    throw new Error('Encoding failed');
  }
};

const fromBase64 = (str: string) => {
  try {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  } catch {
    // If UTF-8 decode fails, fallback to simple atob for raw binary (though unlikely to render well if binary)
    // Or just re-throw to show error
    try {
      return atob(str);
    } catch {
      throw new Error('Decoding failed');
    }
  }
};

const Base64Converter: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('encode');

  const { output, error } = React.useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      const res = mode === 'encode' ? toBase64(input) : fromBase64(input);
      return { output: res, error: '' };
    } catch {
      return { output: '', error: t('base64.error') };
    }
  }, [input, mode, t]);

  return (
    <Container size="xl">
      <Stack gap="md">
        <Title order={2}>{t('base64.title')}</Title>

        <Group>
          <SegmentedControl
            value={mode}
            onChange={setMode}
            data={[
              { label: t('base64.encode'), value: 'encode' },
              { label: t('base64.decode'), value: 'decode' },
            ]}
          />
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper p="md" withBorder>
              <Textarea
                label={t('base64.input')}
                placeholder={mode === 'encode' ? 'Hello World' : 'SGVsbG8gV29ybGQ='}
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                minRows={10}
                autosize
              />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper p="md" withBorder style={{ height: '100%' }}>
              <Stack style={{ height: '100%' }}>
                <Textarea
                  label={t('base64.output')}
                  value={output}
                  readOnly
                  minRows={10}
                  autosize
                  error={Boolean(error)}
                />
                {error && (
                  <Alert variant="light" color="red" title="Error" icon={<AlertCircle size={16} />}>
                    {error}
                  </Alert>
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        <Alert variant="light" color="blue" title="Info" icon={<Info size={16} />}>
          {t('home.clientSideDesc')}
        </Alert>
      </Stack>
    </Container>
  );
};

export default Base64Converter;
