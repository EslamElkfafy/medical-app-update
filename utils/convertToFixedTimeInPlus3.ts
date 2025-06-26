// import { DateTime } from 'luxon';

// export function convertToFixedTimeInPlus3(date: Date | undefined | null): string | undefined {
//   if (!date || isNaN(date.getTime())) return undefined;

//   const fixed = DateTime.fromJSDate(date, { zone: 'utc' })
//     .set({ hour: 8, minute: 0, second: 0, millisecond: 0 })
//     .setZone('UTC+3', { keepLocalTime: true });

//   return fixed.toISO(); // returns a string
// }
