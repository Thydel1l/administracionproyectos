import { createPool } from "mysql2";
const pool = createPool({
    host: '127.0.0.1',
    port: '3310',
    user: 'user',
    password: 'password',
    database: 'administracionproyectos'
});
export default pool;