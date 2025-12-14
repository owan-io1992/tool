import React, { useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, UnstyledButton, rem } from '@mantine/core';
import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import classes from './Layout.module.css';

interface LinksGroupProps {
  icon: React.ElementType;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  link?: string; // For single items without children
  opened?: boolean;
  onToggle?: () => void;
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  link,
  opened,
  onToggle,
}: LinksGroupProps) {
  const location = useLocation();

  // Determine if grouped is opened based on current path match
  const hasActiveChild = links?.some((item) => location.pathname.startsWith(item.link));

  // Internal state for uncontrolled mode
  const [uncontrolledOpened, setUncontrolledOpened] = useState(
    initiallyOpened || hasActiveChild || false,
  );

  const isControlled = opened !== undefined;
  const isOpened = isControlled ? opened : uncontrolledOpened;

  const hasLinks = Array.isArray(links);

  const handleClick = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setUncontrolledOpened((o) => !o);
    }
  };

  // If it's a single link, render a direct Link component
  if (!hasLinks && link) {
    return (
      <UnstyledButton
        component={Link}
        to={link}
        className={classes.control}
        // Close other groups when clicking a single link if controlled
        onClick={isControlled ? onToggle : undefined}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
        </Group>
      </UnstyledButton>
    );
  }

  const items = (hasLinks ? links : []).map((link) => (
    <Link
      className={classes.link}
      to={link.link}
      key={link.label}
      data-active={location.pathname === link.link || undefined}
    >
      {link.label}
    </Link>
  ));

  return (
    <>
      <UnstyledButton onClick={handleClick} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronRight
              className={classes.chevron}
              strokeWidth={1.5}
              size={16}
              style={{ transform: isOpened ? 'rotate(90deg)' : 'none' }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={isOpened}>{items}</Collapse> : null}
    </>
  );
}
