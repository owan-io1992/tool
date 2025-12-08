import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Layout from '../components/Layout';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock the lucide-react icons as they might cause issues in test environment
// or just to keep it simple
// vi.mock('lucide-react', () => ({
//   Menu: () => <div data-testid="icon-menu" />,
//   Lock: () => <div data-testid="icon-lock" />,
//   Network: () => <div data-testid="icon-network" />,
//   Clock: () => <div data-testid="icon-clock" />,
//   ChevronDown: () => <div data-testid="icon-chevron-down" />,
//   ChevronRight: () => <div data-testid="icon-chevron-right" />,
//   Globe: () => <div data-testid="icon-globe" />,
// }));

describe('Layout Component', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  const renderWithRouterAndI18n = (component: React.ReactNode) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>{component}</BrowserRouter>
      </I18nextProvider>,
    );
  };

  it('renders the app title', () => {
    renderWithRouterAndI18n(<Layout />);
    expect(screen.getByText('Tool box')).toBeDefined();
  });

  it('renders menu items', () => {
    renderWithRouterAndI18n(<Layout />);
    expect(screen.getByText('Password')).toBeDefined();
    expect(screen.getByText('Network')).toBeDefined();
    expect(screen.getByText('Epoch')).toBeDefined();
  });

  it('toggles language when buttons are clicked', async () => {
    renderWithRouterAndI18n(<Layout />);

    const zhButton = screen.getByText('繁中');
    fireEvent.click(zhButton);
    expect(await screen.findByText('工具應用')).toBeDefined();
    expect(screen.getByText('密碼')).toBeDefined();

    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);
    expect(await screen.findByText('Tool box')).toBeDefined();
    expect(screen.getByText('Password')).toBeDefined();
  });
});
