'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Início' },
  { href: '/conversao', label: 'Conversão de Bases' },
  { href: '/euclides', label: 'Algoritmo Estendido de Euclides' },
  { href: '/eratostenes', label: 'Crivo de Eratóstenes' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          <span className="header-logo-text">Atividade Prática - MD</span>
        </Link>

        <nav className="header-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`header-nav-link ${pathname === item.href ? 'header-nav-link-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
