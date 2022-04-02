import Cursor from './images/cursor.png';
import React from 'react';
import { ComplexSentencePane } from './complex-sentence-pane';

const props = {
  units: {
    '1ec7ac24933d': {
      id: '1ec7ac24933d',
      wordID: '7a7ac24933d',
      branchIDs: ['3257ac24a2e8'],
      type: 'meishibunmatsu',
      word: {
        id: '7a7ac24933d',
        text: '',
        hinshi: 'meishibunmatsu',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FFD8B3',
      },
      branches: [
        {
          id: '3257ac24a2e8',
          unitId: '20d7ac24a2e8',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: '', kakariJoshi: '' },
          },
          border: '',
          unitType: 'meishiku',
          joshiLabels: ['', ''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: true,
        },
      ],
      isTaigendome: true,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '',
      color: 'inherit',
      hinshi: 'meishibunmatsu',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FFD8B3',
    },
    '20d7ac24a2e8': {
      id: '20d7ac24a2e8',
      wordID: '907ac24a2e7',
      branchIDs: ['3d87ac24cb94'],
      type: 'meishiku',
      word: {
        id: '907ac24a2e7',
        text: '火山噴火',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [
        {
          id: '3d87ac24cb94',
          unitId: '2087ac24cb94',
          joshi: { rentaiJoshi: 'の', renyouJoshi: null },
          border: '',
          unitType: 'plain',
          joshiLabels: ['の'],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '1ec7ac24933d',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '火山噴火',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    '2087ac24cb94': {
      id: '2087ac24cb94',
      wordID: '3157ac24cb94',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '3157ac24cb94',
        text: 'トンガ',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      isTaigendome: false,
      parentUnitId: '20d7ac24a2e8',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'の',
      text: 'トンガ',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
  },
  cursor:
    'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADw6FuzAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAACbElEQVRIDe2Uv2sTYRjHL5deb1PaQdriooMJiEMXhdIgdVEHh7qoaFH6B9QuJViTNL2kdujij1lQVMSpQ1vURZCK4OQggRQMDootLoJbPJLr5/vmLlwkdLFFkD7w3PM83/f7PO/zPvfeWda+/OsJJHZqoFgsDjSbzatwTqMngiAYEj+RSHzHfELf2rb9DN6W8G7SdQMSDjUajUUSJlCnW2IM8/GfJJPJW+T9iOHGtf8ECoXCWYpXwSfRgG5fYC/R/bFqtdrj+34/8Ul0IlwL8CeVo1z8DunYIJ/PX6PQGow+klfw057nXSauMIrFdDr91XGcCmtZsI9aE0dc5ShXNfDb0h5RLpc7A/EVKxrJ7VKpdEcsujpP4jKuqzgmdfjjbPJSGIVnMQuoD/9cuVx+I9ycIJvNHqTDx8Qq7kXFmekByA/BXIo9YM6DUvnCtCYOvhXmeLiOaqmm8B49XNedgXwYd50C88Ik3KAMRgXf0emUAVuPKU42TM5oyNFYLeXyLsbAM6oJlDMnADBzw96lo2arBm84CFKh/yHCYtZgMY6lXNUQB2tqmg3o8KlA7DQkg4XxhixyqmU6ngYjJ+JoA1s1xIpqmhHV6/UljnSdXTMccY51qcUs14k3wUcZyX1i8+IZy6wwKJviiCsJczMU/6aawvb8FrU30G7hHX6Em6SLFTq9yXX7An6ceJ6uR8TDf48/x82pcL2PcIp7xBdYaqA3wM3IDVePuOhrhPwcrA/9TbFl4lX8Db7iz7Va7VcqlToKPoxeZG2ctV70J/EVbttr/LZ0nCBCeVm79i/qukFso7/+m0a19u1/PIFttKFE8dctDTEAAAAASUVORK5CYII=), auto',
  sentences: {
    '3277ac248fb5': {
      id: '3277ac248fb5',
      text: 'トンガの火山噴火',
      topic: '',
      comments: ['1ec7ac24933d'],
      shuuJoshi: '',
      juntaiJoshi: '',
      buntouSeibuns: [],
      setsuzokuJoshis: {},
      juntaiJoshiBunmatsu: '',
      color: '#00A89D',
      buntouText: '',
      topicBranch: null,
      topicUnitId: '',
      isTaigendome: true,
      bunmatsuText: '',
      commentUnitIds: ['1ec7ac24933d'],
      bodyTexts: ['トンガの', '火山噴火', ''],
    },
  },
  sentenceTexts: { '3277ac248fb5': 'トンガの火山噴火' },
  branchUnitIds: {
    '1ec7ac24933d': ['20d7ac24a2e8'],
    '20d7ac24a2e8': ['2087ac24cb94'],
    '2087ac24cb94': [],
  },
  parentUnitIds: {
    '1ec7ac24933d': '',
    '20d7ac24a2e8': '1ec7ac24933d',
    '2087ac24cb94': '20d7ac24a2e8',
  },
  sentenceArrays: [['3277ac248fb5']],
  sentenceBodyTexts: { '3277ac248fb5': ['トンガの', '火山噴火', ''] },
  sentenceCommentUnitIds: { '3277ac248fb5': ['1ec7ac24933d'] },
};

const props2 = {
  units: {
    '38d7ac2b9d6e': {
      id: '38d7ac2b9d6e',
      wordID: '137ac2b9d6e',
      branchIDs: ['2e17ac2bb830'],
      type: 'plain',
      word: {
        id: '137ac2b9d6e',
        text: '思います',
        hinshi: 'doushi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#CCE5FA',
      },
      branches: [
        {
          id: '2e17ac2bb830',
          unitId: '31b7ac2bb830',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: 'と', kakariJoshi: '' },
          },
          border: '',
          unitType: 'plain',
          joshiLabels: ['と', ''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '思います',
      color: 'inherit',
      hinshi: 'doushi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#CCE5FA',
    },
    '31b7ac2bb830': {
      id: '31b7ac2bb830',
      wordID: '937ac2bb830',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '937ac2bb830',
        text: '海の近くに住んでいる人達はきっと慌てていたのだ',
        hinshi: 'sentence',
        color: 'white',
        border: 'none',

        fontWeight: 500,

        backgroundColor: '#00A89D',
      },
      branches: [],
      isTaigendome: false,
      parentUnitId: '38d7ac2b9d6e',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'と',
      text: '海の近くに住んでいる人達はきっと慌てていたのだ',
      color: 'white',
      hinshi: 'sentence',
      border: 'none',

      fontWeight: 500,
      backgroundColor: '#00A89D',
    },
    '9d7ac2bf0f9': {
      id: '9d7ac2bf0f9',
      wordID: '337ac2bf0f9',
      branchIDs: ['1bf7ac2c0550'],
      type: 'meishiku',
      word: {
        id: '337ac2bf0f9',
        text: '人達',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [
        {
          id: '1bf7ac2c0550',
          unitId: '2a37ac2c0550',
          joshi: { rentaiJoshi: '', renyouJoshi: null },
          border: '',
          unitType: 'plain',
          joshiLabels: [''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '897ac2bf0f9',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'は',
      text: '人達',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    '897ac2bf0f9': {
      id: '897ac2bf0f9',
      wordID: '',
      branchIDs: ['24b7ac2bf0f9'],
      type: 'meishiku',
      word: {
        text: '',
        color: '',
        hinshi: 'meishi',
        border: '',

        fontWeight: 0,

        backgroundColor: '',
      },
      branches: [
        {
          id: '24b7ac2bf0f9',
          unitId: '9d7ac2bf0f9',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: '', kakariJoshi: 'は' },
          },
          border: '',
          unitType: 'meishiku',
          joshiLabels: ['', 'は'],
          topicBorder: '2px solid #739433',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '',
      color: '',
      hinshi: 'meishi',
      border: '',

      fontWeight: 0,
      backgroundColor: '',
    },
    '2a37ac2c0550': {
      id: '2a37ac2c0550',
      wordID: '247ac2c0550',
      branchIDs: ['1b77ac2c11be'],
      type: 'plain',
      word: {
        id: '247ac2c0550',
        text: '住んでいる',
        hinshi: 'doushi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#CCE5FA',
      },
      branches: [
        {
          id: '1b77ac2c11be',
          unitId: '1d77ac2c11be',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: 'に', kakariJoshi: '' },
          },
          border: '',
          unitType: 'meishiku',
          joshiLabels: ['に', ''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '9d7ac2bf0f9',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '住んでいる',
      color: 'inherit',
      hinshi: 'doushi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#CCE5FA',
    },
    '1d77ac2c11be': {
      id: '1d77ac2c11be',
      wordID: '1057ac2c11be',
      branchIDs: ['2c7ac2c1957'],
      type: 'meishiku',
      word: {
        id: '1057ac2c11be',
        text: '近く',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [
        {
          id: '2c7ac2c1957',
          unitId: '2f27ac2c1957',
          joshi: { rentaiJoshi: 'の', renyouJoshi: null },
          border: '',
          unitType: 'plain',
          joshiLabels: ['の'],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '2a37ac2c0550',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'に',
      text: '近く',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    '2f27ac2c1957': {
      id: '2f27ac2c1957',
      wordID: '1327ac2c1957',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '1327ac2c1957',
        text: '海',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      isTaigendome: false,
      parentUnitId: '1d77ac2c11be',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'の',
      text: '海',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    f77ac2ca306: {
      id: 'f77ac2ca306',
      wordID: '1da7ac2ca306',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '1da7ac2ca306',
        text: '',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      isTaigendome: false,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    '1207ac2ca306': {
      id: '1207ac2ca306',
      wordID: '10c7ac2ca306',
      branchIDs: ['1d07ac2d321d'],
      type: 'plain',
      word: {
        id: '10c7ac2ca306',
        text: '慌てていた',
        hinshi: 'doushi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#CCE5FA',
      },
      branches: [
        {
          id: '1d07ac2d321d',
          unitId: '2867ac2d321d',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: '', kakariJoshi: '' },
          },
          border: '',
          unitType: 'plain',
          joshiLabels: ['', ''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '慌てていた',
      color: 'inherit',
      hinshi: 'doushi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#CCE5FA',
    },
    '2867ac2d321d': {
      id: '2867ac2d321d',
      wordID: 'dc7ac2d321d',
      branchIDs: [],
      type: 'plain',
      word: {
        id: 'dc7ac2d321d',
        text: 'きっと',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      isTaigendome: false,
      parentUnitId: '1207ac2ca306',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: 'きっと',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
  },
  cursor:
    'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADw6FuzAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAACbElEQVRIDe2Uv2sTYRjHL5deb1PaQdriooMJiEMXhdIgdVEHh7qoaFH6B9QuJViTNL2kdujij1lQVMSpQ1vURZCK4OQggRQMDootLoJbPJLr5/vmLlwkdLFFkD7w3PM83/f7PO/zPvfeWda+/OsJJHZqoFgsDjSbzatwTqMngiAYEj+RSHzHfELf2rb9DN6W8G7SdQMSDjUajUUSJlCnW2IM8/GfJJPJW+T9iOHGtf8ECoXCWYpXwSfRgG5fYC/R/bFqtdrj+34/8Ul0IlwL8CeVo1z8DunYIJ/PX6PQGow+klfw057nXSauMIrFdDr91XGcCmtZsI9aE0dc5ShXNfDb0h5RLpc7A/EVKxrJ7VKpdEcsujpP4jKuqzgmdfjjbPJSGIVnMQuoD/9cuVx+I9ycIJvNHqTDx8Qq7kXFmekByA/BXIo9YM6DUvnCtCYOvhXmeLiOaqmm8B49XNedgXwYd50C88Ik3KAMRgXf0emUAVuPKU42TM5oyNFYLeXyLsbAM6oJlDMnADBzw96lo2arBm84CFKh/yHCYtZgMY6lXNUQB2tqmg3o8KlA7DQkg4XxhixyqmU6ngYjJ+JoA1s1xIpqmhHV6/UljnSdXTMccY51qcUs14k3wUcZyX1i8+IZy6wwKJviiCsJczMU/6aawvb8FrU30G7hHX6Em6SLFTq9yXX7An6ceJ6uR8TDf48/x82pcL2PcIp7xBdYaqA3wM3IDVePuOhrhPwcrA/9TbFl4lX8Db7iz7Va7VcqlToKPoxeZG2ctV70J/EVbttr/LZ0nCBCeVm79i/qukFso7/+m0a19u1/PIFttKFE8dctDTEAAAAASUVORK5CYII=), auto',
  sentences: {
    '3af7ac2b7727': {
      id: '3af7ac2b7727',
      text: '海の近くに住んでいる人達はきっと慌てていたのだと思います。',
      topic: '',
      comments: ['38d7ac2b9d6e'],
      shuuJoshi: '',
      juntaiJoshi: '',
      buntouSeibuns: [],
      setsuzokuJoshis: {},
      juntaiJoshiBunmatsu: '',
      color: '#00A89D',
      buntouText: '',
      topicBranch: null,
      topicUnitId: '',
      isTaigendome: false,
      bunmatsuText: '',
      commentUnitIds: ['38d7ac2b9d6e'],
      bodyTexts: [
        '海の近くに住んでいる人達はきっと慌てていたのだと',
        '思います。',
      ],
    },
    '30e7ac2bd5bf': {
      id: '30e7ac2bd5bf',
      text: '海の近くに住んでいる人達はきっと慌てていたのだ',
      topic: '897ac2bf0f9',
      comments: ['1207ac2ca306'],
      shuuJoshi: '',
      juntaiJoshi: 'の',
      buntouSeibuns: [],
      setsuzokuJoshis: {},
      juntaiJoshiBunmatsu: 'だ',
      color: '#739433',
      buntouText: '',
      topicBranch: {
        id: '24b7ac2bf0f9',
        unitId: '9d7ac2bf0f9',
        joshi: {
          rentaiJoshi: null,
          renyouJoshi: { kakuJoshi: '', kakariJoshi: 'は' },
        },
        border: '',
        unitType: 'meishiku',
        joshiLabels: ['', 'は'],
        topicBorder: '2px solid #739433',
        isDraggable: false,
        isCommentMeishi: false,
      },
      topicUnitId: '897ac2bf0f9',
      isTaigendome: false,
      bunmatsuText: 'のだ',
      commentUnitIds: ['1207ac2ca306'],
      bodyTexts: [
        '海の',
        '近くに',
        '住んでいる',
        '人達は',
        '',
        'きっと',
        '慌てていた',
      ],
    },
  },
  sentenceTexts: {
    '3af7ac2b7727':
      '海の近くに住んでいる人達はきっと慌てていたのだと思います。',
    '30e7ac2bd5bf': '海の近くに住んでいる人達はきっと慌てていたのだ',
  },
  branchUnitIds: {
    '38d7ac2b9d6e': ['31b7ac2bb830'],
    '31b7ac2bb830': [],
    '9d7ac2bf0f9': ['2a37ac2c0550'],
    '897ac2bf0f9': ['9d7ac2bf0f9'],
    '2a37ac2c0550': ['1d77ac2c11be'],
    '1d77ac2c11be': ['2f27ac2c1957'],
    '2f27ac2c1957': [],
    f77ac2ca306: [],
    '1207ac2ca306': ['2867ac2d321d'],
    '2867ac2d321d': [],
  },
  parentUnitIds: {
    '38d7ac2b9d6e': '',
    '31b7ac2bb830': '38d7ac2b9d6e',
    '9d7ac2bf0f9': '897ac2bf0f9',
    '897ac2bf0f9': '',
    '2a37ac2c0550': '9d7ac2bf0f9',
    '1d77ac2c11be': '2a37ac2c0550',
    '2f27ac2c1957': '1d77ac2c11be',
    f77ac2ca306: '',
    '1207ac2ca306': '',
    '2867ac2d321d': '1207ac2ca306',
  },
  sentenceArrays: [['3af7ac2b7727'], ['30e7ac2bd5bf']],
  // sentenceBodyTexts: {
  //   '3af7ac2b7727': [
  //     '海の近くに住んでいる人達はきっと慌てていたのだと',
  //     '思います。',
  //   ],
  //   '30e7ac2bd5bf': [
  //     '海の',
  //     '近くに',
  //     '住んでいる',
  //     '人達は',
  //     '',
  //     'きっと',
  //     '慌てていた',
  //   ],
  // },
  sentenceCommentUnitIds: {
    '3af7ac2b7727': ['38d7ac2b9d6e'],
    '30e7ac2bd5bf': ['1207ac2ca306'],
  },
};

const props3 = {
  units: {
    '32e7ac2a11ab': {
      id: '32e7ac2a11ab',
      wordID: '38c7ac2a11ab',
      branchIDs: ['2507ac2a1cfc'],
      type: 'plain',
      word: {
        id: '38c7ac2a11ab',
        text: '見ました',
        hinshi: 'doushi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#CCE5FA',
      },
      branches: [
        {
          id: '2507ac2a1cfc',
          unitId: '14b7ac2a1cfc',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: '', kakariJoshi: 'も' },
          },
          border: '',
          unitType: 'meishiku',
          joshiLabels: ['', 'も'],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '見ました',
      color: 'inherit',
      hinshi: 'doushi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#CCE5FA',
    },
    '14b7ac2a1cfc': {
      id: '14b7ac2a1cfc',
      wordID: '2087ac2a1cfc',
      branchIDs: ['1637ac2a31ed'],
      type: 'meishiku',
      word: {
        id: '2087ac2a1cfc',
        text: 'ニュース',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [
        {
          id: '1637ac2a31ed',
          unitId: '1a7ac2a31ed',
          joshi: { rentaiJoshi: '', renyouJoshi: null },
          border: '',
          unitType: 'plain',
          joshiLabels: [''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '32e7ac2a11ab',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'も',
      text: 'ニュース',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    '1a7ac2a31ed': {
      id: '1a7ac2a31ed',
      wordID: 'b7ac2a31ed',
      branchIDs: ['467ac2a4c4a'],
      type: 'plain',
      word: {
        id: 'b7ac2a31ed',
        text: '渋滞している',
        hinshi: 'doushi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#CCE5FA',
      },
      branches: [
        {
          id: '467ac2a4c4a',
          unitId: '967ac2a4c4a',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: '', kakariJoshi: '' },
          },
          border: '',
          unitType: 'plain',
          joshiLabels: ['', ''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '14b7ac2a1cfc',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '渋滞している',
      color: 'inherit',
      hinshi: 'doushi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#CCE5FA',
    },
    '967ac2a4c4a': {
      id: '967ac2a4c4a',
      wordID: '35b7ac2a4c4a',
      branchIDs: [
        '30b7ac2b1ff9',
        '3217ac2afd8e',
        '34d7ac2add68',
        '34c7ac2a97a0',
        '3ab7ac2ac60e',
      ],
      type: 'plain',
      word: {
        id: '35b7ac2a4c4a',
        text: '向かって',
        hinshi: 'doushi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#CCE5FA',
      },
      branches: [
        {
          id: '30b7ac2b1ff9',
          unitId: '1617ac2b1ff9',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: 'に', kakariJoshi: '' },
          },
          border: '1px solid #eee',
          unitType: 'plain',
          joshiLabels: ['に', ''],
          topicBorder: '',
          isDraggable: true,
          isCommentMeishi: false,
        },
        {
          id: '3217ac2afd8e',
          unitId: '12f7ac2afd8e',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: 'が', kakariJoshi: '' },
          },
          border: '1px solid #eee',
          unitType: 'meishiku',
          joshiLabels: ['が', ''],
          topicBorder: '',
          isDraggable: true,
          isCommentMeishi: false,
        },
        {
          id: '34d7ac2add68',
          unitId: '3827ac2add68',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: 'で', kakariJoshi: '' },
          },
          border: '1px solid #eee',
          unitType: 'plain',
          joshiLabels: ['で', ''],
          topicBorder: '',
          isDraggable: true,
          isCommentMeishi: false,
        },
        {
          id: '34c7ac2a97a0',
          unitId: '29c7ac2a97a0',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: 'に', kakariJoshi: '' },
          },
          border: '1px solid #eee',
          unitType: 'meishiku',
          joshiLabels: ['に', ''],
          topicBorder: '',
          isDraggable: true,
          isCommentMeishi: false,
        },
        {
          id: '3ab7ac2ac60e',
          unitId: '1057ac2ac60e',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: 'に', kakariJoshi: '' },
          },
          border: '1px solid #eee',
          unitType: 'plain',
          joshiLabels: ['に', ''],
          topicBorder: '',
          isDraggable: true,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '1a7ac2a31ed',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '向かって',
      color: 'inherit',
      hinshi: 'doushi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#CCE5FA',
    },
    '29c7ac2a97a0': {
      id: '29c7ac2a97a0',
      wordID: '2f87ac2a97a0',
      branchIDs: ['3867ac2aad8a'],
      type: 'meishiku',
      word: {
        id: '2f87ac2a97a0',
        text: 'ところ',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [
        {
          id: '3867ac2aad8a',
          unitId: '2e27ac2aad8a',
          joshi: { rentaiJoshi: '', renyouJoshi: null },
          border: '',
          unitType: 'plain',
          joshiLabels: [''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '967ac2a4c4a',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'に',
      text: 'ところ',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    '2e27ac2aad8a': {
      id: '2e27ac2aad8a',
      wordID: '3b97ac2aad8a',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '3b97ac2aad8a',
        text: '高い',
        hinshi: 'ikeiyoushi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#D8F077',
      },
      branches: [],
      isTaigendome: false,
      parentUnitId: '29c7ac2a97a0',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
      text: '高い',
      color: 'inherit',
      hinshi: 'ikeiyoushi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#D8F077',
    },
    '1057ac2ac60e': {
      id: '1057ac2ac60e',
      wordID: '197ac2ac60e',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '197ac2ac60e',
        text: '避難',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      isTaigendome: false,
      parentUnitId: '967ac2a4c4a',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'に',
      text: '避難',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    '3827ac2add68': {
      id: '3827ac2add68',
      wordID: '2a37ac2add68',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '2a37ac2add68',
        text: '車',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      isTaigendome: false,
      parentUnitId: '967ac2a4c4a',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'で',
      text: '車',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    '12f7ac2afd8e': {
      id: '12f7ac2afd8e',
      wordID: '2567ac2afd8e',
      branchIDs: ['3317ac2b06d4'],
      type: 'meishiku',
      word: {
        id: '2567ac2afd8e',
        text: '人',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [
        {
          id: '3317ac2b06d4',
          unitId: '3a27ac2b06d4',
          joshi: { rentaiJoshi: 'の', renyouJoshi: null },
          border: '',
          unitType: 'plain',
          joshiLabels: ['の'],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      isTaigendome: false,
      parentUnitId: '967ac2a4c4a',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'が',
      text: '人',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    '3a27ac2b06d4': {
      id: '3a27ac2b06d4',
      wordID: '36f7ac2b06d4',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '36f7ac2b06d4',
        text: '大勢',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        fontWeight: 400,

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      isTaigendome: false,
      parentUnitId: '12f7ac2afd8e',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'の',
      text: '大勢',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',

      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
    '1617ac2b1ff9': {
      id: '1617ac2b1ff9',
      wordID: '3317ac2b1ff9',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '3317ac2b1ff9',
        text: '夜中',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',
        fontWeight: 400,
        backgroundColor: '#FCE5E5',
      },
      branches: [],
      isTaigendome: false,
      parentUnitId: '967ac2a4c4a',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'に',
      text: '夜中',
      color: 'inherit',
      hinshi: 'meishi',
      border: 'none',
      fontWeight: 400,
      backgroundColor: '#FCE5E5',
    },
  },
  cursor:
    'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADw6FuzAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAACbElEQVRIDe2Uv2sTYRjHL5deb1PaQdriooMJiEMXhdIgdVEHh7qoaFH6B9QuJViTNL2kdujij1lQVMSpQ1vURZCK4OQggRQMDootLoJbPJLr5/vmLlwkdLFFkD7w3PM83/f7PO/zPvfeWda+/OsJJHZqoFgsDjSbzatwTqMngiAYEj+RSHzHfELf2rb9DN6W8G7SdQMSDjUajUUSJlCnW2IM8/GfJJPJW+T9iOHGtf8ECoXCWYpXwSfRgG5fYC/R/bFqtdrj+34/8Ul0IlwL8CeVo1z8DunYIJ/PX6PQGow+klfw057nXSauMIrFdDr91XGcCmtZsI9aE0dc5ShXNfDb0h5RLpc7A/EVKxrJ7VKpdEcsujpP4jKuqzgmdfjjbPJSGIVnMQuoD/9cuVx+I9ycIJvNHqTDx8Qq7kXFmekByA/BXIo9YM6DUvnCtCYOvhXmeLiOaqmm8B49XNedgXwYd50C88Ik3KAMRgXf0emUAVuPKU42TM5oyNFYLeXyLsbAM6oJlDMnADBzw96lo2arBm84CFKh/yHCYtZgMY6lXNUQB2tqmg3o8KlA7DQkg4XxhixyqmU6ngYjJ+JoA1s1xIpqmhHV6/UljnSdXTMccY51qcUs14k3wUcZyX1i8+IZy6wwKJviiCsJczMU/6aawvb8FrU30G7hHX6Em6SLFTq9yXX7An6ceJ6uR8TDf48/x82pcL2PcIp7xBdYaqA3wM3IDVePuOhrhPwcrA/9TbFl4lX8Db7iz7Va7VcqlToKPoxeZG2ctV70J/EVbttr/LZ0nCBCeVm79i/qukFso7/+m0a19u1/PIFttKFE8dctDTEAAAAASUVORK5CYII=), auto',
  sentences: {
    '2297ac2a0cae': {
      id: '2297ac2a0cae',
      topic: '',
      comments: ['32e7ac2a11ab'],
      shuuJoshi: '',
      juntaiJoshi: '',
      buntouSeibuns: [],
      setsuzokuJoshis: {},
      juntaiJoshiBunmatsu: '',
      color: '#00A89D',
      buntouText: '',
      topicBranch: null,
      topicUnitId: '',
      isTaigendome: false,
      bunmatsuText: '',
      commentUnitIds: ['32e7ac2a11ab'],
      bodyTexts: [
        '夜中に',
        '大勢の',
        '人が',
        '車で',
        '高い',
        'ところに',
        '避難に',
        '向かって',
        '渋滞している',
        'ニュースも',
        '見ました。',
      ],
      text: '夜中に大勢の人が車で高いところに避難に向かって渋滞しているニュースも見ました。',
    },
  },
  sentenceTexts: {
    '2297ac2a0cae':
      '夜中に大勢の人が車で高いところに避難に向かって渋滞しているニュースも見ました。',
  },
  branchUnitIds: {
    '32e7ac2a11ab': ['14b7ac2a1cfc'],
    '14b7ac2a1cfc': ['1a7ac2a31ed'],
    '1a7ac2a31ed': ['967ac2a4c4a'],
    '967ac2a4c4a': [
      '1617ac2b1ff9',
      '12f7ac2afd8e',
      '3827ac2add68',
      '29c7ac2a97a0',
      '1057ac2ac60e',
    ],
    '29c7ac2a97a0': ['2e27ac2aad8a'],
    '2e27ac2aad8a': [],
    '1057ac2ac60e': [],
    '3827ac2add68': [],
    '12f7ac2afd8e': ['3a27ac2b06d4'],
    '3a27ac2b06d4': [],
    '1617ac2b1ff9': [],
  },
  parentUnitIds: {
    '32e7ac2a11ab': '',
    '14b7ac2a1cfc': '32e7ac2a11ab',
    '1a7ac2a31ed': '14b7ac2a1cfc',
    '967ac2a4c4a': '1a7ac2a31ed',
    '29c7ac2a97a0': '967ac2a4c4a',
    '2e27ac2aad8a': '29c7ac2a97a0',
    '1057ac2ac60e': '967ac2a4c4a',
    '3827ac2add68': '967ac2a4c4a',
    '12f7ac2afd8e': '967ac2a4c4a',
    '3a27ac2b06d4': '12f7ac2afd8e',
    '1617ac2b1ff9': '967ac2a4c4a',
  },
  sentenceArrays: [['2297ac2a0cae']],
  sentenceCommentUnitIds: { '2297ac2a0cae': ['32e7ac2a11ab'] },
};

export const Basic = () => <ComplexSentencePane {...props} Cursor={Cursor} />;

export const Draggable = () => (
  <ComplexSentencePane {...props3} Cursor={Cursor} />
);

export const HasSubSentence = () => (
  <ComplexSentencePane {...props2} Cursor={Cursor} />
);