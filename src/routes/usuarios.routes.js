import { Router } from "express";
import pool from "../database.js";
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/add', (req, res) => {
    res.render('usuarios/add');
});

router.get('/usuarios/list', roladmin, async (req, res) => {
    try {
        const [result] = await pool.promise().query('SELECT id, nombre, apellidos, email, rol, edad FROM usuarios');
        const usuarios = result;
        res.render('usuarios/list', { usuarios });
    } catch (err) {
        console.error('Error al obtener la lista de usuarios:', err.message);
        req.session.error_msg = 'Error en el servidor';
        res.redirect('/login');
    }
});
router.post('/add', async (req, res) => {
    try {
        const { name, lastname, email, contrasena, rol, edad } = req.body;
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        await pool.promise().query('INSERT INTO usuarios (nombre, apellidos, email, contrasena, rol, edad) VALUES (?, ?, ?, ?, ?, ?)', [name, lastname, email, hashedPassword, rol, edad]);
        req.flash('success_msg', 'Usuario agregado correctamente');
        res.redirect('/login');
    } catch (err) {
        console.error('Error al agregar usuario:', err.message);
        req.flash('error_msg', 'Error al agregar usuario');
        res.redirect('/add');
    }
});

router.get('/edit/:id',roladmin, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.promise().query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (result.length > 0) {
            res.render('usuarios/edit', { usuario: result[0] });
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (err) {
        console.error('Error al obtener datos de usuario para edición:', err.message);
        res.status(500).json({ message: err.message });
    }
});

router.post('/edit/:id', async (req, res) => {
    console.log("ENTRO AQUI MI KING");
    const { id } = req.params;
    const { name, lastname, email, contrasena, edad, rol } = req.body;
    console.log(req.body);
    try {
        const hashedPassword = await bcrypt.hash('123', 10);
        await pool.promise().query('UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, contrasena = ?, edad = ?, rol = ? WHERE id = ?',
            [name, lastname, email, hashedPassword, edad, rol, id]);
        res.redirect('/usuarios/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const confirmed = req.query.confirmed;

    try {
        if (confirmed === 'true') {
            await pool.promise().query('DELETE FROM usuarios WHERE id = ?', [id]);
            await pool.promise().query('DELETE FROM tareas WHERE id_proyecto = ?', [id]);
            await pool.promise().query('DELETE FROM proyectos WHERE id = ?', [id]);
            req.flash('success_msg', 'Usuario eliminado correctamente');
            res.redirect('/usuarios/list');
        } else {
            res.redirect('/usuarios/list');
        }
    } catch (err) {
        console.error('Error al eliminar usuario:', err.message);
        req.flash('error_msg', 'Error al eliminar usuario');
        res.redirect('/list');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, contrasena } = req.body;
    try {
        const [rows] = await pool.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(contrasena, user.contrasena);
            if (match) {
                req.session.userId = user.id;
                req.session.userRole = user.rol;
                console.log(user.rol);
                if (user.rol === 'admin') {
                    res.redirect('/usuarios/list');
                } else {
                    res.redirect(`/user/${user.id}`);
                }
            } else {
                req.session.error_msg = 'Contraseña incorrecta';
                res.redirect('/login');
            }
        } else {
            req.session.error_msg = 'Usuario no encontrado';
            res.redirect('/login');
        }
    } catch (err) {
        console.error('Error durante el inicio de sesión:', err.message);
        req.session.error_msg = 'Error en el servidor';
        res.redirect('/login');
    }
});

function roladmin(req, res, next) {
    if (req.session.userRole && req.session.userRole === 'admin') {
        next();
    } else {
        req.session.error_msg = 'Acceso denegado';
        res.redirect('/login');
    }
}

// Ruta para mostrar la vista personalizada de un usuario
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.promise().query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (rows.length > 0) {
            const user = rows[0];
            if (user.rol === 'admin') {
                res.render('admin', { userId: user.id });
            } else if (user.rol === 'normal') {
                // Obtener proyectos del usuario
                const [proyectos] = await pool.promise().query('SELECT * FROM proyectos WHERE id_usuario = ?', [id]);
                res.render('normal', { userId: user.id, proyectos });
            }
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});
export default router;
