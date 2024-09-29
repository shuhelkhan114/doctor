export const getRandomInteger = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getImageUrl = (firstName = '', lastName = '') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName.trim())}+${encodeURIComponent(
    lastName.trim()
  )}&background=F06292&color=ffffff`;

export const getDurationFormatted = (millis: number) => {
  const minutes = millis / 1000 / 60;
  const minutesDisplay = Math.floor(minutes);
  const seconds = Math.round((minutes - minutesDisplay) * 60);
  const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutesDisplay}:${secondsDisplay}`;
};

// Move to services
export const getOgData = async (url: string) => {
  return fetch(
    `https://opengraph.io/api/1.0/site/${encodeURIComponent(
      url
    )}?app_id=b9cd13a4-c377-4226-9081-5cce1478c723`
  )
    .then((res) => res.json())
    .then((res) => {
      return {
        title: res.openGraph.title,
        imageUrl: res.openGraph.image.url,
      };
    });
};

export const capitalizeFirstLetter = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getParsedMessage = (html = '') => {
  return html.replace(/<\/?[^>]+(>|$)/g, '').replace('\n', '');
};

export const isValidLink = (url: string) => {
  try {
    const pattern =
      /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/i;
    return pattern.test(url);
  } catch (e) {
    return false;
  }
};

export const sleep = (ms = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isValidEmail = (email: string) => {
  // Regular expression pattern for validating email address
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
