import { FormEvent, useEffect, useState } from "react";
import { getAnalytics, getLinkObj, getLinks, isValidUrl, urlShorten } from "./utils";
import { Analytics, Link } from "./types";
import useInput from "./hooks/useInput";
import LinkItem from "./components/LinkItem";
import Button from "./components/Button";
import AnalyticsPopup from "./components/Analytics";

function App() {
  const [links, setLinks] = useState<Link[]>([]);
  const [linkInputValue, onLinkInputChange, clearLinkInput] = useInput();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    getLinks()
      .then(setLinks)
      .catch(() => {
        alert("Failed to load links data. Try again");
      });
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>  ) => {
    e.preventDefault();
    const isValid = isValidUrl(linkInputValue);
    if (!isValid) {
      return alert("Url is not valid!");
    }
    try {
      const { id: shortLinkId } = await urlShorten(linkInputValue);
      setLinks(prev => [...prev, getLinkObj(shortLinkId, linkInputValue)]);
      clearLinkInput();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again");
    }
  }

  return (
    <div className="w-full h-full flex justify-center p-4 gap-3">
      <div className="w-xl max-w-full flex flex-col gap-3">
        <form className="w-full flex flex-row gap-3 h-10" onSubmit={onSubmit}>
          <input
            value={linkInputValue}
            onChange={onLinkInputChange}
            name="link"
            type="text"
            placeholder="Enter link here"
            className="flex flex-1 bg-white border-none outline-none p-2 rounded-md placeholder:text-gray-400"
          />
          <Button>Shorten URL</Button>
        </form>
        {
          links.map((link) => <LinkItem
              key={link.id}
              link={link}
              onLinkDeleted={(linkId) => setLinks(prev => prev.filter(({ id }) => id !== linkId))}
              onStatsClick={() => {
                getAnalytics(link.id)
                  .then(setAnalytics)
                  .catch(err => {
                    console.error(err);
                    alert("Analytics loading failed. Try again");
                  });
                }
              }
            />
          )
        }
      </div>
      {analytics && <AnalyticsPopup analytics={analytics} onClose={() => setAnalytics(null)} />}
    </div>
  )
}

export default App;
