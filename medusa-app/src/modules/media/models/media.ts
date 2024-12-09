import { model } from "@medusajs/framework/utils";

const Media = model.define('media', {
    id: model.id().primaryKey(),
    fileid: model.text().unique(),
    size: model.number(),
    name: model.text(),
    mimeType: model.text(),
    isThumbnail: model.boolean(),
    url: model.text(),
});

export default Media;