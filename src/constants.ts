import { ThemeColor, ChallengeInfo } from './types';

export const THEMES: ThemeColor[] = [
  {
    id: 'blue',
    name: 'Céu Azul',
    hex: '#E0F2FE',
    bgClass: 'bg-sky-100',
    contrastText: 'text-sky-950',
    cardBg: 'bg-white/90',
    accentColor: '#0284C7',
    description: 'Um tom suave que acalma os olhos e relaxa a mente.'
  },
  {
    id: 'mint',
    name: 'Verde Menta',
    hex: '#DCFCE7',
    bgClass: 'bg-emerald-100',
    contrastText: 'text-emerald-950',
    cardBg: 'bg-white/90',
    accentColor: '#059669',
    description: 'Fresco e acolhedor, trazendo sensação de bem-estar.'
  },
  {
    id: 'lavender',
    name: 'Lavanda Doce',
    hex: '#F3E8FF',
    bgClass: 'bg-purple-100',
    contrastText: 'text-purple-950',
    cardBg: 'bg-white/90',
    accentColor: '#9333EA',
    description: 'Delicado e elegante, com excelente contraste visual.'
  },
  {
    id: 'amber',
    name: 'Pôr do Sol',
    hex: '#FFEDD5',
    bgClass: 'bg-orange-100',
    contrastText: 'text-orange-950',
    cardBg: 'bg-white/90',
    accentColor: '#EA580C',
    description: 'Caloroso e acolhedor, lembrando o final da tarde.'
  },
  {
    id: 'rose',
    name: 'Rosa Floral',
    hex: '#FCE7F3',
    bgClass: 'bg-pink-100',
    contrastText: 'text-pink-950',
    cardBg: 'bg-white/90',
    accentColor: '#DB2777',
    description: 'Aconchegante e vivo, fácil de distinguir ao toque.'
  }
];

export const CHALLENGES: ChallengeInfo[] = [
  {
    id: 1,
    title: 'Deslizar para o Lado',
    subtitle: 'Desafio 1 de 5 · Toque em Movimento',
    instruction: 'Arraste seu dedo suavemente para o lado. Cada cartão tem uma cor especial que mudará todo o fundo do aplicativo!',
    shortDesc: 'Aprenda a deslizar a tela suavemente para a esquerda ou direita.',
    iconName: 'MoveHorizontal'
  },
  {
    id: 2,
    title: 'Carregar a Barra',
    subtitle: 'Desafio 2 de 5 · Pousar e Segurar',
    instruction: 'Pouse o dedo na área indicada e segure até a barra encher 100%. Ao chegar no topo, ela começará a esvaziar suavemente.',
    shortDesc: 'Aprenda quando manter o dedo na tela de forma calma e controlada.',
    iconName: 'BatteryCharging'
  },
  {
    id: 3,
    title: 'Estourar a Bolha',
    subtitle: 'Desafio 3 de 5 · O Toque Leve',
    instruction: 'Dê um toquezinho bem leve e rápido na bolha! Se você apertar com muita força ou segurar, ela tremerá e não estourará.',
    shortDesc: 'Aprenda o segredo do smartphone: toques rápidos e sem força.',
    iconName: 'CircleDot'
  },
  {
    id: 4,
    title: 'Estourar Várias Bolhas',
    subtitle: 'Desafio 4 de 5 · Agilidade Gentil',
    instruction: 'Estoure as bolhas de vários tamanhos com toques leves e rápidos. Lembre-se: não precisa apertar forte!',
    shortDesc: 'Treine a precisão e coordenação motora com múltiplos alvos.',
    iconName: 'Sparkles'
  },
  {
    id: 5,
    title: 'Espaço Integrado',
    subtitle: 'Desafio 5 de 5 · Parquinho de Prática',
    instruction: 'Aqui você tem todos os exercícios juntos! Mude cores, carregue a barra, estoure bolhas e veja a velocidade do seu toque.',
    shortDesc: 'Pratique todos os movimentos aprendidos em um só ambiente livre.',
    iconName: 'Layers'
  }
];
