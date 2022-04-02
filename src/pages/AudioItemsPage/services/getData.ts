const getDate = (miliSeconds: number) => {
  const date = new Date(miliSeconds);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours());
  const minuts = String(date.getMinutes());
  const seconds = String(date.getSeconds());
  return `${month}月${day}日 ${hours.padStart(2, '0')}:${minuts.padStart(
    2,
    '0'
  )}:${seconds.padStart(2, '0')}`;
};

export default getDate;
