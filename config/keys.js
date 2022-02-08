if (process.env.NODE_ENV === 'production') {
    module.exports = require('./keys_prod');
} else {
    module.exports = require('./keys_dev');
}

/* module.exports = {
    mongoURI: 'mongodb+srv://ok123:ok123@tmcluster-toabq.mongodb.net/test?retryWrites=true&w=majority'
}; */