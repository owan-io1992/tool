import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Network, Clock, Sun, Moon, Home, Menu, Github } from 'lucide-react';
import { Group, ActionIcon, rem, useMantineColorScheme, ScrollArea, Code } from '@mantine/core';
import { LinksGroup } from './NavbarLinksGroup';
import classes from './Layout.module.css';
import packageJson from '../../package.json';

const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();

  const mockdata = React.useMemo(
    () => [
      { label: t('home.welcome'), icon: Home, link: '/' },
      {
        label: t('menu.password'),
        icon: Lock,
        links: [{ label: t('menu.passwordGenerator'), link: '/secret/generator' }],
      },
      {
        label: t('menu.network'),
        icon: Network,
        links: [{ label: t('menu.cidrCalculator'), link: '/network/cidr' }],
      },
      {
        label: t('menu.epoch'),
        icon: Clock,
        links: [{ label: t('menu.epochConverter'), link: '/time/converter' }],
      },
    ],
    [t],
  );

  // Initialize openedGroup based on current route
  const [openedGroup, setOpenedGroup] = useState<string | null>(() => {
    const foundGroup = mockdata.find((item) =>
      item.links?.some((link) => location.pathname.startsWith(link.link)),
    );
    return foundGroup ? foundGroup.label : null;
  });

  // Update openedGroup when location changes (optional, keeps sidebar synced)
  useEffect(() => {
    const foundGroup = mockdata.find((item) =>
      item.links?.some((link) => location.pathname.startsWith(link.link)),
    );
    if (foundGroup && foundGroup.label !== openedGroup) {
      // Use functional update or standard, but check if different first
      setOpenedGroup(foundGroup.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, mockdata]);

  const links = mockdata.map((item) => (
    <LinksGroup
      key={item.label}
      {...item}
      opened={openedGroup === item.label}
      onToggle={() => setOpenedGroup((prev) => (prev === item.label ? null : item.label))}
    />
  ));

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <nav className={classes.navbar}>
        <div className={classes.header}>
          <Group justify="space-between">
            <Group gap="xs">
              <Menu size={24} />
              <Code fw={700}>v{packageJson.version}</Code>
            </Group>
          </Group>
        </div>

        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>

        <div className={classes.footer}>
          <Group justify="space-between" align="center">
            <Group gap={5}>
              <ActionIcon
                variant="default"
                onClick={() => toggleColorScheme()}
                size="lg"
                aria-label="Toggle color scheme"
              >
                {colorScheme === 'dark' ? (
                  <Sun style={{ width: rem(18), height: rem(18) }} />
                ) : (
                  <Moon style={{ width: rem(18), height: rem(18) }} />
                )}
              </ActionIcon>

              <ActionIcon
                component="a"
                href="https://github.com/owan-io1992/tool"
                target="_blank"
                rel="noopener noreferrer"
                variant="default"
                size="lg"
                aria-label="GitHub Repository"
              >
                <Github style={{ width: rem(18), height: rem(18) }} />
              </ActionIcon>
            </Group>

            <Group gap={5}>
              <ActionIcon
                variant={i18n.language === 'en' ? 'filled' : 'default'}
                onClick={() => changeLanguage('en')}
                size="lg"
                color="blue"
              >
                <code style={{ fontSize: rem(12), fontWeight: 700 }}>EN</code>
              </ActionIcon>
              <ActionIcon
                variant={i18n.language === 'zh-TW' ? 'filled' : 'default'}
                onClick={() => changeLanguage('zh-TW')}
                size="lg"
                color="blue"
              >
                <code style={{ fontSize: rem(12), fontWeight: 700 }}>繁</code>
              </ActionIcon>
            </Group>
          </Group>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--mantine-color-body)' }}>
        <div style={{ padding: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
