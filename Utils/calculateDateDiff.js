function calculateDaysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60; // seconds in one day
    const diffInTime = Math.abs(date2 - date1);
    console.log(Math.floor(diffInTime/oneDay));
    return Math.floor(diffInTime / oneDay);
}


module.exports = calculateDaysBetween;