import Palette from 'google-material-color';

export default {
  characters: [
    {
      id: '01',
      name: 'ありす',
      portrait: {
        default: { url: '/sample/p2a.png' },
      },
      icon: '/sample/i2.png',
      attributes: [
        '12/12',
        '6/6',
      ],
      initiative: 0,
      x: 2,
      y: 2,
      z: 0,
    },
    {
      id: '02',
      name: 'ぼぶ',
      portrait: {
        default: null,
      },
      icon: null,
      attributes: [
        '12/18',
        '2/2',
      ],
      initiative: 3,
      x: 0.5,
      y: 0.5,
      z: 0,
    },
    {
      id: '03',
      name: 'しゃーりー',
      portrait: {
        default: { url: '/sample/p1a.png' },
      },
      icon: '/sample/i1.png',
      attributes: [
        '6/12',
        '3/3',
      ],
      initiative: 1,
      x: 3.5,
      y: 3.5,
      z: 0,
    },
  ],
  shapes: [
    {
      id: '01',
      type: 'circle',
      x: 2,
      y: 2,
      radius: 1.5,
      fill: Palette.get('Red'),
      fillOpacity: 0.25,
      strokeWidth: 2,
      stroke: Palette.get('Red'),
    },
  ],
  map: {
    width: 10,
    height: 10,
    backgroundImage: 'https://raw.githubusercontent.com/torgtaitai/DodontoF/master/image/defaultImageSet/feeld001.gif',
  },
  messages: [
    {
      id: '01',
      color: Palette.get('Blue'),
      name: 'ありす',
      face: 'default',
      body: [
        {
          type: 'text',
          text: 'メッセージ01',
        },
      ],
      createdAt: Date.now() - (60 * 60 * 1000),
    },
    {
      id: '02',
      color: Palette.get('Pink'),
      name: 'ぼぶ',
      face: 'default',
      body: [
        {
          type: 'text',
          text: 'メッセージ02',
        },
      ],
      createdAt: Date.now() - (120 * 1000),
    },
    {
      id: '03',
      color: 'black',
      name: 'しゃーりー',
      face: 'default',
      body: [
        {
          type: 'text',
          text: 'メッセージ03',
        },
        {
          type: 'text',
          text: 'メッセージ04',
        },
        {
          type: 'text',
          text: 'メッセージ05',
        },
      ],
      createdAt: Date.now() - (60 * 1000),
    },
    {
      id: '04',
      color: 'black',
      name: 'しゃーりー',
      face: 'default',
      body: [
        {
          type: 'text',
          text: 'メッセージ03',
        },
        {
          type: 'text',
          text: 'メッセージ04',
        },
        {
          type: 'text',
          text: 'メッセージ05',
        },
      ],
      createdAt: Date.now() - (30 * 1000),
    },
    {
      id: '05',
      color: 'black',
      name: 'しゃーりー',
      face: 'default',
      body: [
        {
          type: 'text',
          text: 'メッセージ03',
        },
        {
          type: 'text',
          text: '2D6+3>=8',
        },
        {
          type: 'text',
          text: 'メッセージ05',
        },
        {
          type: 'dice',
          dice: 'SwordWorld2.0',
          text: '(2D6+3>=8) ＞ 12[6,6]+3 ＞ 15 ＞ 自動的成功',
        },
      ],
      createdAt: Date.now(),
    },
  ],
  rooms: [
    {
      id: '-room01',
      title: '卓01 (パスワード:pass)',
      dice: 'SwordWorld2_0',
      players: 3,
      visitors: 1,
      characterAttributes: ['HP', 'MP'],
      password: 'pass',
    },
    {
      id: '-room02',
      title: '卓02',
      dice: 'SwordWorld2_0',
      players: 3,
      visitors: 0,
      characterAttributes: ['HP', 'MP'],
    },
    {
      id: '-room03',
      title: '卓03',
      dice: 'Cthulhu7th',
      players: 3,
      visitors: 0,
      characterAttributes: [],
    },
  ],
};
