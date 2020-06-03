import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { URL_QUERY } from "./constants";
import axios from "axios";
import AdmZip from "adm-zip";
import arrayBufferToBuffer from "arraybuffer-to-buffer";

function decrypt(data: string) {
  if (data.startsWith("{")) {
    data = JSON.parse(data).content;
  }
  const decrypted = unescape(Buffer.from(data, "base64").toString());
  //return JSON.stringify(JSON.parse(decrypted), null, 2);
  return JSON.parse(decrypted);
}

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function useLogs(): [boolean, boolean, any] {
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [logs, setLogs] = useState<any>({});
  const query = useQuery();

  useEffect(() => {
    const url = query.get(URL_QUERY);
    console.log(url);
    if (url) {
      axios
        .get(`https://cors-anywhere.herokuapp.com/${url}`, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          const zip = new AdmZip(arrayBufferToBuffer(response.data));
          const zipEntries = zip
            .getEntries()
            .sort((a, b) => a.name.localeCompare(b.name));

          const results: any = {};
          zipEntries.forEach((value) => {
            const fileName = value.name.endsWith(".gg")
              ? value.name.replace(".gg", ".json")
              : value.name;
            results[fileName] = undefined;

            zip.readAsTextAsync(value, (data) => {
              if (value.name.endsWith(".gg")) {
                data = decrypt(data);
              }
              if (value.name.endsWith(".json")) {
                data = JSON.parse(data);
              }
              results[fileName] = data;
              setLogs({ ...results });
              //console.log("Number of lines:", data.split("\n").length);
              console.log(results);
            });
          });
          setLogs({ ...results });
        })
        .catch(() => setInvalid(true))
        .finally(() => setLoading(false));
    } else {
      setInvalid(true);
      setLoading(false);
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
