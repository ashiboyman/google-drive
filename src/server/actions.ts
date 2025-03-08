"use server";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
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
// export async function deleteFolder(folderId: number) {
//   const session = await auth();
//   if (!session.userId) {
//     throw new Error("Unauthorized");
//   }
//   console.log(`Starting deletion for folder: ${folderId}`);

//   return await db.transaction(async (tx) => {
//     // Fetch all files in the folder
//     const filesInFolder = await tx
//       .select()
//       .from(files_table)
//       .where(and(eq(files_table.parent, folderId), eq(files_table.ownerId, session.userId)));

//     // Fetch all subfolders in the folder
//     const foldersInFolder = await tx
//       .select()
//       .from(folders_table)
//       .where(and(eq(folders_table.parent, folderId), eq(folders_table.ownerId, session.userId)));

//     console.log(`Found ${filesInFolder.length} files and ${foldersInFolder.length} folders in ${folderId}`);

//     // Delete each file using the existing deleteFile function
//     for (const file of filesInFolder) {
//       const result = await deleteFile(file.id);
//       if (result.error) {
//         throw new Error(`Failed to delete file ${file.id}: ${result.error}`);
//       }
//     }

//     console.log("All files deleted successfully.");

//     // Recursively delete all subfolders
//     for (const folder of foldersInFolder) {
//       await deleteFolder(folder.id);
//     }

//     // Delete the folder itself
//     await tx
//       .delete(folders_table)
//       .where(and(eq(folders_table.id, folderId), eq(folders_table.ownerId, session.userId)));

//     console.log(`Deleted folder: ${folderId}`);
//   });
//   // console.log(`Completed fetching folder: ${folderId}`);
//   // const c = await cookies();

//   // c.set("forcere-fresh", JSON.stringify(Math.random()));

//   // return { success: true };
//   // return { files: allFiles, folders: allFolders };
// }
export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }
  console.log(`Starting deletion for folder: ${folderId}`);

  // Fetch all files in the folder
  const filesInFolder = await db
    .select()
    .from(files_table)
    .where(
      and(
        eq(files_table.parent, folderId),
        eq(files_table.ownerId, session.userId),
      ),
    );

  // Fetch all subfolders in the folder
  const foldersInFolder = await db
    .select()
    .from(folders_table)
    .where(
      and(
        eq(folders_table.parent, folderId),
        eq(folders_table.ownerId, session.userId),
      ),
    );

  console.log(
    `Found ${filesInFolder.length} files and ${foldersInFolder.length} folders in ${folderId}`,
  );

  // ✅ First, Recursively Delete Subfolders (Before Starting Transaction)
  for (const folder of foldersInFolder) {
    await deleteFolder(folder.id);
  }

  // ✅ Now, Start Transaction for Atomic Deletion
  const c = await cookies();

  c.set("forcere-fresh", JSON.stringify(Math.random()));
  return await db.transaction(async (tx) => {
    // Delete all files (batch delete)
    if (filesInFolder.length > 0) {
      const fileIds = filesInFolder.map((file) => file.id);
      const fileUrls = filesInFolder.map((file) =>
        file.url.replace("https://utfs.io/f/", ""),
      );

      console.log("Deleting files from storage:", fileUrls);

      // Delete from external storage
      const utapiResult = await utApi.deleteFiles(fileUrls);
      console.log("utApi deletion result:", utapiResult);

      // Delete files from database
      await tx.delete(files_table).where(inArray(files_table.id, fileIds));

      console.log(`Deleted ${filesInFolder.length} files from database.`);
    }

    // Delete the folder itself
    await tx
      .delete(folders_table)
      .where(
        and(
          eq(folders_table.id, folderId),
          eq(folders_table.ownerId, session.userId),
        ),
      );

    console.log(`Deleted folder: ${folderId}`);
  });
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
