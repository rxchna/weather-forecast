/* Current Weather utility functions */

// Function to convert temperature to 1dp and add Celcius symbol
export const formatTemperature = (temp: any) => `${temp.toFixed(1)}\u00B0C`;

// Function to round dewpoint add Celcius symbol
export const formatDewPoint = (val: any) => `${Math.round(val)}\u00B0`;

// Function to return visibility in km
export const formatVisbilityKm = (meters: number) => meters / 1000;

// Get formatted current time
export const formatCurrentTime = new Date().toLocaleTimeString([], { // todo: display local time of selected location
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
}).replace(' at', '');

// Function to return capitalized string
export const capitalizeString = (str: string) => str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");


/* 6-day forecast utility functions */

// Function to display forecast temperature as max string
export const formatForecastMaxTemp = (maxTemp: any) => `${maxTemp.toFixed(1)}\u00B0/`;

// Function to display forecast temperature as min string
export const formatForecastMinTemp = (minTemp: any) => `${Math.floor(minTemp)}\u00B0`;

// Function to format date on forecast section
export const formatForecastDate = (dateTimeString: any) => {
    const date = new Date(`${dateTimeString}T00:00:00`); // date-fns library to handle date data parsing

    // Get month and day
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const day = date.getDate();

    // Get day of the week
    const dayOfWeek = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date);

    // Format the output
    const formattedDate = `${month} ${day < 10 ? '0' + day : day}`;
    const formattedDayOfWeek = dayOfWeek;

    return {
        formattedDate,
        formattedDayOfWeek
    };
}