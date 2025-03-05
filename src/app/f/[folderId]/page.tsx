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

  //   console.log(params.folderId);

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFiles(paresedFolderId),
    QUERIES.getFolders(paresedFolderId),
    QUERIES.getAllParentsForFolder(paresedFolderId),
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
