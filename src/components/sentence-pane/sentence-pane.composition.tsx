import Cursor from './images/cursor.png';
import React from 'react';
import { SentencePane } from './sentence-pane';

const props = {
  cursor:
    'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADw6FuzAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAACbElEQVRIDe2Uv2sTYRjHL5deb1PaQdriooMJiEMXhdIgdVEHh7qoaFH6B9QuJViTNL2kdujij1lQVMSpQ1vURZCK4OQggRQMDootLoJbPJLr5/vmLlwkdLFFkD7w3PM83/f7PO/zPvfeWda+/OsJJHZqoFgsDjSbzatwTqMngiAYEj+RSHzHfELf2rb9DN6W8G7SdQMSDjUajUUSJlCnW2IM8/GfJJPJW+T9iOHGtf8ECoXCWYpXwSfRgG5fYC/R/bFqtdrj+34/8Ul0IlwL8CeVo1z8DunYIJ/PX6PQGow+klfw057nXSauMIrFdDr91XGcCmtZsI9aE0dc5ShXNfDb0h5RLpc7A/EVKxrJ7VKpdEcsujpP4jKuqzgmdfjjbPJSGIVnMQuoD/9cuVx+I9ycIJvNHqTDx8Qq7kXFmekByA/BXIo9YM6DUvnCtCYOvhXmeLiOaqmm8B49XNedgXwYd50C88Ik3KAMRgXf0emUAVuPKU42TM5oyNFYLeXyLsbAM6oJlDMnADBzw96lo2arBm84CFKh/yHCYtZgMY6lXNUQB2tqmg3o8KlA7DQkg4XxhixyqmU6ngYjJ+JoA1s1xIpqmhHV6/UljnSdXTMccY51qcUs14k3wUcZyX1i8+IZy6wwKJviiCsJczMU/6aawvb8FrU30G7hHX6Em6SLFTq9yXX7An6ceJ6uR8TDf48/x82pcL2PcIp7xBdYaqA3wM3IDVePuOhrhPwcrA/9TbFl4lX8Db7iz7Va7VcqlToKPoxeZG2ctV70J/EVbttr/LZ0nCBCeVm79i/qukFso7/+m0a19u1/PIFttKFE8dctDTEAAAAASUVORK5CYII=), auto',
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
      collapsed: false,
      invisible: false,
      isTaigendome: true,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
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
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '1ec7ac24933d',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
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

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '20d7ac24a2e8',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'の',
    },
  },
  color: '#00A89D',
  sentences: {
    '3277ac248fb5': {
      id: '3277ac248fb5',
      topic: '',
      comments: ['1ec7ac24933d'],
      shuuJoshi: '',
      juntaiJoshi: '',
      buntouSeibuns: [],
      setsuzokuJoshis: {},
      juntaiJoshiBunmatsu: '',
      open: true,
      text: 'トンガの火山噴火',
      color: '#00A89D',
      buntouText: '',
      topicBranch: null,
      topicUnitId: '',
      isTaigendome: true,
      bunmatsuText: '',
      commentUnitIds: ['1ec7ac24933d'],
    },
  },
  bodyTexts: ['トンガの', '火山噴火', ''],
  shuuJoshi: '',
  sentenceId: '3277ac248fb5',
  juntaiJoshi: '',
  topicUnitId: '',
  sentenceOpen: true,
  isTaigendome: true,
  buntouSeibuns: [],
  commentUnitIds: ['1ec7ac24933d'],
  hasTopicBranch: false,
  topicBranchUnitId: '',
  topicBranchCursor: '',
  sentenceArrayIndex: 0,
  juntaiJoshiBunmatsu: '',
  topicBranchJoshiLabels: [],
};

const props2 = {
  cursor:
    'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADw6FuzAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAACbElEQVRIDe2Uv2sTYRjHL5deb1PaQdriooMJiEMXhdIgdVEHh7qoaFH6B9QuJViTNL2kdujij1lQVMSpQ1vURZCK4OQggRQMDootLoJbPJLr5/vmLlwkdLFFkD7w3PM83/f7PO/zPvfeWda+/OsJJHZqoFgsDjSbzatwTqMngiAYEj+RSHzHfELf2rb9DN6W8G7SdQMSDjUajUUSJlCnW2IM8/GfJJPJW+T9iOHGtf8ECoXCWYpXwSfRgG5fYC/R/bFqtdrj+34/8Ul0IlwL8CeVo1z8DunYIJ/PX6PQGow+klfw057nXSauMIrFdDr91XGcCmtZsI9aE0dc5ShXNfDb0h5RLpc7A/EVKxrJ7VKpdEcsujpP4jKuqzgmdfjjbPJSGIVnMQuoD/9cuVx+I9ycIJvNHqTDx8Qq7kXFmekByA/BXIo9YM6DUvnCtCYOvhXmeLiOaqmm8B49XNedgXwYd50C88Ik3KAMRgXf0emUAVuPKU42TM5oyNFYLeXyLsbAM6oJlDMnADBzw96lo2arBm84CFKh/yHCYtZgMY6lXNUQB2tqmg3o8KlA7DQkg4XxhixyqmU6ngYjJ+JoA1s1xIpqmhHV6/UljnSdXTMccY51qcUs14k3wUcZyX1i8+IZy6wwKJviiCsJczMU/6aawvb8FrU30G7hHX6Em6SLFTq9yXX7An6ceJ6uR8TDf48/x82pcL2PcIp7xBdYaqA3wM3IDVePuOhrhPwcrA/9TbFl4lX8Db7iz7Va7VcqlToKPoxeZG2ctV70J/EVbttr/LZ0nCBCeVm79i/qukFso7/+m0a19u1/PIFttKFE8dctDTEAAAAASUVORK5CYII=), auto',
  units: {
    '1907ac2e8f36': {
      id: '1907ac2e8f36',
      wordID: '3257ac2e8f36',
      branchIDs: ['37ac2eb9aa'],
      type: 'meishiku',
      word: {
        id: '3257ac2e8f36',
        text: '映像だけ',
        hinshi: 'meishi',
        color: 'inherit',

        border: 'none',

        backgroundColor: '#FCE5E5',
      },
      branches: [
        {
          id: '37ac2eb9aa',
          unitId: '3657ac2eb9aa',
          joshi: { rentaiJoshi: '', renyouJoshi: null },

          border: '',
          unitType: 'plain',
          joshiLabels: [''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: 'e47ac2e8f36',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'でも',
    },
    e47ac2e8f36: {
      id: 'e47ac2e8f36',
      wordID: '',
      branchIDs: ['3a57ac2e8f36'],
      type: 'meishiku',
      word: {
        text: '',
        color: '',
        hinshi: 'meishi',
        border: '',

        backgroundColor: '',
      },
      branches: [
        {
          id: '3a57ac2e8f36',
          unitId: '1907ac2e8f36',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: '', kakariJoshi: 'でも' },
          },

          border: '',
          unitType: 'meishiku',
          joshiLabels: ['', 'でも'],
          topicBorder: '2px solid #00A89D',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
    '3657ac2eb9aa': {
      id: '3657ac2eb9aa',
      wordID: '1617ac2eb9aa',
      branchIDs: ['a07ac2ee2b9'],
      type: 'plain',
      word: {
        id: '1617ac2eb9aa',
        text: 'の',
        hinshi: 'doushi',
        color: 'inherit',

        border: 'none',

        backgroundColor: '#CCE5FA',
      },
      branches: [
        {
          id: 'a07ac2ee2b9',
          unitId: '2d97ac2ee2b9',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: 'から', kakariJoshi: '' },
          },

          border: '',
          unitType: 'plain',
          joshiLabels: ['から', ''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '1907ac2e8f36',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
    '2d97ac2ee2b9': {
      id: '2d97ac2ee2b9',
      wordID: '2e27ac2ee2b9',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '2e27ac2ee2b9',
        text: '衛星',
        hinshi: 'meishi',
        color: 'inherit',

        border: 'none',

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '3657ac2eb9aa',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'から',
    },
    '3e67ac2efb77': {
      id: '3e67ac2efb77',
      wordID: '6f7ac2efb77',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '6f7ac2efb77',
        text: '',
        hinshi: 'meishi',
        color: 'inherit',

        border: 'none',

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
    '1077ac2efb77': {
      id: '1077ac2efb77',
      wordID: '23d7ac2efb77',
      branchIDs: ['697ac2f27a0'],
      type: 'plain',
      word: {
        id: '23d7ac2efb77',
        text: '恐ろしかったです',
        hinshi: 'ikeiyoushi',
        color: 'inherit',

        border: 'none',

        backgroundColor: '#D8F077',
      },
      branches: [
        {
          id: '697ac2f27a0',
          unitId: '547ac2f27a0',
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
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
    '547ac2f27a0': {
      id: '547ac2f27a0',
      wordID: '32c7ac2f27a0',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '32c7ac2f27a0',
        text: '十分',
        hinshi: 'hukushi',
        color: 'inherit',

        border: 'none',

        backgroundColor: '#E9F8FF',
      },
      branches: [],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '1077ac2efb77',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
  },
  color: '#00A89D',
  sentences: {
    '967ac2e7797': {
      id: '967ac2e7797',
      topic: 'e47ac2e8f36',
      comments: ['1077ac2efb77'],
      shuuJoshi: '',
      juntaiJoshi: '',
      buntouSeibuns: [],
      setsuzokuJoshis: {},
      juntaiJoshiBunmatsu: '',
      open: true,
      text: '衛星からの映像だけでも十分恐ろしかったです。',
      color: '#00A89D',
      buntouText: '',
      topicBranch: {
        id: '3a57ac2e8f36',
        unitId: '1907ac2e8f36',
        joshi: {
          rentaiJoshi: null,
          renyouJoshi: { kakuJoshi: '', kakariJoshi: 'でも' },
        },
        border: '',
        unitType: 'meishiku',
        joshiLabels: ['', 'でも'],
        topicBorder: '2px solid #00A89D',
        isDraggable: false,
        isCommentMeishi: false,
      },
      topicUnitId: 'e47ac2e8f36',
      isTaigendome: false,
      bunmatsuText: '',
      commentUnitIds: ['1077ac2efb77'],
    },
  },
  bodyTexts: [
    '衛星から',
    'の',
    '映像だけでも',
    '',
    '十分',
    '恐ろしかったです。',
  ],
  shuuJoshi: '',
  sentenceId: '967ac2e7797',
  juntaiJoshi: '',
  topicUnitId: 'e47ac2e8f36',
  sentenceOpen: true,
  isTaigendome: false,
  buntouSeibuns: [],
  commentUnitIds: ['1077ac2efb77'],
  hasTopicBranch: true,
  topicBranchUnitId: '1907ac2e8f36',
  sentenceArrayIndex: 0,
  juntaiJoshiBunmatsu: '',
  topicBranchJoshiLabels: ['', 'でも'],
};

const props3 = {
  cursor:
    'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADw6FuzAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAACbElEQVRIDe2Uv2sTYRjHL5deb1PaQdriooMJiEMXhdIgdVEHh7qoaFH6B9QuJViTNL2kdujij1lQVMSpQ1vURZCK4OQggRQMDootLoJbPJLr5/vmLlwkdLFFkD7w3PM83/f7PO/zPvfeWda+/OsJJHZqoFgsDjSbzatwTqMngiAYEj+RSHzHfELf2rb9DN6W8G7SdQMSDjUajUUSJlCnW2IM8/GfJJPJW+T9iOHGtf8ECoXCWYpXwSfRgG5fYC/R/bFqtdrj+34/8Ul0IlwL8CeVo1z8DunYIJ/PX6PQGow+klfw057nXSauMIrFdDr91XGcCmtZsI9aE0dc5ShXNfDb0h5RLpc7A/EVKxrJ7VKpdEcsujpP4jKuqzgmdfjjbPJSGIVnMQuoD/9cuVx+I9ycIJvNHqTDx8Qq7kXFmekByA/BXIo9YM6DUvnCtCYOvhXmeLiOaqmm8B49XNedgXwYd50C88Ik3KAMRgXf0emUAVuPKU42TM5oyNFYLeXyLsbAM6oJlDMnADBzw96lo2arBm84CFKh/yHCYtZgMY6lXNUQB2tqmg3o8KlA7DQkg4XxhixyqmU6ngYjJ+JoA1s1xIpqmhHV6/UljnSdXTMccY51qcUs14k3wUcZyX1i8+IZy6wwKJviiCsJczMU/6aawvb8FrU30G7hHX6Em6SLFTq9yXX7An6ceJ6uR8TDf48/x82pcL2PcIp7xBdYaqA3wM3IDVePuOhrhPwcrA/9TbFl4lX8Db7iz7Va7VcqlToKPoxeZG2ctV70J/EVbttr/LZ0nCBCeVm79i/qukFso7/+m0a19u1/PIFttKFE8dctDTEAAAAASUVORK5CYII=), auto',
  units: {
    f873fd1367e: {
      id: 'f873fd1367e',
      wordID: '3573fd1367e',
      branchIDs: ['14373fd18ae7'],
      type: 'plain',
      word: {
        id: '3573fd1367e',
        text: '登録して',
        hinshi: 'doushi',
        color: 'inherit',
        border: 'none',

        backgroundColor: '#CCE5FA',
      },
      branches: [
        {
          id: '14373fd18ae7',
          unitId: 'e273fd18ae7',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: 'に', kakariJoshi: 'も' },
          },
          border: '',
          unitType: 'meishiku',
          joshiLabels: ['に', 'も'],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
    '8b73fd169a2': {
      id: '8b73fd169a2',
      wordID: '11a73fd169a2',
      branchIDs: [
        '1e873fd2516f',
        '3df73fd2818f',
        '26f73fd28f01',
        '1c73fd2a466',
      ],
      type: 'plain',
      word: {
        id: '11a73fd169a2',
        text: '見ています',
        hinshi: 'doushi',
        color: 'inherit',
        border: 'none',

        backgroundColor: '#CCE5FA',
      },
      branches: [
        {
          id: '1e873fd2516f',
          unitId: '1f773fd2516f',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: '', kakariJoshi: '' },
          },
          border: '1px solid #eee',
          unitType: 'meishiku',
          joshiLabels: ['', ''],
          topicBorder: '',
          isDraggable: true,
          isCommentMeishi: false,
        },
        {
          id: '3df73fd2818f',
          unitId: '2a73fd2818f',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: '', kakariJoshi: '' },
          },
          border: '1px solid #eee',
          unitType: 'plain',
          joshiLabels: ['', ''],
          topicBorder: '',
          isDraggable: true,
          isCommentMeishi: false,
        },
        {
          id: '26f73fd28f01',
          unitId: 'd173fd28f01',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: '', kakariJoshi: '' },
          },
          border: '1px solid #eee',
          unitType: 'plain',
          joshiLabels: ['', ''],
          topicBorder: '',
          isDraggable: true,
          isCommentMeishi: false,
        },
        {
          id: '1c73fd2a466',
          unitId: '31d73fd2a466',
          joshi: {
            rentaiJoshi: null,
            renyouJoshi: { kakuJoshi: 'を', kakariJoshi: '' },
          },
          border: '1px solid #eee',
          unitType: 'meishiku',
          joshiLabels: ['を', ''],
          topicBorder: '',
          isDraggable: true,
          isCommentMeishi: false,
        },
      ],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
    e273fd18ae7: {
      id: 'e273fd18ae7',
      wordID: '28573fd18ae7',
      branchIDs: ['d973fd1df18', 'ca73fd1b42a'],
      type: 'meishiku',
      word: {
        id: '28573fd18ae7',
        text: 'ユーチューブチャンネル',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        backgroundColor: '#FCE5E5',
      },
      branches: [
        {
          id: 'd973fd1df18',
          unitId: '3a773fd1df18',
          joshi: { rentaiJoshi: 'の', renyouJoshi: null },
          border: '1px dashed #87b1ec',
          unitType: 'plain',
          joshiLabels: ['の'],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
        {
          id: 'ca73fd1b42a',
          unitId: '12873fd1b42a',
          joshi: { rentaiJoshi: 'の', renyouJoshi: null },
          lock: true,
          border: '1px dashed #87b1ec',
          unitType: 'plain',
          joshiLabels: ['の'],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: 'f873fd1367e',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'にも',
    },
    '12873fd1b42a': {
      id: '12873fd1b42a',
      wordID: '2b673fd1b42a',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '2b673fd1b42a',
        text: '宇宙系',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: 'e273fd18ae7',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'の',
    },
    '3a773fd1df18': {
      id: '3a773fd1df18',
      wordID: '1ea73fd1df18',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '1ea73fd1df18',
        text: 'NASAやJAXAなど',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: 'e273fd18ae7',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'の',
    },
    '1f773fd2516f': {
      id: '1f773fd2516f',
      wordID: '2bf73fd2516f',
      branchIDs: ['13573fd27356'],
      type: 'meishiku',
      word: {
        id: '2bf73fd2516f',
        text: '2週間',
        hinshi: 'jisuushi',
        color: 'inherit',
        border: 'none',

        backgroundColor: '#F1D7ED',
      },
      branches: [
        {
          id: '13573fd27356',
          unitId: '11273fd27356',
          joshi: { rentaiJoshi: '', renyouJoshi: null },
          border: '',
          unitType: 'plain',
          joshiLabels: [''],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '8b73fd169a2',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
    '11273fd27356': {
      id: '11273fd27356',
      wordID: '17a73fd27356',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '17a73fd27356',
        text: 'この',
        hinshi: 'rentaishi',
        color: 'inherit',
        border: '1px solid #ccc',

        backgroundColor: '',
      },
      branches: [],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '1f773fd2516f',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
    '2a73fd2818f': {
      id: '2a73fd2818f',
      wordID: 'c73fd2818f',
      branchIDs: [],
      type: 'plain',
      word: {
        id: 'c73fd2818f',
        text: '毎日',
        hinshi: 'hukushi',
        color: 'inherit',
        border: 'none',

        backgroundColor: '#E9F8FF',
      },
      branches: [],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '8b73fd169a2',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
    d173fd28f01: {
      id: 'd173fd28f01',
      wordID: '34973fd28f01',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '34973fd28f01',
        text: 'ずっと',
        hinshi: 'hukushi',
        color: 'inherit',
        border: 'none',

        backgroundColor: '#E9F8FF',
      },
      branches: [],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '8b73fd169a2',
      setsuzokuJoshi: '',
      parentBranchJoshi: '',
    },
    '31d73fd2a466': {
      id: '31d73fd2a466',
      wordID: '1df73fd2a466',
      branchIDs: ['28873fd2b481'],
      type: 'meishiku',
      word: {
        id: '1df73fd2a466',
        text: '動画',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        backgroundColor: '#FCE5E5',
      },
      branches: [
        {
          id: '28873fd2b481',
          unitId: '1df73fd2b481',
          joshi: { rentaiJoshi: 'の', renyouJoshi: null },
          border: '',
          unitType: 'plain',
          joshiLabels: ['の'],
          topicBorder: '',
          isDraggable: false,
          isCommentMeishi: false,
        },
      ],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '8b73fd169a2',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'を',
    },
    '1df73fd2b481': {
      id: '1df73fd2b481',
      wordID: '1a273fd2b481',
      branchIDs: [],
      type: 'plain',
      word: {
        id: '1a273fd2b481',
        text: 'ロケットの打ち上げや国際宇宙ステーションでの宇宙飛行士の生活など',
        hinshi: 'meishi',
        color: 'inherit',
        border: 'none',

        backgroundColor: '#FCE5E5',
      },
      branches: [],
      collapsed: false,
      invisible: false,
      isTaigendome: false,
      parentUnitId: '31d73fd2a466',
      setsuzokuJoshi: '',
      parentBranchJoshi: 'の',
    },
  },
  sentences: {
    '9773fd12a4f': {
      id: '9773fd12a4f',
      topic: '',
      comments: ['f873fd1367e', '8b73fd169a2'],
      shuuJoshi: '',
      juntaiJoshi: '',
      buntouSeibuns: [],
      setsuzokuJoshis: {},
      juntaiJoshiBunmatsu: '',
      open: true,
      text: 'NASAやJAXAなどの宇宙系のユーチューブチャンネルにも登録して、この2週間毎日ずっとロケットの打ち上げや国際宇宙ステーションでの宇宙飛行士の生活などの動画を見ています。',
      color: '#00A89D',
      buntouText: '',
      topicBranch: null,
      topicUnitId: '',
      isTaigendome: false,
      bunmatsuText: '',
      commentUnitIds: ['f873fd1367e', '8b73fd169a2'],
    },
  },
  sentenceId: '9773fd12a4f',
  sentenceArrayIndex: 0,
  color: '#00A89D',
  bodyTexts: [
    'NASAやJAXAなどの',
    '宇宙系の',
    'ユーチューブチャンネルにも',
    '登録して、',
    'この',
    '2週間',
    '毎日',
    'ずっと',
    'ロケットの打ち上げや国際宇宙ステーションでの宇宙飛行士の生活などの',
    '動画を',
    '見ています。',
  ],
  shuuJoshi: '',
  juntaiJoshi: '',
  topicUnitId: '',
  sentenceOpen: true,
  isTaigendome: false,
  buntouSeibuns: [],
  commentUnitIds: ['f873fd1367e', '8b73fd169a2'],
  juntaiJoshiBunmatsu: '',
  hasTopicBranch: false,
  topicBranchCursor: '',
  topicBranchUnitId: '',
  topicBranchJoshiLabels: [],
};

const getCommentUnitIds = (sentences: {
  [sentenceId: string]: { id: string; commentUnitIds: string[] };
}) => {
  const commentUnitIds: { [sentenceId: string]: string[] } = {};
  for (const sentence of Object.values(sentences)) {
    commentUnitIds[sentence.id] = sentence.commentUnitIds;
  }
  return commentUnitIds;
};

export const Taigendome = () => {
  const {
    sentences: _sentences,
    units: _units,
    sentenceId,
    bodyTexts,
    sentenceArrayIndex,
  } = props;
  const {
    color,
    shuuJoshi,
    topicBranch,
    topicUnitId,
    isTaigendome,
    buntouSeibuns,
    commentUnitIds,
    juntaiJoshiBunmatsu,
    juntaiJoshi,
  } = (_sentences as any)[sentenceId];
  const units = getSentencePaneUnits(_units);
  const sentences = getSentencePaneSentences(_sentences);
  const parentUnitIds = getParentUnitIds(_units);
  const branchUnitIds = getBranchUnitIds(_units);
  const sentenceArray = ['3277ac248fb5'];
  const isMainSentence = true;
  const isMainSentenceArray = true;
  const sentenceCommentUnitIds = getCommentUnitIds(_sentences);

  const _props = {
    sentenceArrayIndex,
    sentenceId,
    bodyTexts,
    units,
    color,
    sentences,
    shuuJoshi,
    juntaiJoshi,
    topicUnitId,
    topicBranch,
    isTaigendome,
    buntouSeibuns,
    parentUnitIds,
    branchUnitIds,
    sentenceArray,
    commentUnitIds,
    isMainSentence,
    isMainSentenceArray,
    juntaiJoshiBunmatsu,
    sentenceCommentUnitIds,
  };

  console.log(JSON.stringify(_props));

  return (
    <SentencePane
      {..._props}
      // sentenceArrayIndex={sentenceArrayIndex}
      // sentenceId={sentenceId}
      // bodyTexts={bodyTexts}
      Cursor={Cursor}
      // units={units}
      // color={color}
      // sentences={sentences}
      // shuuJoshi={shuuJoshi}
      // juntaiJoshi={juntaiJoshi}
      // topicUnitId={topicUnitId}
      // topicBranch={topicBranch}
      // isTaigendome={isTaigendome}
      // buntouSeibuns={buntouSeibuns}
      // parentUnitIds={parentUnitIds}
      // branchUnitIds={branchUnitIds}
      // sentenceArray={sentenceArray}
      // commentUnitIds={commentUnitIds}
      // isMainSentence={isMainSentence}
      // isMainSentenceArray={isMainSentenceArray}
      // juntaiJoshiBunmatsu={juntaiJoshiBunmatsu}
      // sentenceCommentUnitIds={sentenceCommentUnitIds}
    />
  );
};

export const Comment = () => {
  const { sentences, units, sentenceId } = props3;
  const {
    color,
    shuuJoshi,
    topicUnitId,
    topicBranch,
    isTaigendome,
    buntouSeibuns,
    commentUnitIds,
    juntaiJoshiBunmatsu,
    juntaiJoshi,
  } = (sentences as any)[sentenceId];
  return (
    <SentencePane
      {...props3}
      Cursor={Cursor}
      units={getSentencePaneUnits(units)}
      color={color}
      sentences={getSentencePaneSentences(sentences)}
      shuuJoshi={shuuJoshi}
      topicBranch={topicBranch}
      juntaiJoshi={juntaiJoshi}
      topicUnitId={topicUnitId}
      isTaigendome={isTaigendome}
      buntouSeibuns={buntouSeibuns}
      parentUnitIds={getParentUnitIds(units)}
      branchUnitIds={getBranchUnitIds(units)}
      sentenceArray={['9773fd12a4f']}
      commentUnitIds={commentUnitIds}
      isMainSentence={true}
      isMainSentenceArray={true}
      juntaiJoshiBunmatsu={juntaiJoshiBunmatsu}
      sentenceCommentUnitIds={getCommentUnitIds(sentences)}
    />
  );
};

export const TopicComments = () => {
  const { sentences, units, sentenceId, juntaiJoshi } = props2;
  const {
    color,
    shuuJoshi,
    topicUnitId,
    topicBranch,
    isTaigendome,
    buntouSeibuns,
    commentUnitIds,
    juntaiJoshiBunmatsu,
  } = (sentences as any)[sentenceId];
  return (
    <SentencePane
      {...props2}
      Cursor={Cursor}
      units={getSentencePaneUnits(units)}
      color={color}
      sentences={getSentencePaneSentences(sentences)}
      shuuJoshi={shuuJoshi}
      juntaiJoshi={juntaiJoshi}
      topicUnitId={topicUnitId}
      topicBranch={topicBranch}
      isTaigendome={isTaigendome}
      buntouSeibuns={buntouSeibuns}
      branchUnitIds={getBranchUnitIds(units)}
      parentUnitIds={getParentUnitIds(units)}
      sentenceArray={['967ac2e7797']}
      commentUnitIds={commentUnitIds}
      isMainSentence={true}
      juntaiJoshiBunmatsu={juntaiJoshiBunmatsu}
      isMainSentenceArray={true}
      sentenceCommentUnitIds={getCommentUnitIds(sentences)}
    />
  );
};

type Sentence = {
  id: string;
  color: string;
  shuuJoshi: string;
  buntouText: string;
  juntaiJoshi: string;
  topicUnitId: string;
  topicBranch: Branch | null;
  isTaigendome: boolean;
  bunmatsuText: string;
  buntouSeibuns: {
    text: string;
    hinshi: string;
  }[];
  commentUnitIds: string[];
  juntaiJoshiBunmatsu: string;
};

type Branch = {
  lock?: boolean;
  border: string;
  unitId: string;
  unitType: string;
  joshiLabels: string[];
  isDraggable: boolean;
  isCommentMeishi: boolean;
};

type Unit = {
  id: string;
  type: string;
  word: {
    text: string;
    hinshi: string;
  };
  branches: Branch[];
  isTaigendome: boolean;
  parentUnitId: string;
  setsuzokuJoshi: string;
  parentBranchJoshi: string;
};

type SentencePaneSentence = {
  id: string;
  buntouText: string;
  topicUnitId: string;
  hasBunmatsu: boolean;
  isTaigendome: boolean;
  bunmatsuText: string;
  commentUnitIds: string[];
  topicBranchUnitId: string;
};

type SentencePaneUnit = {
  id: string;
  type: string;
  text: string;
  hinshi: string;
  branches: Branch[];
  isTaigendome: boolean;
  parentUnitId: string;
  setsuzokuJoshi: string;
  parentBranchJoshi: string;
};

const getBranchUnitIds = (units: {
  [unitId: string]: { branches: Branch[] };
}) => {
  const branchUnitIds: { [unitId: string]: string[] } = {};
  for (const [unitId, unit] of Object.entries(units)) {
    branchUnitIds[unitId] = unit.branches.map((branch) => branch.unitId);
  }
  return branchUnitIds;
};

const getSentencePaneSentences = (sentences: { [id: string]: Sentence }) => {
  const _sentences: { [id: string]: SentencePaneSentence } = {};
  for (const sentence of Object.values(sentences)) {
    _sentences[sentence.id] = {
      ...sentence,
      hasBunmatsu: !!sentence.shuuJoshi || !!sentence.juntaiJoshi,
      topicBranchUnitId: sentence.topicBranch?.unitId || '',
    };
  }
  return _sentences;
};

const getParentUnitIds = (units: {
  [id: string]: { parentUnitId: string };
}) => {
  const parentUnitIds: { [unitId: string]: string } = {};
  for (const [unitId, unit] of Object.entries(units)) {
    parentUnitIds[unitId] = unit.parentUnitId;
  }
  return parentUnitIds;
};

const getSentencePaneUnits = (units: { [id: string]: Unit }) => {
  const _units: {
    [unitId: string]: SentencePaneUnit;
  } = {};
  for (const unit of Object.values(units)) {
    _units[unit.id] = {
      ...unit,
      text: unit.word.text,
      hinshi: unit.word.hinshi,
    };
  }
  return _units;
};
