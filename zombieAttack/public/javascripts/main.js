require.config({
    paths: {
        jquery: 'lib/jquery',
        login: 'login'
    },
        shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },
        'login':{
            deps:[],
            exports: 'login'
        }
    }
});

