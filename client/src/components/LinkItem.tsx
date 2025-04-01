import { Link } from "../types";
import IconButton from "./IconButton";
import TrashIcon from "../assets/icons/trash-icon.svg?react";
import CopyIcon from "../assets/icons/copy-icon.svg?react";
import CopiedIcon from "../assets/icons/copied-icon.svg?react";
import StatsIcon from "../assets/icons/stats-icon.svg?react";
import { urlDelete } from "../utils";
import useCopy from "../hooks/useCopy";

interface LinkItemProps {
  link: Link;
  onLinkDeleted: (linkId: string) => void;
  onStatsClick: (linkId: string) => void;
}

export default function LinkItem({ link: { id, originalUrl, href, shortUrl }, onLinkDeleted, onStatsClick }: LinkItemProps) {
  const [copiedLinkId, copyLink] = useCopy();

  const deleteClickHandler = async (shortLinkId: string) => {
    try {
      urlDelete(shortLinkId);
      onLinkDeleted(shortLinkId)
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again");
    }
  }

  return (
    <div className="h-10 bg-white flex items-center justify-between rounded-md px-2">
      <div className="text-gray-500 text-nowrap overflow-hidden overflow-ellipsis">{originalUrl}</div>
      <div className="flex items-center gap-1.5 overflow-hidden">
        <a className="text-cyan-500 text-nowrap overflow-hidden overflow-ellipsis" href={href}>{shortUrl}</a>
        <div className="flex text-cyan-500">
          <IconButton onClick={() => onStatsClick(id)}>
            <StatsIcon />
          </IconButton>
          <IconButton onClick={() => copyLink(id, href)}>
            {
              copiedLinkId === id
                ? <CopiedIcon />
                : <CopyIcon />
            }
          </IconButton>
          <IconButton className="text-red-500" onClick={() => deleteClickHandler(id)}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
