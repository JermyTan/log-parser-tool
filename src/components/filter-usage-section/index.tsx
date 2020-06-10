import React from "react";
import { ModalContent, Transition } from "semantic-ui-react";

type Props = {
  openFilterUsage: boolean;
};

function FilterUsageSection({ openFilterUsage }: Props) {
  return (
    <Transition visible={openFilterUsage} unmountOnHide animation="fly down">
      <ModalContent>Hello</ModalContent>
    </Transition>
  );
}

export default FilterUsageSection;
