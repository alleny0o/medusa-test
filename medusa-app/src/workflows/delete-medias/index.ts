import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import deleteMediasStep from "./steps/delete-medias";
import createLinkDefsStep from "./steps/create-link-defs";
import { Modules } from "@medusajs/framework/utils";
import { MEDIA_MODULE } from "src/modules/media";
import { dismissRemoteLinkStep } from "@medusajs/medusa/core-flows";

export type DeleteMediasWorkflowInput = {
  mediaIds: string[];
  variantId: string;
};

const deleteMediasWorkflow = createWorkflow(
  "delete-medias",
  (input: DeleteMediasWorkflowInput) => {
    const result = deleteMediasStep(input);

    const linkDefinitions = createLinkDefsStep({
      mediaIds: input.mediaIds,
      variantId: input.variantId,
    });

    dismissRemoteLinkStep(linkDefinitions);

    return new WorkflowResponse({
      deletedMediaIds: result,
    });
  }
);

export default deleteMediasWorkflow;
