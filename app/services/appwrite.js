import { Client, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io//v1') // Your Appwrite Endpoint
  .setProject('667978f100298ba15c44'); // Your project ID

const databases = new Databases(client);

export { client, databases };
