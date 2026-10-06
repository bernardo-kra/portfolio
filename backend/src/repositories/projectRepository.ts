import { db } from '../config/firebase.js';

export async function listProjects() {
  const snapshot = await db.collection('projects').get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createProject(data: Record<string, unknown>) {
  return db.collection('projects').add(data);
}

export async function findProject(id: string) {
  return db.collection('projects').doc(id).get();
}

export async function updateProject(id: string, data: Record<string, unknown>) {
  await db.collection('projects').doc(id).update(data);
  return db.collection('projects').doc(id).get();
}

export async function deleteProject(id: string) {
  await db.collection('projects').doc(id).delete();
}
