import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowDownTray } from "@medusajs/icons";
import { Media as VariantMedia } from "../../widgets/variant-media";
import { FileDTO } from "@medusajs/framework/types";
import Media from "./media";

type DropzoneProps = {
  medias: VariantMedia[];
  setMedias: any;
};

function Dropzone({ medias, setMedias }: DropzoneProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const formData = new FormData();
      acceptedFiles.forEach((file: File) => {
        formData.append("files", file);
      });

      const { files }: { files: FileDTO[] } = await fetch(
        "/admin/variant-medias/upload",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      ).then((res) => res.json());

      const newFiles: VariantMedia[] = acceptedFiles.map(
        (file: File, index: number) => {
          return {
            fileid: files[index]?.id,
            name: file.name,
            size: file.size,
            mimeType: file.type,
            isThumbnail: false,
            url: files[index]?.url || "",
          };
        }
      );

      setMedias((currentMedias: VariantMedia[]) => [
        ...currentMedias,
        ...newFiles,
      ]);
    },
    [setMedias]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
        {medias.map((media: VariantMedia) => (
          <Media key={media.fileid} media={media} />
        ))}
      </div>
    </>
  );
}

export default Dropzone;
