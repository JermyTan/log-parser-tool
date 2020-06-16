import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export function isNumeric(value: any) {
  return !isNaN(value);
}

export function parseStringToDate(
  string: string
): { date?: dayjs.Dayjs; isValidDate: boolean } {
  const parsedString = string.replace("T", " ").replace("Z", "");

  const customDate = dayjs(
    parsedString,
    // @ts-ignore
    [
      "YYYY-MM-DD",
      "YYYY-M-DD",
      "YYYY-MM-D",
      "YYYY-M-D",
      "YYYY-MM-DD HH:mm",
      "YYYY-M-DD HH:mm",
      "YYYY-MM-D HH:mm",
      "YYYY-M-D HH:mm",
      "YYYY-MM-DD HH:mm:ss",
      "YYYY-M-DD HH:mm:ss",
      "YYYY-MM-D HH:mm:ss",
      "YYYY-M-D HH:mm:ss",
      "YYYY-MM-DD HH:mm:ss.SSS",
      "YYYY-M-DD HH:mm:ss.SSS",
      "YYYY-MM-D HH:mm:ss.SSS",
      "YYYY-M-D HH:mm:ss.SSS",
      "DD/MM/YYYY",
      "DD/M/YYYY",
      "D/MM/YYYY",
      "D/M/YYYY",
      "DD/MM/YYYY HH:mm",
      "DD/M/YYYY HH:mm",
      "D/MM/YYYY HH:mm",
      "D/M/YYYY HH:mm",
      "DD/MM/YYYY HH:mm:ss",
      "DD/M/YYYY HH:mm:ss",
      "D/MM/YYYY HH:mm:ss",
      "D/M/YYYY HH:mm:ss",
      "DD/MM/YYYY HH:mm:ss.SSS",
      "DD/M/YYYY HH:mm:ss.SSS",
      "D/MM/YYYY HH:mm:ss.SSS",
      "D/M/YYYY HH:mm:ss.SSS",
    ],
    true
  ).add(8, "hour");

  const isValidDate = customDate.isValid();

  return { date: isValidDate ? customDate : undefined, isValidDate };
}
