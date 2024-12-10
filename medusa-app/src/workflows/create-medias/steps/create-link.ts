import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { LinkDefinition } from "@medusajs/framework/types"
import MediaModuleService from "src/modules/media/service";
import { MEDIA_MODULE } from "src/modules/media";
import { CreateMediaInput } from "./create-medias";
import { Modules } from "@medusajs/framework/utils";

export type CreateLinkInput = {
    medias: (CreateMediaInput & { id: string })[];
    variantId: string;
};

const createRemoteLinkStep = createStep(
    'create-remote-link-step',
    async ({ medias, variantId }: CreateLinkInput, { container }) => {
        const remoteLink = container.resolve('remoteLink');
        const links: LinkDefinition[] = [];

        for(const media of medias) {
            links.push({
                [Modules.PRODUCT]: {
                    product_variant_id: variantId,
                },
                [MEDIA_MODULE]: {
                    media_id: media.id,
                },
            });
        };

        await remoteLink.create(links);

        return new StepResponse(links, links);
    },
    async (links, { container }) => {
        if (!links?.length) {
            return
        };
        const remoteLink = container.resolve('remoteLink');
        await remoteLink.dismiss(links);
    },
);

export default createRemoteLinkStep;