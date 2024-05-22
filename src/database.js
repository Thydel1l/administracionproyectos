import { createPool } from "mysql2";
const pool = createPool({
    host:'localhost',
    port: '3306',
    user: 'root',
    password:'master123',
    database: 'administracionproyectos'
});
export default pool;