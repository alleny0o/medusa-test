import { FocusModal, Button } from "@medusajs/ui";
import Dropzone from "./dropzone";
import { Media } from "../../widgets/variant-media";

type EditMediaModalProps = {
  medias: Media[];
  setMedias: any;
}

export const EditMediaModal = ({
  medias,
  setMedias,
}: EditMediaModalProps) => {
  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button size="small" variant="secondary">Edit</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <div className="space-x-2">
            <Button size="small" variant="secondary">Cancel</Button>
            <Button size="small">Save</Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16 w-[92%] max-w-xl m-auto">
            <Dropzone medias={medias} setMedias={setMedias} />
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};
