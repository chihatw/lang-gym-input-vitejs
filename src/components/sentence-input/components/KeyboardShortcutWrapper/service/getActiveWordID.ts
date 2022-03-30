export const getActiveWordID = () => {
  const activeElement = document.activeElement;
  if (!activeElement) return;
  const activeTagName = (activeElement as HTMLElement).tagName;
  if (activeTagName !== 'INPUT') return;
  const wordID = activeElement.id.slice(4); // id から txt_ を削除
  return wordID;
};
