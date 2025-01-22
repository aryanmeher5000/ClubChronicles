import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import useClientStateManagement from "../../../store";
import useCloseRoom from "../Hooks/useCloseRoom";

const PopupToChooseWinningTeam = ({ roomId }: { roomId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { closeRoom } = useCloseRoom();
  const { profile } = useClientStateManagement();

  const handleCloseRoom = (winnerTeam: "TEAM1" | "TEAM2" | "TIE") => {
    closeRoom({ roomId, winnerTeam, scoreUpdater: profile?._id });
    onClose(); // Close the modal after the action
  };

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        End Match
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to close the room?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Winner of this match is?</Text>
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent="space-evenly" alignItems="center" w="100%">
              <Button colorScheme="green" onClick={() => handleCloseRoom("TEAM1")}>
                Team1
              </Button>
              <Button colorScheme="green" onClick={() => handleCloseRoom("TIE")}>
                TIE
              </Button>
              <Button colorScheme="green" onClick={() => handleCloseRoom("TEAM2")}>
                Team2
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PopupToChooseWinningTeam;
