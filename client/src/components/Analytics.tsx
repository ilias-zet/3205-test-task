import { Analytics } from "../types";
import Button from "./Button";

interface AnalyticsPopupPorps {
  analytics: Analytics;
  onClose: () => void;
}

export default function AnalyticsPopup({ analytics: { clickCount, lastClickedBy }, onClose }: AnalyticsPopupPorps) {
  return (
    <div onClick={onClose} className="w-full h-full bg-black/40 absolute top-0 right-0 flex items-center justify-center p-4">
      <div onClick={e => e.stopPropagation()} className="flex flex-col gap-2 w-md max-w-full rounded-lg bg-white p-3">
        <span className="text-2xl font-bold">Analytics</span>
        <div>
          <div>Click count: {clickCount}</div>
          <div>Last clicked by:</div>
          <div className="flex flex-col min-h-10 text-nowrap items-center justify-center rounded-lg overflow-hidden mt-1 bg-blue-100">
            {
              lastClickedBy.length
                ? lastClickedBy.map(({ ip, date }, idx) => (
                  <div key={idx} className="w-full h-10 flex items-center justify-between px-2 even:bg-blue-50">
                    <span className="overflow-hidden overflow-ellipsis">{ip}</span>
                    <span className="overflow-hidden overflow-ellipsis text-blue-400">{new Date(date).toLocaleDateString('default', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
                : <span className="overflow-hidden overflow-ellipsis">No one has clicked on the link yet</span>
            }
          </div>
        </div>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}
