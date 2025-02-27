import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";
import DriveContents from "../../drive-contents";
import { eq } from "drizzle-orm";

async function getAllParents(folderId: number) {
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
  return parents
}

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const paresedFolderId = parseInt(params.folderId);
  if (isNaN(paresedFolderId)) {
    return <div>Invalid folder id</div>;
  }

  //   console.log(params.folderId);
  const filesPromise = await db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, paresedFolderId));
  const foldersPromise = await db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, paresedFolderId));

  const parentsPromise = getAllParents(paresedFolderId);
  const [folders, files, parents] = await Promise.all([
    foldersPromise,
    filesPromise,
    parentsPromise,
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
