import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

// GET all medias for a variant by variant id
export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse,
) => {
    const variantId  = req.params.id;
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: linkResults } = await query.graph({
        entity: 'product_product_variant_mediamodule_media',
        fields: ['media_id'],
        filters: {
            product_variant_id: variantId,
        },
    });

    const mediaIds = linkResults.map((l) => l.media_id);

    const { data: mediaResults } = await query.graph({
        entity: 'media',
        fields: ['*'],
        filters: {
            id: mediaIds,
        },
    });

    res.json({ media: mediaResults.map((m) => ({
        file_id: m.fileid,
        name: m.name,
        mime_type: m.mimeType,
        is_thumbnail: m.isThumbnail,
        url: m.url,
    })) });
}