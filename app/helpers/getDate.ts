const getFutureDate = (daysInFuture: number) => { 
    let xDaysFromNow = new Date();
    xDaysFromNow.setDate(xDaysFromNow.getDate() + daysInFuture);

    return xDaysFromNow
};

export default getFutureDate;