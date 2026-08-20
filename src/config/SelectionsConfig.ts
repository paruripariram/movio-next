// Тип твоих параметров поиска/фильтрации
export interface SellectionSearchParams {
  query: string;
    type?: "movie" | "tv";
    withGenres?: string;
    withoutGenres?: string;
    releaseDateGte?: string;
    releaseDateLte?: string;
    voteAverageGte?: string;
    voteAverageLte?: string;
    sortBy?: string;
    page?: number;
}

export interface SellectionConfig {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  badge?: string;
  isFeatured: boolean;
  coverBg: string;
  params: SellectionSearchParams;
}

export const FEATURED_SELECTIONS: SellectionConfig[] = [
  {
    id: 'mindfucks',
    slug: 'mind-bending-movies',
    title: 'Сюжетный взрыв мозга',
    subtitle: 'Фильмы, после которых сидишь в тишине на титрах',
    description: 'Детективы, психологические триллеры и фантастика с закрученным сюжетом и непредсказуемой развязкой.',
    emoji: '🧠',
    badge: 'Must Watch',
    isFeatured: true,
    coverBg: 'from-purple-900/60 to-indigo-950/80',
    params: {
      query: '',
      type: 'movie',
      withGenres: '9648,53,878', // Mystery, Thriller, Sci-Fi
      voteAverageGte: '7.5',
      sortBy: 'vote_count.desc',
      page: 1,
    },
  },
  {
    id: 'neon-cyberpunk',
    slug: 'neon-and-cyberpunk',
    title: 'Мрачное будущее и выживание',
    subtitle: 'Синтвейв, ночной город, дождь и искусственный интеллект',
    description: 'Самые стильные и атмосферные фильмы с невероятной визуалкой и эстетикой будущего.',
    emoji: '🌆',
    badge: 'Эстетика',
    isFeatured: true,
    coverBg: 'from-pink-900/60 to-purple-950/80',
    params: {
      query: '',
      type: 'movie',
      withGenres: '878,53',
      voteAverageGte: '7.0',
      sortBy: 'popularity.desc',
      page: 1,
    },
  },
  {
    id: 'after-work-chill',
    slug: 'turn-off-your-brain',
    title: 'Идеально под пиццу',
    subtitle: 'Легкое, динамичное и драйвовое кино без лишней философии',
    description: 'Боевики, легкие комедии и приключения, чтобы просто расслабиться вечером с едой.',
    emoji: '🍕',
    isFeatured: true,
    coverBg: 'from-amber-900/60 to-orange-950/80',
    params: {
      query: '',
      type: 'movie',
      withGenres: '28,35,12', // Action, Comedy, Adventure
      voteAverageGte: '6.5',
      sortBy: 'popularity.desc',
      page: 1,
    },
  },
  {
    id: 'one-location',
    slug: 'one-location-thrillers',
    title: 'На грани нервного срыва',
    subtitle: 'Минимализм, камерные триллеры и бешеный саспенс',
    description: 'Фильмы, действие которых происходит в одном помещении, но от экрана невозможно оторваться.',
    emoji: '🚪',
    badge: 'Камерные',
    isFeatured: true,
    coverBg: 'from-red-950/60 to-zinc-950/80',
    params: {
      query: '',
      type: 'movie',
      withGenres: '53,18', // Thriller, Drama
      voteAverageGte: '7.2',
      sortBy: 'vote_count.desc',
      page: 1,
    },
  },
  {
    id: 'cozy-rainy-day',
    slug: 'rainy-day-vibes',
    title: 'Уютный дождливый вечер',
    subtitle: 'Теплое, душевное и немного грустное кино',
    description: 'Инди-драмы, атмосферные мелодрамы и фильмы о жизни, которые согревают.',
    emoji: '☕',
    isFeatured: true,
    coverBg: 'from-blue-900/60 to-slate-950/80',
    params: {
      query: '',
      type: 'movie',
      withGenres: '18,10749', // Drama, Romance
      voteAverageGte: '7.4',
      sortBy: 'popularity.desc',
      page: 1,
    },
  },

  //

  {
    id: 'smart-horror',
    slug: 'smart-horrors',
    title: 'Пощекотать нервы',
    subtitle: 'Умные хорроры и тревожные психологические драмы',
    description: 'Фильмы ужасов, которые пугают атмосферой, смыслом и безысходностью, а не громкими звуками.',
    emoji: '🕯️',
    isFeatured: false,
    coverBg: 'from-emerald-950/60 to-black/80',
    params: {
      query: '',
      type: 'movie',
      withGenres: '27,53', // Horror, Thriller
      voteAverageGte: '6.8',
      sortBy: 'vote_count.desc',
      page: 1,
    },
  },
  {
    id: 'visual-masterpieces',
    slug: 'visual-perfection',
    title: 'Абсолютные шедевры',
    subtitle: 'Шедевры операторской работы и цвета',
    description: 'Фильмы с потрясающей визуалкой, где каждый кадр — как картина.',
    emoji: '🎨',
    badge: '4K Vibes',
    isFeatured: false,
    coverBg: 'from-cyan-900/60 to-slate-950/80',
    params: {
      query: '',
      type: 'movie',
      voteAverageGte: '7.8',
      sortBy: 'vote_count.desc',
      page: 1,
    },
  },
  {
    id: 'black-humor',
    slug: 'dark-comedy',
    title: 'Комедии с черным юмором',
    subtitle: 'Цинично, смело и за гранью фола',
    description: 'Качественные черные комедии и сатира для тех, кто любит юмор поострее.',
    emoji: '🖤',
    isFeatured: false,
    coverBg: 'from-stone-900/60 to-neutral-950/80',
    params: {
      query: '',
      type: 'movie',
      withGenres: '35,80', // Comedy, Crime
      voteAverageGte: '7.0',
      sortBy: 'popularity.desc',
      page: 1,
    },
  },
];