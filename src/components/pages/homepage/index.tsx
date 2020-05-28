import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Segment,
  Form,
  Grid,
  Icon,
  Header,
} from "semantic-ui-react";
import { URL_QUERY } from "../../../utils/constants";
import "./index.scss";

function Homepage() {
  const [gfsServerUrl, setGfsServerUrl] = useState("");
  const [gfsFilename, setGfsFilename] = useState("");
  const [requestorId, setRequestorId] = useState("");
  const [gfsToken, setGfsToken] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const allFieldsFilled = () =>
    gfsServerUrl !== "" &&
    gfsFilename !== "" &&
    requestorId !== "" &&
    gfsToken !== "";

  const withHttp = (url: string) =>
    url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) =>
      schemma ? match : `http://${nonSchemmaUrl}`
    );

  const onProcess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      history.push(
        `/log?${URL_QUERY}=${withHttp(
          gfsServerUrl
        )}/download/${gfsFilename}?userid=${requestorId}%26token=${gfsToken}`
      );
    }, 1000);
  };

  return (
    <main className="homepage">
      <Container>
        <Segment padded raised secondary>
          <Grid columns="2" relaxed stackable verticalAlign="middle">
            <Grid.Column>
              <Form>
                <Form.Input
                  label="GFS Server URL"
                  required
                  placeholder="https://f.haiserve.com"
                  value={gfsServerUrl}
                  onChange={(event, data) => setGfsServerUrl(data.value.trim())}
                />
                <Form.Input
                  label="GFS Filename"
                  required
                  placeholder="6ba213f000..."
                  value={gfsFilename}
                  onChange={(event, data) => setGfsFilename(data.value.trim())}
                />
                <Form.Input
                  label="Requestor's SeaTalk User ID"
                  required
                  placeholder="12345"
                  value={requestorId}
                  onChange={(event, data) => setRequestorId(data.value.trim())}
                />
                <Form.Input
                  label="GFS Token"
                  required
                  value={gfsToken}
                  onChange={(event, data) => setGfsToken(data.value.trim())}
                />
                <Form.Button
                  primary
                  content="Process"
                  fluid
                  disabled={!allFieldsFilled()}
                  loading={loading}
                  onClick={onProcess}
                />
              </Form>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Icon
                className="homepage-icon"
                name="file alternate"
                size="massive"
              />
              <Header as="h1">Log Parser Tool</Header>
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    </main>
  );
}

export default Homepage;
