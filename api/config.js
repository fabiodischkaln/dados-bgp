// api/config.js
// Endpoint seguro que entrega a configuração pública do Firebase ao frontend
// A chave ANTHROPIC_API_KEY nunca é entregue aqui

export default function handler(req, res) {
  // Estas são seguras para expor (Firebase config é pública por design)
  // A proteção real vem das Regras de Segurança do Firestore
  res.status(200).json({
    apiKey:            process.env.FIREBASE_API_KEY,
    authDomain:        process.env.FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.FIREBASE_PROJECT_ID,
    storageBucket:     process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.FIREBASE_APP_ID,
    adminEmail:        process.env.ADMIN_EMAIL,
  });
}
