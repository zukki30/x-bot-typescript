/**
 * 日付を HH:MM 形式でフォーマットする
 * @param date 日付
 * @returns HH:MM 形式の文字列
 */
export const formatDate = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * 日付を YYYY/MM/DD 形式でフォーマットする
 * @param date 日付
 * @returns YYYY/MM/DD 形式の文字列
 */
export const formatDateYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
};
