import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaModuleService from "src/modules/media/service";
import { MEDIA_MODULE } from "src/modules/media";
import { promiseAll } from "@medusajs/framework/utils";

const deleteMediasStep = createStep(
    'delete-medias-step',
    async ({ mediaIds }: { mediaIds: string[] }, { container }) => {
        const mediaModuleService: MediaModuleService = container.resolve(MEDIA_MODULE);
        
        // Retrieve the media data for each ID before deleting
        const mediasToDelete = await promiseAll(
            mediaIds.map(async (id) => {
                return await mediaModuleService.retrieveMedia(id);
            })
        );
        
        // Delete the media
        await mediaModuleService.deleteMedia(mediaIds);

        // Return the deleted media data for compensation
        return new StepResponse(mediaIds, mediasToDelete);
    },
    async (mediasToRestore, { container }) => {
        const mediaModuleService: MediaModuleService = container.resolve(MEDIA_MODULE);
        await mediaModuleService.createMedia(mediasToRestore);
    }
);

export default deleteMediasStep;