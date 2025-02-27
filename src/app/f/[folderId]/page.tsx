import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";
import DriveContents from "../../drive-contents";
import { eq } from "drizzle-orm";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const paresedFolderId = parseInt(params.folderId);
  if (isNaN(paresedFolderId)) {
    return <div>Invalid folder id</div>;
  }

  //   console.log(params.folderId);
  const files = await db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, paresedFolderId));
  const folders = await db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, paresedFolderId));
  return <DriveContents files={files} folders={folders} />;
}
