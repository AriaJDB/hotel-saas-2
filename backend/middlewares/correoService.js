const nodemailer = require('nodemailer');

// Configuración SMTP con Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'perrozuki.lfj@gmail.com',
        pass: 'lsqnpofaobrswsrc'
    },
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * Envía un correo con el link de recuperación de contraseña
 * @param {string} destino - correo del usuario
 * @param {string} nombre  - nombre del usuario
 * @param {string} token   - token único de recuperación
 */
async function enviarCorreoRecuperacion(destino, nombre, token) {
    const link = `http://localhost:5173/nueva-password?token=${token}`;

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#1e3a8a,#1e40af);padding:32px 40px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">🏨 HotelFlow</h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Sistema de Reservaciones</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="margin:0 0 12px;color:#1f2937;font-size:20px;">Recuperar contraseña</h2>
                  <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                    Hola <strong style="color:#1f2937;">${nombre}</strong>, recibimos una solicitud para restablecer la contraseña de tu cuenta.
                  </p>
                  <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;">
                    Haz clic en el siguiente botón para crear una nueva contraseña. Este enlace es válido por <strong>30 minutos</strong>.
                  </p>
                  <!-- Botón -->
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                    <tr>
                      <td style="background:linear-gradient(135deg,#1e3a8a,#1e40af);border-radius:8px;">
                        <a href="${link}" style="display:inline-block;padding:14px 36px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;">
                          Crear nueva contraseña
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;">Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
                  <p style="margin:0;word-break:break-all;">
                    <a href="${link}" style="color:#1e40af;font-size:13px;">${link}</a>
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                    Si no solicitaste este cambio, ignora este correo. Tu contraseña no será modificada.<br>
                    © 2026 HotelFlow. Todos los derechos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

    await transporter.sendMail({
        from: '"HotelFlow" <perrozuki.lfj@gmail.com>',
        to: destino,
        subject: '🔑 Recuperar contraseña — HotelFlow',
        html
    });
}

module.exports = { enviarCorreoRecuperacion };
