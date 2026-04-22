import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Sushiko funcionando 🚀");
});

// Registro de usuarios WiFi
app.post("/api/register", async (req, res) => {
  try {
    const {
      nombre,
      telefono,
      email,
      fecha_nacimiento,
      consentimiento
    } = req.body;

    // Validación básica
    if (!nombre || !email) {
      return res.status(400).json({
        error: "Nombre y correo son obligatorios"
      });
    }

    await pool.query(
      `INSERT INTO users_wifi 
      (nombre, telefono, email, fecha_nacimiento, consentimiento_marketing) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING`,
      [nombre, telefono, email, fecha_nacimiento, consentimiento]
    );

    res.json({ success: true });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error en el servidor"
    });
  }
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});