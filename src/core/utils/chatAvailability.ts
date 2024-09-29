import { Availability } from '@typings/common';
import { capitalize } from './common';

export const getChatAvailabilityText = (availabilities: Availability[]) => {
  if (!availabilities || !availabilities.length) {
    return 'Not Available';
  }
  const days = availabilities.map((item) => item.day);
  let isMondayToFriday = true;
  for (const day of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']) {
    if (!days.includes(day)) {
      isMondayToFriday = false;
    }
  }
  if (isMondayToFriday) {
    return 'Monday to Friday';
  }
  return days.map((item) => capitalize(item.slice(0, 3))).join(', ');
};
