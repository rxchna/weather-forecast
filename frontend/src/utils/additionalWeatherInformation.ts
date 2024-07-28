// Function to return additional information about current visibility
export const addVisibilityInfo = (visibility: number) => {
    if (visibility >= 6000) {
        return "Good visibility under clear conditions";
    } else if (visibility < 4000) {
        return "Haze is affecting visibility";
    } else {
        return "Moderate visibility due to haze or light fog";
    }
};

// Function to return additional information about current value for pressure
export const addPressureInfo = (pressure: number) => {
    if (pressure > 1014) {
        return "High pressure, stable weather conditions";
    } else if (pressure < 1000) {
        return "Unsettled weather and possible precipitation";
    } else {
        return "Normal atmospheric pressure";
    }
};

// Function to return additional information about humidiy - dew point
export const addDewPointInfo = (dew_point: string) => `The dew point is ${dew_point} right now`