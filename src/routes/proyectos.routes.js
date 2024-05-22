import { Router } from 'express';
import pool from '../database.js';

const router = Router();

// Mostrar todos los proyectos de un usuario
router.get('/proyectos/list/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const [result] = await pool.promise().query('SELECT * FROM proyectos WHERE id_usuario = ?', [id_usuario]);
        res.render('proyectos/list', { proyectos: result, id_usuario });
    } catch (err) {
        req.flash('error_msg', 'Error al obtener los proyectos');
        res.redirect('/');
    }
});

// Mostrar formulario para crear un nuevo proyecto
router.get('/proyectos/add/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    res.render('proyectos/add', { id_usuario });
});

// Manejar la creación de un nuevo proyecto
router.post('/proyectos/add', async (req, res) => {
    const { nombre, descripcion, fechainicio, fechafin, id_usuario } = req.body;
    try {
        await pool.promise().query('INSERT INTO proyectos (nombre, descripcion, fechainicio, fechafin, id_usuario) VALUES (?, ?, ?, ?, ?)', [nombre, descripcion, fechainicio, fechafin, id_usuario]);
        req.flash('success_msg', 'Proyecto creado exitosamente');
        res.redirect(`/proyectos/list/${id_usuario}`);
    } catch (err) {
        req.flash('error_msg', 'Error al crear el proyecto');
        res.redirect(`/proyectos/add/${id_usuario}`);
    }
});

export default router;
