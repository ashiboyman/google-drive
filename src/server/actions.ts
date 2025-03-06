"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
  type DB_FileType,
} from "~/server/db/schema";
const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }
  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );
  if (!file) {
    return { error: "File not found" };
  }

  const utapiResult = await utApi.deleteFiles([
    file.url.replace("https://utfs.io/f/", ""),
  ]);
  console.log(utapiResult);

  const dbDeleteResult = await db
    .delete(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );
  console.log(dbDeleteResult);

  const c = await cookies();

  c.set("forcere-fresh", JSON.stringify(Math.random()));

  return { success: true };
}
export async function addFolder(
  name: string,
  parentId: number,
  userId: string,
) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }
  const addFile = await db.insert(foldersSchema).values({
    name: name,
    parent: parentId,
    ownerId: userId,
  });
  console.log(addFile);
  return { success: true };
}
