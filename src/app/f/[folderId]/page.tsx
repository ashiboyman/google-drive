import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import DriveContents from "../../drive-contents";
import { eq } from "drizzle-orm";
import {
  getAllParentsForFolder,
  getFiles,
  getFolders,
} from "~/server/db/queries";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const paresedFolderId = parseInt(params.folderId);
  if (isNaN(paresedFolderId)) {
    return <div>Invalid folder id</div>;
  }

  //   console.log(params.folderId);

  const [folders, files, parents] = await Promise.all([
    getFiles(paresedFolderId),
    getFolders(paresedFolderId),
    getAllParentsForFolder(paresedFolderId),
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
