import { Client, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("673cd0b100335ee2006b");

const databases = new Databases(client);

export { client, databases };
