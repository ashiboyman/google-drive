import "server-only";
import { db } from "~/server/db";
import {
  DB_FileType,
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";
export const QUERIES = {
  //   console.log(params.folderId);
  getFolders: function (folderId: number) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId));
  },
  getFiles: function (folderId: number) {
    return db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId));
  },
  getAllParentsForFolder: async function (folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentId));

      if (!folder[0]) {
        throw new Error("parent folder not found");
      }
      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },
};

export const MUTATJONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return await db.insert(filesSchema).values({
      ...input.file,
      parent: input.file.parent,
    }); 
  },
};
