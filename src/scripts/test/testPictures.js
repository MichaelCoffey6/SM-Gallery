const async = async () => Uint8Array.fromBase64('UklGRvAAAABXRUJQVlA4TOQAAAAvl8BJEBLHkSQ5ig94i4nnCAbgQ8eInUN2HHMPRb8Ism3I5nPB85Ug2zY1ghoc6v2fgC7/EthQsGf/+05ldrm8QLPJJzTbyz/0MC7vEM297tC2QZ6CbZiPbMPzkIkyN8gz1rJ5BrYp3E/l8gSM8qv8772GefxtGp43NEQN62iIGqI284T4OnCXyQ8Eb5/ZFn+YBXmF4BEed4QL8oq7zLb8q5lv1MsnBFfzBsfbIMKCPOIw13OY+YXgMbzg8hH/Ovx5xIS7YD7B1Z1vjMsvsNI3jPPvtDzBf7wu++e/BXtKm8fOHwA=')

export const testPictures = {
  'pic1.png': {
    _data: {},
    dir: false,
    date: new Date(Date.now() + 100),
    name: 'pic1.png',
    async,
  },
  'folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic2.png': {
    _data: {},
    dir: false,
    date: new Date(new Date().setFullYear(2020)),
    name: 'folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic2.png',
    async,
  },
  'folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic3.jpg': {
    _data: {},
    dir: true,
    date: new Date(),
    name: 'folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic3.jpg',
    async,
  },
  'folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic4.jpg': {
    _data: {},
    dir: true,
    date: new Date('Sat Jan 09 2024'),
    name: 'folder1-suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuper/pic4.jpg',
    async,
  },
  'folder1/folder2/pic5.jpg': {
    _data: {},
    dir: true,
    date: new Date('Sat Jan 09 2024'),
    name: 'folder1/folder2/pic5.jpg',
    async,
  },
  'folder1/folder2/pic6.jpg': {
    _data: {},
    dir: true,
    date: new Date(),
    name: 'folder1/folder2/pic6.jpg',
    async,
  }
}