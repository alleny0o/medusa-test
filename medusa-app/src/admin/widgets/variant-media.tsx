import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  DetailWidgetProps,
  AdminProductVariant,
} from "@medusajs/framework/types";
import { Container, Heading } from "@medusajs/ui";
import { EditMediaModal } from "../components/variant-media/edit-modal";
import { useState, useEffect } from "react";

export type Media = {
  fileid: string;
  name: string;
  size: number;
  mimeType: string;
  isThumbnail: boolean;
  url: string;
}

type ValidatedMedia = {
  file_id: string;
  mime_type: string;
  name: string;
  size: number;
  is_thumbnail: boolean;
  url: string;
}

const VariantMediaWidget = ({
  data,
}: DetailWidgetProps<AdminProductVariant>) => {

  const [initialMedias, setInitialMedias] = useState<Media[]>([]);
  const [medias, setMedias] = useState<Media[]>([]);

  useEffect(() => {

    const fetchMedias = async () => {
      const response = await fetch(`/api/variant-medias/variant/${data.id}`);
      const json: ValidatedMedia[] = await response.json();
      setMedias(json.map((m: ValidatedMedia) => ({
        fileid: m.file_id,
        mimeType: m.mime_type,
        name: m.name,
        size: m.size,
        isThumbnail: m.is_thumbnail,
        url: m.url,
      })));
    };

    fetchMedias();

    // console.log(medias);

  }, []);

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Media</Heading>
        <EditMediaModal medias={medias} setMedias={setMedias} />
      </div>
      {medias.length > 0 && (
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {medias.map((media) => (
            <div key={media.fileid} className="relative h-40 bg-gray-200 rounded-lg">
              <img src={media.url} alt="media" className="w-full h-full object-cover rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      )}
    </Container>
  );
};

export const config = defineWidgetConfig({

  zone: "product_variant.details.after"
});

export default VariantMediaWidget;
