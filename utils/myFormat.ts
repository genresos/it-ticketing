const myNumberFormat = (number: number) => {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(
    number
  );
};

const myCurrencyFormat = (curr: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(curr);
};

const myDateTimeFormat = (date: string | number | Date) => {
  return new Date(date).toLocaleString("id-ID", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const myDateFormat = (date: string | number | Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const myTimeFormat = (time: string | number | Date) => {
  return new Date(time).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calcDate = (date1: string | number, date2: string | number) => {
  /*
   * calcDate() : Calculates the difference between two dates
   * @date1 : "First Date in the format MM-DD-YYYY"
   * @date2 : "Second Date in the format MM-DD-YYYY"
   * return : Array
   */

  //new date instance
  const dt_date1 = new Date(date1);
  const dt_date2 = new Date(date2);

  //Get the Timestamp
  const date1_time_stamp = dt_date1.getTime();
  const date2_time_stamp = dt_date2.getTime();

  let calc;

  //Check which timestamp is greater
  if (date1_time_stamp > date2_time_stamp) {
    calc = new Date(date1_time_stamp - date2_time_stamp);
  } else {
    calc = new Date(date2_time_stamp - date1_time_stamp);
  }
  //Retrieve the date, month and year
  const calcFormatTmp =
    calc.getDate() + "-" + (calc.getMonth() + 1) + "-" + calc.getFullYear();
  //Convert to an array and store
  const calcFormat = calcFormatTmp.split("-");
  //Subtract each member of our array from the default date
  const days_passed = Math.abs(Number(calcFormat[0])) - 1;
  const months_passed = Math.abs(Number(calcFormat[1])) - 1;
  const years_passed = Math.abs(Number(calcFormat[2])) - 1970;

  //Set up custom text
  const yrsTxt = ["year", "years"];
  const mnthsTxt = ["month", "months"];
  const daysTxt = ["day", "days"];

  //Convert to days and sum together
  const total_days = years_passed * 365 + months_passed * 30.417 + days_passed;
  const total_secs = total_days * 24 * 60 * 60;
  const total_mins = total_days * 24 * 60;
  const total_hours = total_days * 24;
  const total_weeks = total_days >= 7 ? total_days / 7 : 0;

  //display result with custom text
  const result =
    (years_passed == 1
      ? years_passed + " " + yrsTxt[0] + " "
      : years_passed > 1
      ? years_passed + " " + yrsTxt[1] + " "
      : "") +
    (months_passed == 1
      ? months_passed + " " + mnthsTxt[0]
      : months_passed > 1
      ? months_passed + " " + mnthsTxt[1] + " "
      : "") +
    (days_passed == 1
      ? days_passed + " " + daysTxt[0]
      : days_passed > 1
      ? days_passed + " " + daysTxt[1]
      : "");

  //return the result
  return {
    total_days: Math.round(total_days),
    total_weeks: Math.round(total_weeks),
    total_hours: Math.round(total_hours),
    total_minutes: Math.round(total_mins),
    total_seconds: Math.round(total_secs),
    result: result.trim(),
  };
};

const calcDateIndo = (
  date1: string | number,
  date2: string | number,
  showDate?: boolean
) => {
  /*
   * calcDate() : Calculates the difference between two dates
   * @date1 : "First Date in the format MM-DD-YYYY"
   * @date2 : "Second Date in the format MM-DD-YYYY"
   * return : Array
   */

  //new date instance
  const dt_date1 = new Date(date1);
  const dt_date2 = new Date(date2);

  //Get the Timestamp
  const date1_time_stamp = dt_date1.getTime();
  const date2_time_stamp = dt_date2.getTime();

  let calc;

  //Check which timestamp is greater
  if (date1_time_stamp > date2_time_stamp) {
    calc = new Date(date1_time_stamp - date2_time_stamp);
  } else {
    calc = new Date(date2_time_stamp - date1_time_stamp);
  }
  //Retrieve the date, month and year
  const calcFormatTmp =
    calc.getDate() + "-" + (calc.getMonth() + 1) + "-" + calc.getFullYear();
  //Convert to an array and store
  const calcFormat = calcFormatTmp.split("-");
  //Subtract each member of our array from the default date
  const days_passed = Math.abs(Number(calcFormat[0])) - 1;
  const months_passed = Math.abs(Number(calcFormat[1])) - 1;
  const years_passed = Math.abs(Number(calcFormat[2])) - 1970;

  //Convert to days and sum together
  const total_days = years_passed * 365 + months_passed * 30.417 + days_passed;
  const total_secs = total_days * 24 * 60 * 60;
  const total_mins = total_days * 24 * 60;
  const total_hours = total_days * 24;
  const total_weeks = total_days >= 7 ? total_days / 7 : 0;

  //display result with custom text
  const result =
    (years_passed > 0 ? years_passed + " " + "Tahun" + " " : "") +
    (months_passed > 0 ? months_passed + " " + "Bulan" + " " : "") +
    (showDate ? (days_passed > 0 ? days_passed + " " + "Hari" : "") : "");

  //return the result
  return {
    total_days: Math.round(total_days),
    total_weeks: Math.round(total_weeks),
    total_hours: Math.round(total_hours),
    total_minutes: Math.round(total_mins),
    total_seconds: Math.round(total_secs),
    result: result.trim(),
  };
};

export {
  myNumberFormat,
  myCurrencyFormat,
  myDateTimeFormat,
  myDateFormat,
  myTimeFormat,
  calcDate,
  calcDateIndo,
};
