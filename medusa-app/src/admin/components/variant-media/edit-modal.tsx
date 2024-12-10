import { FocusModal, Button, Heading, Prompt } from "@medusajs/ui";
import Dropzone from "./dropzone";
import { Media } from "../../widgets/variant-media";
import { useState, useEffect } from "react";

type EditMediaModalProps = {
  variantId: string;
  medias: Media[];
  setMedias: (medias: Media[]) => void;
}

export const EditMediaModal = ({
  variantId,
  medias,
  setMedias,
}: EditMediaModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedMedias, setEditedMedias] = useState<Media[]>([]);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize editedMedias when the modal opens
  useEffect(() => {
    if(isOpen) {
      setEditedMedias(medias);
    }
  }, [isOpen, medias]);

  // Check if the medias have been edited ( order should matter because I am going to implement dnd-kit ltr )
  const areMediasEqual = (medias1: Media[], medias2: Media[]) => {
    if (medias1.length !== medias2.length) return false;
    return medias1.every((media, index) => JSON.stringify(media) === JSON.stringify(medias2[index]));
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (areMediasEqual(medias, editedMedias)) {
      setIsOpen(false);
      setIsSaving(false);
      return;
    } else {
      try {
        // Delete existing medias and files for the specified variant
        const deleteResponse = await fetch(`/admin/variant-medias/variant/${variantId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!deleteResponse.ok) {
          throw new Error('Failed to delete existing medias.');
        }
  
        // Create new medias
        const createResponse = await fetch('/admin/variant-medias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            variant_id: variantId,
            medias: editedMedias.map(media => ({
              file_id: media.fileid,
              name: media.name,
              size: media.size,
              mime_type: media.mimeType,
              is_thumbnail: media.isThumbnail,
              url: media.url,
            })),
          }),
        });
  
        if (!createResponse.ok) {
          throw new Error('Failed to save medias.');
        }
  
        // Update parent state and close modal
        setMedias(editedMedias);
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        // Optionally, display an error message to the user
      } finally {
        setIsSaving(false);
      }
    }
  }

  const handleCancel = () => {
    if (areMediasEqual(medias, editedMedias)) {
      setIsOpen(false);
    } else {
      setShowConfirmPrompt(true);
    };
  };

  const confirmCancel = () => {
    setShowConfirmPrompt(false);
    setMedias(editedMedias);
    setIsOpen(false);
  };

  const closePrompt = () => {
    setShowConfirmPrompt(false);
  };


  return (
    <>
      <FocusModal open={isOpen} onOpenChange={setIsOpen}>
        <FocusModal.Trigger asChild>
          <Button size="small" variant="secondary">Edit</Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header>
            <Heading level="h2">Edit media</Heading>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16 w-[92%] max-w-xl m-auto">
            <Dropzone medias={editedMedias} setMedias={setEditedMedias} />
          </FocusModal.Body>
          <FocusModal.Footer className="flex justify-end space-x-2">
            <Button size="small" variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button size="small" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </FocusModal.Footer>
        </FocusModal.Content>
      </FocusModal>

      {/* Confirmation Prompt */}
      {showConfirmPrompt && (
        <Prompt>
          <Prompt.Trigger asChild>
            {/* Hidden trigger */}
            <span></span>
          </Prompt.Trigger>
          <Prompt.Content>
            <Prompt.Header>
              <Prompt.Title>Unsaved Changes</Prompt.Title>
              <Prompt.Description>
                Are you sure you want to leave this form? You have unsaved changes that will be lost if you exit this form.
              </Prompt.Description>
            </Prompt.Header>
            <Prompt.Footer>
              <Prompt.Cancel onClick={closePrompt}>Cancel</Prompt.Cancel>
              <Prompt.Action onClick={confirmCancel}>Continue</Prompt.Action>
            </Prompt.Footer>
          </Prompt.Content>
        </Prompt>
      )}
    </>
  );
};
