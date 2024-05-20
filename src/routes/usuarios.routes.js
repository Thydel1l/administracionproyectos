import { Router } from "express";
import pool from "../database.js";
import bcrypt from 'bcryptjs';
const router = Router();
// Mostrar formulario de creación de usuario
router.get('/add', (req, res) => {
    res.render('usuarios/add');
});
router.get('/list', async (req, res) => {
    try {
        const [result] = await pool.promise().query('SELECT id, nombre, apellidos, email, rol, edad FROM usuarios');
        const usuarios = result;
        res.render('usuarios/list', { usuarios });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/add', async (req, res) => {
    try {
        const { name, lastname, email, contrasena, rol, edad } = req.body;
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        await pool.promise().query('INSERT INTO usuarios (nombre, apellidos, email, contrasena, rol, edad) VALUES (?, ?, ?, ?, ?, ?)', [name, lastname, email, hashedPassword, rol, edad]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// // Mostrar formulario de edición de usuario
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.promise().query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (result.length > 0) {
            res.render('usuarios/edit', { usuario: result[0] });
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Manejar la actualización de un usuario
router.post('/edit/:id', async (req, res) => {
    console.log("ENTRO AQUI MI KING");
    const { id } = req.params;
    const { name, lastname, email, contrasena, edad, rol } = req.body;
    console.log(req.body);
    try {
        const hashedPassword = await bcrypt.hash('123', 10);
        await pool.promise().query('UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, contrasena = ?, edad = ?, rol = ? WHERE id = ?',
            [name, lastname, email, hashedPassword, edad, rol, id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Delete project
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Eliminar tareas relacionadas
        await pool.promise().query('DELETE FROM tareas WHERE id_proyecto = ?', [id]);

        // 2. Eliminar proyecto
        await pool.promise().query('DELETE FROM proyectos WHERE id = ?', [id]);

        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
