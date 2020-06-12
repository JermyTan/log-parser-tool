import React from "react";
import { ModalContent, Transition } from "semantic-ui-react";

type Props = {
  openFilterUsage: boolean;
};

function FilterUsageSection({ openFilterUsage }: Props) {
  return (
    <Transition visible={openFilterUsage} unmountOnHide animation="slide down">
      <ModalContent>
        This is the usage section. It will demostrate the filter functionality.
      </ModalContent>
    </Transition>
  );
}

export default FilterUsageSection;
