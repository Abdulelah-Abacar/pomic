import { databases } from "./config";
import { ID } from "appwrite";

const db = {};

const collections = [
  {
    dbId: "673cd0f0002e8a682dec",
    id: "673cd10b001a5d53adf1",
    name: "playlist",
  },
  {
    dbId: "673cd0f0002e8a682dec",
    id: "673cd133002e7ef68f97",
    name: "user",
  },
];

collections.forEach((col) => {
  db[col.name] = {
    create: (payload, permissions, id = ID.unique()) =>
      databases.createDocument(col.dbId, col.id, id, payload, permissions),
    update: (id, payload, permissions) =>
      databases.updateDocument(col.dbId, col.id, id, payload, permissions),
    delete: (id) => databases.deleteDocument(col.dbId, col.id, id),

    list: (queries = []) => databases.listDocuments(col.dbId, col.id, queries),

    get: (id) => databases.getDocument(col.dbId, col.id, id),
  };
});

export default db;
