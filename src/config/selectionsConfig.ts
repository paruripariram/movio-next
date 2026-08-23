export interface SelectionConfig {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  isFeatured: boolean;
  coverBg: string;
  backdropUrl: string;
  movieIds: string[];
}

export const FEATURED_SELECTIONS: SelectionConfig[] = [
  {
    id: 'mindfucks',
    slug: 'mind-bending-movies',
    title: 'Игры разума',
    subtitle: 'Фильмы с непредсказуемым финалом',
    description: 'Психологические триллеры и детективы, которые заставят усомниться в реальности.',
    isFeatured: true,
    coverBg: 'from-purple-900/60 to-indigo-950/80',
    backdropUrl: '/selections/mindfucks.webp',
    movieIds: ['11324', '27205', '157336', '1124', '77', '550', '807', '210577'],
  },
  {
    id: 'neon-cyberpunk',
    slug: 'neon-and-cyberpunk',
    title: 'Неон и Киберпанк',
    subtitle: 'Мрачное будущее в ярких тонах',
    description: 'Синтвейв, искусственный интеллект и эстетика ночных мегаполисов.',
    isFeatured: true,
    coverBg: 'from-pink-900/60 to-purple-950/80',
    backdropUrl: '/selections/neon-cyberpunk.webp',
    movieIds: ['335984', '603', '9362', '500664', '20526', '149', '18'],
  },
  {
    id: 'after-work-chill',
    slug: 'turn-off-your-brain',
    title: 'Идеально под пиццу',
    subtitle: 'Максимум экшена, минимум философии',
    description: 'Драйвовые боевики, легкие комедии и приключения для расслабления.',
    isFeatured: true,
    coverBg: 'from-amber-900/60 to-orange-950/80',
    backdropUrl: '/selections/after-work-chill.webp',
    movieIds: ['293660', '118340', '207703', '137113', '80698', '51497', '429617'],
  },
  {
    id: 'one-location',
    slug: 'one-location-thrillers',
    title: 'В замкнутом пространстве',
    subtitle: 'Камерные триллеры и драмы',
    description: 'Фильмы, где всё действие разворачивается в одной локации.',
    isFeatured: true,
    coverBg: 'from-red-950/60 to-zinc-950/80',
    backdropUrl: '/selections/one-location.webp',
    movieIds: ['273248', '389', '11375', '4528', '176', '500', '29917'],
  },
  {
    id: 'post-apocalypse',
    slug: 'post-apocalypse-and-survival',
    title: 'Мир после катастрофы',
    subtitle: 'Выживание на обломках цивилизации',
    description: 'Пустоши, зомби-апокалипсис и истории выживания человечества.',
    isFeatured: true,
    coverBg: 'from-yellow-950/60 to-stone-950/80',
    backdropUrl: '/selections/post-apocalypse.webp',
    movieIds: ['76341', '20766', '6479', '75612', '28580', '447332'],
  },
  {
    id: 'visual-masterpieces',
    slug: 'visual-spectacle',
    title: 'Визуальный восторг',
    subtitle: 'Эстетика в каждом кадре',
    description: 'Операторские шедевры, масштабные декорации и идеальная цветокоррекция.',
    isFeatured: true,
    coverBg: 'from-cyan-950/60 to-slate-950/80',
    backdropUrl: '/selections/visual-masterpieces.webp',
    movieIds: ['438631', '335984', '64682', '120467', '19995'],
  },
  {
    id: 'mafia-crime',
    slug: 'mafia-and-crime',
    title: 'Криминальные империи',
    subtitle: 'Гангстеры, ограбления и мафия',
    description: 'Классика криминального кино о деньгах, власти и предательстве.',
    isFeatured: false,
    coverBg: 'from-stone-900/60 to-zinc-950/80',
    backdropUrl: '/selections/mafia-crime.webp',
    movieIds: ['238', '680', '769', '524', '111', '398978'],
  },
  {
    id: 'cozy-rainy-day',
    slug: 'rainy-day-vibes',
    title: 'Дождливые вечера',
    subtitle: 'Идеальное кино для плохой погоды',
    description: 'Уютные инди-драмы и атмосферные мелодрамы.',
    isFeatured: false,
    coverBg: 'from-blue-900/60 to-slate-950/80',
    backdropUrl: '/selections/cozy-rainy-day.webp',
    movieIds: ['153', '152601', '38', '194', '19913', '313369'],
  },
  {
    id: 'anime-masterpieces',
    slug: 'anime-cults',
    title: 'Анимационные шедевры',
    subtitle: 'Глубокие истории и волшебные миры',
    description: 'Легендарные работы Миядзаки и культовые аниме-полнометражки.',
    isFeatured: false,
    coverBg: 'from-teal-900/60 to-slate-950/80',
    backdropUrl: '/selections/anime-masterpieces.webp',
    movieIds: ['129', '372058', '4935', '149', '378064'],
  },
  {
    id: 'smart-horror',
    slug: 'smart-horrors',
    title: 'Умный хоррор',
    subtitle: 'Пугает без скримеров',
    description: 'Психологические фильмы ужасов с давящей атмосферой.',
    isFeatured: false,
    coverBg: 'from-emerald-950/60 to-black/80',
    backdropUrl: '/selections/smart-horror.webp',
    movieIds: ['419430', '493922', '530385', '447332', '310131', '242224'],
  },
];