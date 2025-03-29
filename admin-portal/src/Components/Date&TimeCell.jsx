import React from "react";

export const DateTimeFormatter = ({ isoDateTime }) => {
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      const formattedDate = date.toLocaleDateString("en-US", options);
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const [day, month, year] = formattedDate.split(" ");
      return `${day} ${month} ${year} ${formattedTime}`;
    } catch (error) {
      console.error("Invalid date string:", dateString);
      return "Invalid date";
    }
  };

  return <span>{formatDateTime(isoDateTime)}</span>;
};



export const ISTDateTimeFormatter = ({ dateString, timeString }) => {

  function convertUTCToIST(date, time) {
    // Parse the date string (DDMMYY format)
    const day = parseInt(date.substring(0, 2), 10);
    const month = parseInt(date.substring(2, 4), 10) - 1; // JavaScript months are 0-indexed
    const year = 2000 + parseInt(date.substring(4, 6), 10); // Assume 21st century for YY

    // Parse the time string (HHMMSS format)
    const hours = parseInt(time.substring(0, 2), 10);
    const minutes = parseInt(time.substring(2, 4), 10);
    const seconds = parseInt(time.substring(4, 6), 10);

    // Create a UTC date object using the parsed date and time
    const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

    // Convert to IST by adding the offset (+5 hours 30 minutes)
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // Offset in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Format and return the result
    return `${utcDate.toISOString()} ${istDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
}

  

  return <span>{convertUTCToIST(dateString, timeString)}</span>;
};


