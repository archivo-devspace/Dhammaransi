export const movies = [
  {
    id: 1,
    image: 'image1',
    name: 'သူငယ်ချင်းတစ်ယောက်အကြောင်း - မင်းလူ',
    desc: 'this is the first description of the movies',
  },
  {
    id: 2,
    image: 'image2',
    name: 'name2',
    desc: 'desc2',
  },
  {
    id: 3,
    image: 'image3',
    name: 'name3',
    desc: 'desc3',
  },
];

export const menus = [
  {
    id: 1,
    icon: 'music',
    name: 'MENUS.AUDIOS',
    link: 'AudioCategories',
  },
  {
    id: 2,
    icon: 'book',
    name: 'MENUS.EBOOKS',
    link: 'Pdf',
  },
  {
    id: 3,
    icon: 'film',
    name: 'MENUS.MOVIES',
    link: 'MovieLists',
  },
  {
    id: 4,
    icon: 'image',
    name: 'MENUS.PICTURES',
    link: 'Painting',
  },
];

export const images = [
  'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/6919947/pexels-photo-6919947.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1435075/pexels-photo-1435075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

export const BANNER_H = 320;
export const TOPNAVI_H = 55;

export const trackCategories = [
  {
    id: 1,
    name: 'Category',
    desc: 'Category description',
    artwork: 'https://www.bensound.com/bensound-img/happyrock.jpg',
  },
  {
    id: 2,
    name: 'Category2',
    desc: 'Category description2',
    artwork: 'https://www.bensound.com/bensound-img/punky.jpg',
  },
];

export const tracks = [
  {
    id: 1,
    url: 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3',
    title: 'Happy Rock',
    artist: 'Benjamin Tissot',
    album: "Bensound's rock",
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'https://www.bensound.com/bensound-img/happyrock.jpg', // Load artwork from the network
    categoryId: 1,
  },
  {
    id: 2,
    url: 'https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3',
    title: 'Punky',
    artist: 'Benjamin Tissot',
    album: "Bensound's rock",
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'https://www.bensound.com/bensound-img/punky.jpg',
    categoryId: 1,
  },
  {
    id: 3,
    url: 'https://www.bensound.com/bensound-music/bensound-actionable.mp3',
    title: 'Actionable',
    artist: 'Benjamin Tissot',
    album: "Bensound's rock",
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'https://www.bensound.com/bensound-img/actionable.jpg',
    categoryId: 1,
  },
  {
    id: 4,
    url: 'https://www.bensound.com/bensound-music/bensound-romantic.mp3',
    title: 'Romantic',
    artist: 'Benjamin Tissot',
    album: "Bensound's Jazz",
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'https://www.bensound.com/bensound-img/romantic.jpg',
    categoryId: 1,
  },
  {
    id: 5,
    url: 'https://www.bensound.com/bensound-music/bensound-allthat.mp3',
    title: 'All That',
    artist: 'Benjamin Tissot',
    album: "Bensound's Jazz",
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'https://www.bensound.com/bensound-img/allthat.jpg',
    categoryId: 1,
  },
  {
    id: 6,
    url: 'https://www.bensound.com/bensound-music/bensound-love.mp3',
    title: 'Love',
    artist: 'Benjamin Tissot',
    album: "Bensound's Jazz",
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'https://www.bensound.com/bensound-img/love.jpg',
    categoryId: 1,
  },
  {
    id: 7,
    url: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3',
    title: 'Dreams',
    artist: 'Benjamin Tissot',
    album: "Bensound's Electronica",
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'https://www.bensound.com/bensound-img/dreams.jpg',
    categoryId: 1,
  },
  {
    id: 8,
    url: 'https://www.bensound.com/bensound-music/bensound-dance.mp3',
    title: 'Dance',
    artist: 'Benjamin Tissot',
    album: "Bensound's Electronica",
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'https://www.bensound.com/bensound-img/dance.jpg',
    categoryId: 1,
  },
];

export const ebooks = [
  {
    id: 1,
    title: 'book1',
    image: 'https://www.bensound.com/bensound-img/happyrock.jpg',
  },
  {
    id: 2,
    title: 'book2',
    image: 'https://www.bensound.com/bensound-img/punky.jpg',
  },
  {
    id: 3,
    title: 'book1',
    image: 'https://www.bensound.com/bensound-img/dance.jpg',
  },
  {
    id: 4,
    title: 'book2',
    image: 'https://www.bensound.com/bensound-img/dreams.jpg',
  },
  {
    id: 5,
    title: 'book1',
    image: 'https://www.bensound.com/bensound-img/dance.jpg',
  },
  {
    id: 6,
    title: 'book2',
    image: 'https://www.bensound.com/bensound-img/dreams.jpg',
  },
  {
    id: 7,
    title: 'book1',
    image: 'https://www.bensound.com/bensound-img/dance.jpg',
  },
  {
    id: 8,
    title: 'book2',
    image: 'https://www.bensound.com/bensound-img/love.jpg',
  },
];

// utils/constants.js

export const youtubeVideos = [
  {
    id: 1,
    videoId: 'iee2TATGMyI',
    title: 'Introduction to React Native',
    description: 'An introductory video to React Native framework.',
  },
  {
    id: 2,
    videoId: 'OEV8gMkCHXQ',
    title: 'React Native Tutorial',
    description: 'A comprehensive tutorial on React Native development.',
  },
  {
    id: 3,
    videoId: 'w2ifba5_1qI',
    title: 'Advanced React Native',
    description: 'An advanced guide to building React Native applications.',
  },
  {
    id: 4,
    videoId: '0ckOUBiuxVY',
    title: 'React Conf 2024 Day 2',
    description: 'Learn how to design beautiful UIs with React Native.',
  },
  {
    id: 5,
    videoId: 'p3vaaD9pn9I',
    title: 'Networking For Hackers! (Common Network Protocols)',
    description: 'An overview of state management techniques in React Native.',
  },
];

export const singlePaintingDetils = {
  id: 1,
  title: 'ပန်းချီသုဝဏ္ဏသာမ',
  imageUrl:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDHzjQ7J9v3Jg1c_RYUzMoF5AQdzuM1IKfONp4NLMt8GOmLwO3qemtk8uZ0RIsZ9Dbu-0&usqp=CAU',
  video: {
    id: 1,
    videoId: 'p3vaaD9pn9I',
    title: 'ဗုဒ္ဓဝင်ပန်းချီကားအ‌ကြောင်းတရားတော်',
    description: 'An overview of state management techniques in React Native.',
  },
  music: {
    id: 1,
    url: 'https://www.bensound.com/bensound-music/bensound-dance.mp3',
    title: 'အသံတရားတော်',
    artist: 'Benjamin Tissot',
    album: "Bensound's Electronica",
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'https://www.bensound.com/bensound-img/dance.jpg',
    categoryId: 1,
  },
  desc: `Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Perspiciatis fuga, atque soluta exercitationem accusantium dolore
          autem maxime neque, sapiente, eligendi corrupti enim consequuntur
          suscipit. Perferendis recusandae officiis, impedit quam rem
          expedita? Eum mollitia maxime itaque illo odit, voluptatum, cum
          corporis excepturi quibusdam atque dolores inventore, veniam
          ducimus error ea soluta reiciendis cumque at magnam eligendi
          provident qui numquam debitis. Accusantium sunt dolor fugit
          quaerat, sed, repudiandae fuga eligendi esse incidunt placeat
          assumenda maiores necessitatibus. Quod perspiciatis fugit nam
          tempore incidunt id vero odit harum suscipit quaerat. Eligendi sed
          animi atque error, autem accusamus libero accusantium ab
          laboriosam, iure ullam ducimus, voluptatem temporibus. Quo,
          reiciendis. Maxime deserunt eaque enim ea vel deleniti reiciendis,
          ex recusandae eos sapiente et! Nostrum repudiandae vitae error
          sapiente minus, labore eligendi optio assumenda pariatur
          reiciendis corrupti non dicta magni alias reprehenderit dolore
          est. Quaerat non a aliquid cum, velit dolor deleniti doloribus
          excepturi labore nemo. Dolor, voluptatum deserunt, autem itaque
          nulla, fugiat vero sed vitae odit inventore mollitia
          necessitatibus saepe harum! Dolor fugiat ipsam necessitatibus eius
          tempora esse suscipit aliquam debitis magnam non, sapiente unde
          accusantium minus dicta modi voluptates. Maiores nesciunt
          voluptates impedit totam veritatis voluptate fugit, fuga quidem
          assumenda nemo rerum, eum ipsam quibusdam!`,
};
