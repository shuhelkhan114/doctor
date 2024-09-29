export const formatPhone = (value: string, previousValue?: string) => {
  // const cleaned = ('' + text).replace(/\D/g, '')
  // const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  // if (match) {
  //   const intlCode = match[1] ? '+1 ' : '',
  //     number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')

  //   return number
  // }

  // return text
  if (!value) return value;
  const currentValue = value.replace(/[^\d]/g, '');
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) return currentValue;
    if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
  }
  return value;
};
