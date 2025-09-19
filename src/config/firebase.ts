// Firebase temporarily disabled - using backend-only chat
// To enable Firebase, configure the environment variables and uncomment below

let app: any = null;
let db: any = null;
let auth: any = null;

// Firebase is disabled to prevent connection errors
console.log('Firebase chat disabled - using backend-only chat system');

export { db, auth };
export default app;
