import { createWorkflow, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { createRemoteLinkStep } from '@medusajs/medusa/core-flows';
import createMediasStep, { CreateMediaInput } from './steps/create-medias';
import { Modules } from '@medusajs/framework/utils';
import { MEDIA_MODULE } from 'src/modules/media';

type CreateMediasWorkflowInput = {
    medias: CreateMediaInput[];
    variantId: string;
};

const createMediasWorkflow = createWorkflow(
    'create-medias',
    (input: CreateMediasWorkflowInput) => {
        const {medias, variantId } = input;

        const { medias: createdMedias } = createMediasStep({ medias });

        // Ensure createdMedias is an array
        const mediaArray = Array.isArray(createdMedias) ? createdMedias : [createdMedias];

        createRemoteLinkStep([{
            [Modules.PRODUCT]: {
                product_variant_id: variantId,
            },
            [MEDIA_MODULE]: {
                media_ids: mediaArray.map((media) => media.id),
            }
        }]);

        return new WorkflowResponse({
            medias: mediaArray,
        });
    },
)

export default createMediasWorkflow;