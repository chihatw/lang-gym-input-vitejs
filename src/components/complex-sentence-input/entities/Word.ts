export type Word = {
  id: string;
  hinshi: string;
  text: string;
};

export const INITIAL_WORD = {
  id: '',
  text: '',
  hinshi: 'meishi',
};

export const backgroundColors: { [id: string]: string } = {
  meishi: '#FCE5E5',
  meishibunmatsu: '#FFD8B3',
  jisuushi: '#F1D7ED',
  doushi: '#CCE5FA',
};

export const hasKatsuyou = (hinshi: string) => {
  return ['doushi', 'meishibunmatsu'].includes(hinshi);
};
