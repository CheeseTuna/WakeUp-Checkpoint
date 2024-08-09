import { Client, Databases, Account } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('667978f100298ba15c44'); 

const databases = new Databases(client);
const account = new Account(client);

export { client, databases, account };
