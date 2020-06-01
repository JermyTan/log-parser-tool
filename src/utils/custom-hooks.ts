import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { URL_QUERY } from "./constants";
import axios from "axios";
import AdmZip from "adm-zip";
import arrayBufferToBuffer from "arraybuffer-to-buffer";

type LoadingState = {
  loading: boolean;
  pendingLoads: number;
};

function decrypt(data: string) {
  if (data.startsWith("{")) {
    data = JSON.parse(data).content;
  }
  const decrypted = unescape(Buffer.from(data, "base64").toString());
  return JSON.stringify(JSON.parse(decrypted), null, 2);
}

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function useLogs(): [LoadingState, boolean, any] {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    loading: false,
    pendingLoads: 0,
  });
  const [invalid, setInvalid] = useState(false);
  const [logs, setLogs] = useState<any>({});
  const query = useQuery();

  useEffect(() => {
    const url = query.get(URL_QUERY);
    console.log(url);
    if (url) {
      setLoadingState({ ...loadingState, loading: true });
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
          var pendingLoads = 0;
          zipEntries.forEach((value) => {
            const fileName = value.name.endsWith(".gg")
              ? value.name.replace(".gg", ".log")
              : value.name;
            pendingLoads += 1;
            setLoadingState({
              ...loadingState,
              pendingLoads: pendingLoads,
            });
            zip.readAsTextAsync(value, (data) => {
              if (value.name.endsWith(".gg")) {
                data = decrypt(data);
              }
              results[fileName] = data;
              pendingLoads -= 1;
              setLogs({ ...results });
              setLoadingState({
                ...loadingState,
                pendingLoads: pendingLoads,
              });
              console.log("Number of lines:", data.split("\n").length);
              console.log(results);
            });
          });
        })
        .catch(() => setInvalid(true))
        .finally(() => setLoadingState({ ...loadingState, loading: false }));
    } else {
      setInvalid(true);
    }
  }, []);

  return [loadingState, invalid, logs];
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
