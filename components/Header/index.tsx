import { Box, Flex } from "@twilio-paste/core";

export const Header: React.FC = () => {
  return (
    <Box
      backgroundColor={"colorBackgroundBrandStronger"}
      alignContent={"center"}
      verticalAlign={"middle"}
      padding={"space30"}
      marginBottom="space30"
    >
      <Flex hAlignContent="center" vertical>
        <Flex>
          <h1 style={{ color: "white" }}>APJ Demo Suite</h1>
        </Flex>
      </Flex>
    </Box>
  );
};
