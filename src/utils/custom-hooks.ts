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

export function useStateWithCallback<T>(
  initialState: T
): [T, (value: T, callback?: (value: T) => void) => void] {
  const [state, setState] = useState<{
    value: T;
    callback?: (value: T) => void;
  }>({ value: initialState });

  useEffect(() => {
    const { callback, value } = state;
    callback?.(value);
  }, [state]);

  return [
    state.value,
    (value: T, callback?: (value: T) => void) => setState({ value, callback }),
  ];
}

async function loadLogs(
  zippedLogsBuffer: Buffer,
  setLogs: (newValue: any) => void
) {
  const zip = new AdmZip(zippedLogsBuffer);
  const zipEntries = zip
    .getEntries()
    .filter(
      (entry) =>
        entry.name.startsWith("app") ||
        entry.name.startsWith("core") ||
        entry.name.startsWith("log") ||
        entry.name.startsWith("net") ||
        entry.name.startsWith("state") ||
        entry.name.startsWith("profile")
    )
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
      console.log(results);
    });
  });
  setLogs({ ...results });
}

export function useLogsFromUpload(zipFile?: File): [boolean, boolean, any] {
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [logs, setLogs] = useState<any>({});

  useEffect(() => {
    if (zipFile) {
      try {
        const fileReader = new FileReader();
        fileReader.onload = () =>
          loadLogs(
            arrayBufferToBuffer(fileReader.result),
            setLogs
          ).finally(() => setLoading(false));
        fileReader.readAsArrayBuffer(zipFile);
      } catch {
        setInvalid(true);
        setLoading(false);
      }
    } else {
      setInvalid(false);
      setLoading(true);
    }
  }, [zipFile]);

  return [loading, invalid, logs];
}

export function useLogsFromUrl(): [boolean, boolean, any] {
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [logs, setLogs] = useState<any>({});
  const query = useQuery();

  useEffect(() => {
    const url = query.get(URL_QUERY);
    const proxyServerUrl = "https://cors-anywhere-server.herokuapp.com";
    console.log("Download url:", url);
    console.log("Proxy server url:", proxyServerUrl);
    if (url) {
      axios
        .get(`${proxyServerUrl}/${url}`, {
          responseType: "arraybuffer",
        })
        .then((response) =>
          loadLogs(arrayBufferToBuffer(response.data), setLogs)
        )
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
