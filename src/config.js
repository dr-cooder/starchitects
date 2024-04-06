require('dotenv').config();

const connections = {
    development: {
        http: {
            port: 3000,
        },
        mongo: `${process.env.MONGODB_URI}/Development?retryWrites=true&w=majority&appName=Cluster0` || 'mongodb://localhost/Starchitects',
    },
    production: {
        http: {
            port: process.env.PORT || process.env.NODE_PORT || 3000,
        },
        mongo: `${process.env.MONGODB_URI}/Production?retryWrites=true&w=majority&appName=Cluster0`,
    },
};

module.exports = {
    connections: connections[process.env.NODE_ENV],
    secret: process.env.SECRET,
};
