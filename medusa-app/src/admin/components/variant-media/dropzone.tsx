// Dropzone.tsx

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowDownTray } from "@medusajs/icons";
import { Media } from "../../widgets/variant-media";
import { FileDTO } from "@medusajs/framework/types";
import MediaItem from "./media";

type DropzoneProps = {
  medias: Media[];
  setMedias: (medias: Media[]) => void;
};

function Dropzone({ medias, setMedias }: DropzoneProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const formData = new FormData();
      acceptedFiles.forEach((file: File) => {
        formData.append("files", file);
      });

      try {
        const response = await fetch("/admin/variant-medias/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload files.');
        }

        const { files }: { files: FileDTO[] } = await response.json();

        // Validate that each file has a valid 'id' and 'url'
        const newFiles: Media[] = files.map((file, index) => {
          if (!file.id || !file.url) {
            console.warn(`File at index ${index} is missing 'id' or 'url'. Skipping.`);
            return null;
          }
          return {
            fileid: file.id,
            name: acceptedFiles[index].name,
            size: acceptedFiles[index].size,
            mimeType: acceptedFiles[index].type,
            isThumbnail: false,
            url: file.url,
          };
        }).filter((file): file is Media => file !== null);

        // Append new media to existing medias
        setMedias([...medias, ...newFiles]);
      } catch (error) {
        console.error(error);
        // Optionally, display an error message to the user
      }
    },
    [medias, setMedias]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDelete = (fileid: string) => {
    const updatedMedias = medias.filter((media) => media.fileid !== fileid);
    setMedias(updatedMedias);
  }

  return (
    <>
      <div
        {...getRootProps({
          className:
            "w-full bg-gray-50 border border-dashed hover:border-blue-500 hover:cursor-pointer rounded-md duration-150 ease-in-out transition-colors px-4 py-8 mb-2",
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-x-1 text-gray-700 mb-1">
            <ArrowDownTray />
            <p>Upload images</p>
          </div>
          <p className="text-center text-xs text-gray-600">
            Drag and drop images here or click to upload.
          </p>
        </div>
      </div>
      <div className="w-full mt-1 space-y-3">
        {medias.map((media: Media) => (
          <MediaItem key={media.fileid} media={media} onDelete={handleDelete} />
        ))}
      </div>
    </>
  );
}

export default Dropzone;
