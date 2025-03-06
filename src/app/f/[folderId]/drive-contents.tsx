"use client";
import { ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import { addFolder } from "~/server/actions";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { set } from "zod";
export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];

  currentFolderId: number;
}) {
  const navigate = useRouter();
  const pathName = usePathname();
  const user = useUser();
  const [folderName, setFolderName] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false); // State to control dialog visibility

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/f/1" className="mr-2 text-gray-300 hover:text-white">
              My Drive
            </Link>
            {props.parents.map((folder) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                // handleFolderClick={()=>{}}
              />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
        <div className="mt-3 flex justify-end gap-4">
          <UploadButton
            endpoint="driveUploader"
            onClientUploadComplete={() => {
              navigate.refresh();
            }}
            input={{ folderId: props.currentFolderId }}
          />
          {/* <Button
            onClick={() => {
              if (!user.user) {
                return new Error("you are not logged in");
              }
              console.log(pathName);
              console.log(user.user?.id);

              const parts = pathName.split("/");
              const folderId = parts.pop();
              addFolder("test", props.currentFolderId, user.user?.id);
            }}
            className="h-10 bg-slate-700"
          >
            Create Folder
          </Button> */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 bg-slate-700">Create Folder</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Folder</DialogTitle>
                
              </DialogHeader>
              <div className="flex gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Folder Name:
                  </Label>
                  <Input
                    id="name"
                    value={folderName}
                    className="col-span-3"
                    onChange={(e) => setFolderName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={async(e) => {
                    if (!user.user) {
                      return new Error("you are not logged in");
                    }
                    
                    await addFolder(folderName, props.currentFolderId, user.user?.id);
                    setIsOpen(false)
                    navigate.refresh();
                  }}
                  disabled={!folderName}
                  type="submit"
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
