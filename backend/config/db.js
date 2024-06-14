import {Sequelize} from "sequelize";

const db = new Sequelize('pfe_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;