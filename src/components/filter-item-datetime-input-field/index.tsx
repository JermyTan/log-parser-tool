import React from "react";
import { Form, Input, Icon, StrictLabelProps } from "semantic-ui-react";
import Datetime from "react-datetime";
import "./index.scss";

type Props = {
  fieldLabel?: string;
  inputLabel?: StrictLabelProps;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

function FilterItemDatetimeInputField({
  fieldLabel,
  inputLabel,
  placeholder,
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <Form.Field className="filter-item-field">
      {fieldLabel && <label>{fieldLabel}</label>}
      <Datetime
        dateFormat="DD/MM/YYYY"
        timeFormat="HH:mm:ss"
        onChange={(value) =>
          onChange?.(
            typeof value === "string"
              ? value
              : value.format("DD/MM/YYYY HH:mm:ss")
          )
        }
        utc
        value={value}
        // @ts-ignore
        renderInput={(props: any, handleOpen: () => void) => (
          <Input
            label={inputLabel}
            value={props.value}
            onChange={props.onChange}
            placeholder={placeholder}
            disabled={disabled}
            icon={
              <Icon
                name="calendar alternate"
                link
                onClick={() => handleOpen()}
              />
            }
          />
        )}
      />
    </Form.Field>
  );
}

export default FilterItemDatetimeInputField;
