#!/usr/bin/env node

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupAdmin() {
  console.log('🔧 Configuração do Admin - Portfolio Backend\n');
  
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Variáveis de ambiente obrigatórias não encontradas:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      console.error('\n💡 Configure as variáveis de ambiente primeiro!');
      process.exit(1);
    }
    
    // Inicializar Firebase
    console.log('🔥 Inicializando Firebase...');
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
    
    initializeApp({
      credential: cert(serviceAccount)
    });
    
    const db = getFirestore();
    console.log('✅ Firebase conectado com sucesso!');
    
    // Coletar dados do admin
    console.log('\n📝 Dados do Administrador:');
    const email = await question('Email: ');
    const firstName = await question('Nome: ');
    const lastName = await question('Sobrenome: ');
    const password = await question('Senha: ');
    
    // Hash da senha
    console.log('\n🔐 Criptografando senha...');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Salvar no Firestore
    console.log('💾 Salvando dados no Firestore...');
    await db.collection('users').doc(email).set({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      lastLogin: null
    });
    
    console.log('\n✅ Admin criado com sucesso!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Nome: ${firstName} ${lastName}`);
    console.log(`🔑 Role: admin`);
    
  } catch (error) {
    console.error('\n❌ Erro ao configurar admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupAdmin();
