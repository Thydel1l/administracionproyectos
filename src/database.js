import { createPool } from "mysql2";
const pool = createPool({
    host:'localhost',
    port: '3307',
    user: 'root',
    password:'48770660',
    database: 'administracionproyectos'
});
export default pool;