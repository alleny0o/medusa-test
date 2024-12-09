import { Container, DropdownMenu } from "@medusajs/ui";
import { DotsSix, EllipsisHorizontal, StackPerspective, Trash, XMark } from "@medusajs/icons";
import type { Media } from "../../widgets/variant-media";

interface MediaProps {
  media: Media;
}

const Media = ({ media }: MediaProps) => {
  return (
    <Container className="flex justify-between items-center bg-gray-50 p-2 gap-x-2">
      <div className="flex items-center space-x-2">
        <div className="rounded-lg p-1.5 duration-150 transition-bg hover:bg-gray-100 cursor-grab">
          <DotsSix className="text-gray-500" />
        </div>
        <img
          src={media.url}
          alt={media.name}
          className="rounded-lg size-full object-cover object-center h-11 w-9 border"
        />
        <div>
          <p className="text-sm font-normal text-gray-800">{media.name}</p>
          <div className="flex items-center space-x-1">
            <p className="text-xs text-gray-500">
              {(media.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <div className="rounded-lg p-1.5 duration-150 transition-bg hover:bg-gray-100 cursor-pointer">
                    <EllipsisHorizontal className="text-gray-500" />
                </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item
                    className="gap-x-2"
                >
                    <StackPerspective className="text-ui-fg-subtle" />
                    Make thumbnail
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item className="gap-x-2">
                    <Trash className="text-ui-fg-subtle" />
                    Delete
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
        <button
            type="button"
            className="rounded-lg p-1.5 duration-150 transition-bg hover:bg-gray-100"
            aria-label={`Remove ${media.name}`}
        >
            <XMark className="text-gray-500" />
        </button>
      </div>
    </Container>
  );
};

export default Media;
