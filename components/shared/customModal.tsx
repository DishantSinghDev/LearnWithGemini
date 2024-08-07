import Modal from "@/components/shared/modal";
import { useState, Dispatch, SetStateAction, useCallback, useMemo } from "react";

const CustomModal = ({
  showCustomModal,
  setShowCustomModal,
  children,
}: {
  children: React.ReactNode;
  showCustomModal: boolean;
  setShowCustomModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Modal showModal={showCustomModal} setShowModal={setShowCustomModal}>
      {children}
    </Modal>
  );
};

export function useCustomModal({ children }: { children: React.ReactNode }) {
  const [showCustomModal, setShowCustomModal] = useState(false);

  const CustomModalCallback = useCallback(() => (
    <CustomModal
      showCustomModal={showCustomModal}
      setShowCustomModal={setShowCustomModal}
    >
      {children}
    </CustomModal>
  ), [children, showCustomModal, setShowCustomModal]);

  return useMemo(() => ({
    setShowCustomModal,
    CustomModal: CustomModalCallback,
  }), [setShowCustomModal, CustomModalCallback]);
}
