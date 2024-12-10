import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";   
import { MEDIA_MODULE } from "src/modules/media";
import { Modules } from "@medusajs/framework/utils";

interface DeleteMediasStepInput {
    mediaIds: string[];
    variantId: string;
}

const createLinkDefsStep = createStep(
    'create-link-defs-step',
    async ({ mediaIds, variantId }: DeleteMediasStepInput, { container }) => {

        const linkDefs = mediaIds.map((mediaId) => ({
            [Modules.PRODUCT]: {
                product_variant_id: variantId,
            },
            [MEDIA_MODULE]: {
                media_id: mediaId,
            },
        }));

        return new StepResponse(linkDefs);
    },
    async (linkDefs, { container }) => {
        // No compensation needed
    }
)

export default createLinkDefsStep;