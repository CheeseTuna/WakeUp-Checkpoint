appwrite.test.js
import { client, databases } from '../app/services/appwrite';

describe('Appwrite Service', () => {
  test('should initialize Appwrite client with correct endpoint and project ID', () => {
    expect(client.config.endpoint).toBe('https://cloud.appwrite.io/v1');
    expect(client.config.project).toBe('667978f100298ba15c44');
  });

  test('databases object should be defined', () => {
    expect(databases).toBeDefined();
  });
});
