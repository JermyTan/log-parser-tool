import React, { useEffect, useState } from "react";
import { Container, Segment } from "semantic-ui-react";
import { useQuery } from "../../../utils/custom-hooks";
import { URL_QUERY } from "../../../utils/constants";
import "./index.scss";

function LogInfoPage() {
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const query = useQuery();

  useEffect(() => {
    setLoading(true);
    const url = query.get(URL_QUERY);

    if (url) {
      window.open(url, "_blank");
    } else {
      setInvalid(true);
    }

    setLoading(false);
  }, [query]);

  return (
    <main>
      <Container className="log-info-container">
        <h1 className="log-info-header">Log Information</h1>
        <Segment
          className="log-info-loader"
          size="massive"
          basic
          placeholder
          content={invalid ? "Invalid log" : ""}
          textAlign="center"
          loading={loading}
          raised
        />
      </Container>
    </main>
  );
}

export default LogInfoPage;
