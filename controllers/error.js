exports.get404 = (req, res, next) => {
    console.log("Request for an invalid page (404)");
    res.status(401).send({status: "404 Page Not Found"});
};
