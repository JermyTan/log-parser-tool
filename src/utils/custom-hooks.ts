import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { URL_QUERY } from "./constants";
import axios from "axios";
import AdmZip from "adm-zip";
import arrayBufferToBuffer from "arraybuffer-to-buffer";

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function useLogs(): [boolean, boolean, any] {
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [logs, setLogs] = useState<any>({});
  const query = useQuery();

  useEffect(() => {
    const url = query.get(URL_QUERY);
    console.log(url);
    if (url) {
      setLoading(true);
      axios
        .get(`https://cors-anywhere.herokuapp.com/${url}`, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          const zip = new AdmZip(arrayBufferToBuffer(response.data));
          const zipEntries = zip.getEntries();
          const results: any = {};
          zipEntries.forEach((value) => {
            const fileName = value.name.endsWith(".gg")
              ? value.name.replace(".gg", ".log")
              : value.name;
            results[fileName] = undefined;
            zip.readAsTextAsync(value, (data) => {
              if (fileName === "log.log") {
                if (data.startsWith("{")) {
                  data = JSON.parse(data).content;
                }
                const decrypted = unescape(
                  Buffer.from(data, "base64").toString()
                );
                data = JSON.stringify(JSON.parse(decrypted), null, 2);
              }
              console.log(data.split("\n").length);
              results[fileName] = data;
              console.log(results);
              setLogs({ ...results });
            });
          });
          setLogs({ ...results });
        })
        .catch(() => setInvalid(true))
        .finally(() => setLoading(false));
    } else {
      setInvalid(true);
    }
  }, []);

  return [loading, invalid, logs];
}

/*
              let blob = new Blob([data?.buffer as BlobPart], {
                type: "text/plain",
              });
              let fileReader = new FileReader();
              fileReader.onload = (event) => {
                results[value.name] = event.target?.result;
                setLogs({ ...results });
                console.log(results);
              };
              fileReader.readAsText(blob);
              */
