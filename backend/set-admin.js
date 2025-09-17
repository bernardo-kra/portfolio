import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, 'config.env') });

// Inicializar Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function setAdminUser() {
  try {
    const adminEmail = 'bernardo@kraczkowski.com';
    const adminPassword = '123456';
    
    console.log('🔧 Configurando usuário admin...');
    
    // Verificar se o usuário já existe no Firestore
    const userRef = db.collection('users').doc(adminEmail);
    const userDoc = await userRef.get();
    
    let firebaseUser;
    
    try {
      // Tentar buscar o usuário no Firebase Auth
      firebaseUser = await auth.getUserByEmail(adminEmail);
      console.log('✅ Usuário encontrado no Firebase Auth');
    } catch (error) {
      // Se não existir, criar no Firebase Auth
      console.log('🔨 Criando usuário no Firebase Auth...');
      firebaseUser = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: 'Bernardo Kraczkowski',
      });
      console.log('✅ Usuário criado no Firebase Auth');
    }
    
    // Atualizar/criar no Firestore
    const userData = {
      firstName: 'Bernardo',
      lastName: 'Kraczkowski',
      email: adminEmail,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await userRef.set(userData);
    console.log('✅ Dados do usuário atualizados no Firestore');
    
    console.log('🎉 Configuração de admin concluída!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Senha:', adminPassword);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao configurar admin:', error);
    process.exit(1);
  }
}

setAdminUser();
