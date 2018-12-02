

/*----------------*/
// PUERTO //
/*----------------*/
process.env.PORT  = process.env.PORT || 3000;



/*----------------*/
// entorno //
/*----------------*/

//la variable la crea heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==================
// Vencimiento del token
//==================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//==================
// SEED
//==================

process.env.SEED = process.env.SEED || 'seed-de-desarrollo';

/*----------------*/
// base de datos //
/*----------------*/

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//GOOGLE CLIENT ID
//process.env.CLIENT_ID = process.env.CLIENT_ID || '485893421767-2hq7mec9cm6jj485opf1hq6fj2j5jnjl.apps.googleusercontent.com'

process.env.CLIENT_ID = '485893421767-2hq7mec9cm6jj485opf1hq6fj2j5jnjl.apps.googleusercontent.com';