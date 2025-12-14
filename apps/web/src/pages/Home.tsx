import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Network, Clock } from 'lucide-react';
import { Container, Title, Text, SimpleGrid, Card, Group, ThemeIcon, rem } from '@mantine/core';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container size="lg" py="xl">
      <div style={{ textAlign: 'center', marginBottom: rem(50) }}>
        <Title order={1} mb="md" fw={900} style={{ fontSize: rem(42), lineHeight: 1.2 }}>
          {t('home.welcome')}
        </Title>
        <Text size="xl" c="dimmed" maw={600} mx="auto">
          {t('home.description')}
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group>
              <ThemeIcon size="lg" variant="light" color="orange">
                <Shield style={{ width: rem(20), height: rem(20) }} />
              </ThemeIcon>
              <Text fw={500}>{t('menu.password')}</Text>
            </Group>
          </Card.Section>

          <Text size="sm" c="dimmed" mt="md">
            {t('home.passwordDesc')}
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group>
              <ThemeIcon size="lg" variant="light" color="blue">
                <Network style={{ width: rem(20), height: rem(20) }} />
              </ThemeIcon>
              <Text fw={500}>{t('menu.network')}</Text>
            </Group>
          </Card.Section>

          <Text size="sm" c="dimmed" mt="md">
            {t('home.networkDesc')}
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group>
              <ThemeIcon size="lg" variant="light" color="indigo">
                <Clock style={{ width: rem(20), height: rem(20) }} />
              </ThemeIcon>
              <Text fw={500}>{t('menu.epoch')}</Text>
            </Group>
          </Card.Section>

          <Text size="sm" c="dimmed" mt="md">
            {t('home.epochDesc')}
          </Text>
        </Card>
      </SimpleGrid>
    </Container>
  );
};

export default Home;
