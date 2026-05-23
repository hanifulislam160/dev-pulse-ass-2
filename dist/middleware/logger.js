export const logger = (req, res, next) => {
    const time = new Date().toLocaleString();
    console.log(`Request Log: Time   : ${time}\nMethod : ${req.method}\nRoute  : ${req.url}
  `);
    next();
};
//# sourceMappingURL=logger.js.map