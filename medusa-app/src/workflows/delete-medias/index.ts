import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import deleteMediasStep from "./steps/delete-medias";

type DeleteMediasWorkflowInput = {
  mediaIds: string[];
};

const deleteMediasWorkflow = createWorkflow(
  "delete-medias",
  (input: DeleteMediasWorkflowInput) => {
    const result = deleteMediasStep(input);
    return new WorkflowResponse({
      deletedMediaIds: result,
    });
  }
);

export default deleteMediasWorkflow;
