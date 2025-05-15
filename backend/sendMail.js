
import { MailtrapClient } from "mailtrap";

const TOKEN = "afe3887d46d1038ab80b1865e2013c3d";

const client = new MailtrapClient({ token: TOKEN });

await client
  .send({
    from: {
      email: "hello@demomailtrap.co",
      name: "404.js Project",
    },
    to: [{ email: "iken11bilal@gmail.com" }],
    subject: "🎉 Test Mailtrap Email API",
    text: "Ceci est un email de test depuis Mailtrap avec l'API.",
    category: "Integration Test",
  })
  .then(() => console.log("✅ Email envoyé avec succès"))
  .catch((err) => console.error("❌ Erreur d'envoi :", err));
