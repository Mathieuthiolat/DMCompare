module.exports = function(app,path) {

    /* Index */
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/front-end/index.html'));
    });

    /* HtmlPage */
    app.get('/:page', function (req, res) {
        res.sendFile(path.join(__dirname + '/front-end/' + req.params.page + '.html'));
    });

}       