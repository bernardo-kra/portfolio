import { db } from './dist/config/firebase.js';

async function testDatabase() {
  try {
    console.log('🔥 Testando conexão com Firebase...');
    
    // Adicionar um projeto de teste
    const testProject = {
      title: 'Projeto Teste',
      description: 'Teste de conexão com Firebase',
      technologies: ['React', 'Firebase', 'Node.js'],
      githubUrl: 'https://github.com/test',
      liveUrl: 'https://test.com',
      createdAt: new Date(),
    };

    const docRef = await db.collection('projects').add(testProject);
    console.log('✅ Projeto adicionado com ID:', docRef.id);

    // Buscar todos os projetos
    const snapshot = await db.collection('projects').get();
    console.log(`📊 Total de projetos: ${snapshot.size}`);

    snapshot.forEach(doc => {
      console.log('📄 Projeto:', doc.id, doc.data().title);
    });

    console.log('🎉 Teste concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

testDatabase();





