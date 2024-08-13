import { Account, Client, ID, Avatars, Databases, Storage, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.wakeup_checkpoint',
    projectId: '667978f100298ba15c44',
    databaseId: '66797b11000ca7e40dcc',
    userCollectionId: '66797b6f00391798a93b',
    audioCollectionId: '66797ba40026e00acb05',
    storageId: '66797e7300097c89a30e'
};

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await logIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        );

        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const logIn = async (email, password) => {
    try {
       
        const sessions = await account.listSessions();

        
        for (const session of sessions.sessions) {
            await account.deleteSession(session.$id);
        }

      
        const session = await account.createEmailPasswordSession(email, password);
        return session;

    } catch (error) {
        throw new Error(error);
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
};

export const getUserData = async () => {
    try {
        const user = await account.get();
        return user;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};
