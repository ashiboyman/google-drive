import { auth } from "@clerk/nextjs/server";
import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const paresedFolderId = parseInt(params.folderId);
  if (isNaN(paresedFolderId)) {
    return <div>Invalid folder id</div>;
  }
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }
  //   console.log(params.folderId);

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(paresedFolderId,session.userId),
    QUERIES.getFiles(paresedFolderId,session.userId),
    QUERIES.getAllParentsForFolder(paresedFolderId,session.userId),
  ]);

  return (
    <DriveContents
      files={files}
      folders={folders}
      parents={parents}
      currentFolderId={paresedFolderId}
    />
  );
}
