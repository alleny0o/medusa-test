import { z } from 'zod';
import createMediasWorkflow from 'src/workflows/create-medias';
import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { createMediasSchema } from 'src/api/validation-schemas';
import { CreateMediaInput } from 'src/workflows/create-medias/steps/create-medias';


type CreateRequestBody = z.infer<
    typeof createMediasSchema
>;

// Create new medias
export const POST = async (
    req: AuthenticatedMedusaRequest<CreateRequestBody>,
    res: MedusaResponse,
) => {
    const { result } = await createMediasWorkflow(
        req.scope
    ).run({
        input: {
            medias: req.validatedBody.medias.map(media => ({
                fileid: media.file_id,
                name: media.name,
                size: media.size,
                mimeType: media.mime_type,
                isThumbnail: media.is_thumbnail,
                url: media.url,
            })) as CreateMediaInput[],
            variantId: req.validatedBody.variant_id,
        }
    })

    res.json(result);
};