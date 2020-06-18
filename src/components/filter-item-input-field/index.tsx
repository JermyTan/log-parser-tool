import React from "react";
import {
  Form,
  Input,
  Transition,
  Icon,
  InputOnChangeData,
  StrictLabelProps,
} from "semantic-ui-react";

type Props = {
  fieldLabel?: string;
  inputLabel?: StrictLabelProps;
  placeholder?: string;
  value?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  onClear?: () => void;
  disabled?: boolean;
};

function FilterItemInputField({
  fieldLabel,
  inputLabel,
  placeholder,
  value,
  onChange,
  onClear,
  disabled,
}: Props) {
  return (
    <Form.Field className="filter-item-field">
      {fieldLabel && <label>{fieldLabel}</label>}
      <Input
        label={inputLabel}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        icon={
          <Transition
            visible={!!value && !!onClear}
            unmountOnHide
            animation="scale"
          >
            <Icon link name="close" onClick={onClear} />
          </Transition>
        }
      />
    </Form.Field>
  );
}

export default FilterItemInputField;
