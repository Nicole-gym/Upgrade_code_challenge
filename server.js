const express = require('express');              // import express package
const app = express();                           // create http application
const restRouter = require('./routes/rest');     // import rest router

// if the url mathces '/api/v1', it will use restRouter to handle thetraffice
//version 1
app.use('/api/v1', restRouter);

// launch application, listen on port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'));
