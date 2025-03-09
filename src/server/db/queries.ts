import "server-only";

import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
  type DB_FileType,
} from "~/server/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export const QUERIES = {
  getFolders: async function (folderId: number,userId: string) {
    
    return db
      .select()
      .from(foldersSchema)
      .where(
        and(
          eq(foldersSchema.parent, folderId),
          eq(foldersSchema.ownerId, userId),
        ),
      )
      .orderBy(foldersSchema.id);
  },
  getFiles: function (folderId: number,userId: string) {
    return db
      .select()
      .from(filesSchema)
      .where(and(eq(filesSchema.parent, folderId),eq(filesSchema.ownerId, userId)))
      .orderBy(filesSchema.id);
  },
  getAllParentsForFolder: async function (folderId: number,userId: string) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(foldersSchema)
        .where(and(eq(foldersSchema.id, currentId),eq(foldersSchema.ownerId, userId)));

      if (!folder[0]) {
        return redirect("/404");
      }
      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },
  getFolderById: async function (folderId: number) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId));
    return folder[0];
  },

  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(
        and(eq(foldersSchema.ownerId, userId), isNull(foldersSchema.parent)),
      );
    return folder[0];
  },
};

export const MUTATIONS = {
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
      ownerId: input.userId,
    });
  },
  // createFolder: async function(name:string, parentId:number ,userId: string){
  //   return await db.insert(foldersSchema).values({
  //     name: name,
  //     parent: parentId,
  //     ownerId:userId
  //   })
  // },

  onboardUser: async function (userId: string) {
    const rootFolder = await db
      .insert(foldersSchema)
      .values({
        name: "Root",
        parent: null,
        ownerId: userId,
      })
      .$returningId();

    const rootFolderId = rootFolder[0]!.id;

    await db.insert(foldersSchema).values([
      {
        name: "Trash",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Shared",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Documents",
        parent: rootFolderId,
        ownerId: userId,
      },
    ]);

    return rootFolderId;
  },
};
