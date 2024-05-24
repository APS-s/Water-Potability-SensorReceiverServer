export class FirebaseConnectionError extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'FirebaseConnectionError';
  }
}
