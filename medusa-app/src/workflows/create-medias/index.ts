import { createWorkflow, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import createMediasStep, { CreateMediaInput } from './steps/create-medias';
import createRemoteLinkStep from './steps/create-link';

type CreateMediasWorkflowInput = {
    medias: CreateMediaInput[];
    variantId: string;
};

const createMediasWorkflow = createWorkflow(
    'create-medias',
    (input: CreateMediasWorkflowInput) => {
        const {medias, variantId } = input;

        const { medias: createdMedias } = createMediasStep({ medias });

        createRemoteLinkStep({ medias: createdMedias, variantId });

        return new WorkflowResponse({
            medias: createdMedias,
        });
    },
)

export default createMediasWorkflow;