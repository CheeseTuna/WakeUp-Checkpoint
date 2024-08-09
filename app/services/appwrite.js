import { Client, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('667978f100298ba15c44'); 

const databases = new Databases(client);

export { client, databases };
