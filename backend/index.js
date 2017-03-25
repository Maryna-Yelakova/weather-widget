var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/../frontend/build'));
app.listen(app.get('port'), function () {
    console.log('Example app listening on port 3000!');
});


