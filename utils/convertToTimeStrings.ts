export function convertToTimeStrings(dateTimeArray: string[]): string[] {
  return dateTimeArray.map((dt) => {
    const date = new Date(dt);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  });
}
export function formatTimeFromISOString(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
