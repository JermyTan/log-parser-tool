import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Icon, Popup } from "semantic-ui-react";
import { saveAs } from "file-saver";
import AdmZip from "adm-zip";

type Props = {
  logs: any;
  className?: string;
};

type CheckedState = {
  [filename: string]: boolean;
};

function DownloadButton({ logs, className }: Props) {
  const [openDownloadSection, setOpenDownloadSection] = useState(false);
  const [checkedState, setCheckedState] = useState<CheckedState>({});
  const [downloading, setDownloading] = useState(false);

  const mapCheckedState = (filenames: string[], checked: boolean) => {
    const newCheckedState: CheckedState = {};
    filenames.forEach((filename) => (newCheckedState[filename] = checked));
    setCheckedState(newCheckedState);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      const zip = new AdmZip();
      Object.entries(checkedState).forEach(([filename, checked]) => {
        if (checked) {
          let content = logs[filename];
          if (typeof content !== "string") {
            content = JSON.stringify(content, null, 2);
          }
          zip.addFile(filename, Buffer.from(content));
        }
      });

      if (zip.getEntries().length > 0) {
        const buffer = zip.toBuffer();
        const blob = new Blob([buffer as BlobPart], {
          type: "application/zip",
        });
        saveAs(blob, "logs.zip");
      }
      setDownloading(false);
    }, 500);
  };

  const hasSelectedFiles = () =>
    Object.values(checkedState).some((checked) => checked);

  const resetCheckedState = () =>
    mapCheckedState(Object.keys(checkedState), false);

  useEffect(() => {
    mapCheckedState(Object.keys(logs), false);
  }, [logs]);

  return (
    <Modal
      trigger={
        <Popup
          content="Download files"
          trigger={
            <Button
              className={className}
              icon="cloud download"
              onClick={() => setOpenDownloadSection(true)}
              primary
            />
          }
          position="bottom center"
        />
      }
      open={openDownloadSection}
      onClose={() => {
        setOpenDownloadSection(false);
        resetCheckedState();
      }}
      closeIcon
      size="mini"
    >
      <Modal.Header>Download Files</Modal.Header>

      <Modal.Content>
        <Form>
          {Object.entries(logs).map(([filename, content]) => {
            return (
              <Form.Checkbox
                label={filename}
                checked={checkedState[filename] ?? false}
                onClick={(event, data) => {
                  const filename = data.label?.toString();
                  filename &&
                    setCheckedState({
                      ...checkedState,
                      [filename]: !checkedState[filename],
                    });
                }}
              />
            );
          })}
          <Form.Group widths="2">
            <Form.Button
              animated="fade"
              color="red"
              fluid
              type="button"
              onClick={resetCheckedState}
            >
              <Button.Content hidden content="Deselect All" />
              <Button.Content visible content={<Icon name="minus square" />} />
            </Form.Button>
            <Form.Button
              animated="fade"
              color="green"
              fluid
              type="button"
              onClick={() => mapCheckedState(Object.keys(checkedState), true)}
            >
              <Button.Content hidden content="Select All" />
              <Button.Content visible content={<Icon name="check square" />} />
            </Form.Button>
          </Form.Group>
          <Form.Button
            animated="vertical"
            primary
            fluid
            type="button"
            onClick={handleDownload}
            loading={downloading}
            disabled={!hasSelectedFiles()}
          >
            <Button.Content hidden content="Download" />
            <Button.Content visible content={<Icon name="cloud download" />} />
          </Form.Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default DownloadButton;
