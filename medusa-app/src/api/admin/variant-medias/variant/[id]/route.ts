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
        entity: 'product_variant',
        fields: ['media.*'],
        filters: {
            id: variantId,
        },
    });

    const mediaResults = linkResults[0]?.media ?? [];

    res.json({ media: mediaResults.map((m) => {
        if (!m) return null;
        return {
            file_id: m.fileid,
            name: m.name,
            mime_type: m.mimeType,
            is_thumbnail: m.isThumbnail,
            url: m.url,
            size: m.size,
        };
    }).filter(Boolean) 
});
}

import deleteMediasWorkflow from "src/workflows/delete-medias";
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows";

export const DELETE = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse,
) => {
    const variantId = req.params.id;
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    try {
        // Fetch linked media IDs for the variant
        const { data: linkResults } = await query.graph({
            entity: "product_variant",
            fields: ["media.*"], // Include all media fields for flexibility
            filters: {
                id: variantId,
            },
        });

        // Validate `linkResults` structure
        if (!Array.isArray(linkResults) || linkResults.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "No variant found with the specified ID." });
        }

        // Extract and validate media IDs
        const media = linkResults[0]?.media || [];
        const mediaIds = media
            .filter((m: any) => m && typeof m.id !== "undefined") // Ensure each media object exists and has an `id`
            .map((m: any) => m.id); // Safely map to `id`

        if (mediaIds.length === 0) {
            return res
                .json({ success: false, message: "No media found for the specified variant." });
        }

        // Run the deletion workflows
        await deleteFilesWorkflow(req.scope).run({
            input: {
                ids: mediaIds, // Ensure this matches the expected input
            },
        });

        await deleteMediasWorkflow(req.scope).run({
            input: {
                mediaIds, // Ensure this matches the expected input
                variantId: variantId,
            },
        });

        // Respond with success
        res.json({
            success: true,
            message: "Media and associated files deleted successfully.",
        });
    } catch (error) {
        // Log and handle errors gracefully
        console.error("Error during DELETE operation:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting media.",
            error: error.message,
        });
    }
};
