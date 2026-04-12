import Link from 'next/link';
import { Calculator, Search, LibraryBig } from 'lucide-react';

const PROJETOS = [
  {
    href: '/conversao',
    icon: Calculator,
    titulo: 'Conversão de Bases',
    descricao: 'Converter entre Decimal, Binário e Hexadecimal com passo a passo. Realizar operações aritméticas em qualquer base.',
    tags: ['Decimal', 'Binário', 'Hexadecimal'],
    cor: '#6366f1',
  },
  {
    href: '/euclides',
    icon: LibraryBig,
    titulo: 'Algoritmo de Euclides',
    descricao: 'Calcule o MDC utilizando o algoritmo de Euclides e o algoritmo estendido.',
    tags: ['MDC', 'Euclides', 'Estendido'],
    cor: '#f59e0b',
  },
  {
    href: '/eratostenes',
    icon: Search,
    titulo: 'Crivo de Eratóstenes',
    descricao: 'Encontre todos os números primos até um determinado valor usando o algoritmo do Crivo de Eratóstenes.',
    tags: ['Primos', 'Crivo', 'Algoritmo'],
    cor: '#10b981',
  },
];

export default function Home() {
  return (
    <div className="home-container fade-in">
      <section className="home-hero">
        <div className="home-hero-badge">Matemática Discreta</div>
        <h1 className="home-hero-title">Atividade Prática</h1>
      </section>

      <section className="home-cards">
        {PROJETOS.map((projeto) => (
          <Link key={projeto.href} href={projeto.href} className="home-card" style={{ '--card-accent': projeto.cor } as React.CSSProperties}>
            <div className="home-card-icon-wrapper">
              <projeto.icon className="home-card-icon" />
            </div>
            <div className="home-card-content">
              <h2 className="home-card-title">{projeto.titulo}</h2>
              <p className="home-card-desc">{projeto.descricao}</p>
              <div className="home-card-tags">
                {projeto.tags.map((tag) => (
                  <span key={tag} className="home-card-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="home-card-arrow">→</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
