import { Availability } from "@prisma/client";
import { DateTime } from "luxon";

// Define only the keys that map to string[] in Availability
const days: (keyof Pick<Availability,
  "saturday" | "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday"
>)[] = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

export const changeTimeZone = (availability: Availability): Availability => {
  for (const day of days) {
    const timeSlots = availability[day] as string[]; // safely assert
    availability[day] = timeSlots.map((value) =>
      getLocalTimeFromUtc(value, "Africa/Cairo")
    );
  }
  return availability;
};

function getLocalTimeFromUtc(utcTime: string, timeZone: string): string {
  const localTime = DateTime.fromFormat(utcTime, "HH:mm", { zone: "utc" }).setZone(timeZone);
  return localTime.toFormat("HH:mm");
}
