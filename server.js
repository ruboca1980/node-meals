require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');
const initModel = require('./models/initModels');

//LA AUTENTICACIÓN CON LA BASE DE DATOS
db.authenticate()
  .then((res) => console.log('Database Authenticated!'))
  .catch((err) => console.log(err));

initModel();

//LA SINCRONIZACIÓN CON LA BASE DE DATOS
db.sync()
  .then((res) => console.log('Database Synced!'))
  .catch((err) => console.log(err));

const port = +process.env.PORT || 4500;

app.listen(port, () => {
  console.log(`App Running on port ${port}`);
});
