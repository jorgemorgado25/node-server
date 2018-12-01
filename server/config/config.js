

/*----------------*/
// PUERTO //
/*----------------*/
process.env.PORT  = process.env.PORT || 3000;



/*----------------*/
// entorno //
/*----------------*/

//la variable la crea heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*----------------*/
// base de datos //
/*----------------*/

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;