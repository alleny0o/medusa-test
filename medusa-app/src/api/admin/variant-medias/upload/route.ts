import { AuthenticatedMedusaRequest, MedusaResponse  } from "@medusajs/framework/http";
import { uploadFilesWorkflow, deleteFilesWorkflow } from "@medusajs/medusa/core-flows";
import { MedusaError } from "@medusajs/framework/utils";

// Upload files
export const POST = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
  ) => {
    const input = req.files as Express.Multer.File[]
  
    if (!input?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No files were uploaded"
      )
    }
  
    const { result } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: input?.map((f) => ({
          filename: f.originalname,
          mimeType: f.mimetype,
          content: f.buffer.toString("binary"),
          access: 'public',
        })),
      },
    })
  
    res.status(200).json({ files: result })
};

// Delete files
type DeleteRequestBody = {
  fileIds: string[];
};

export const DELETE = async (
  req: AuthenticatedMedusaRequest<DeleteRequestBody>,
  res: MedusaResponse,
) => {
  const fileIds = req.body.fileIds;

  if (!fileIds?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "No file IDs provided for deletion"
    );
  };

  await deleteFilesWorkflow(req.scope).run({
    input: {
      ids: fileIds,
    },
  });

  res.status(200).json({ success: true });
};