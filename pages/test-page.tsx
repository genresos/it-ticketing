import { Button, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import useSound from "use-sound";
import { useIsSmallScreen } from "../hooks";
import { calcDateIndo } from "../utils/myFormat";

const soundUrl = "/adaytoremember.mp3";

const TestPage = () => {
  const [play, { duration, pause, sound, stop }] = useSound(soundUrl);
  const isSmallScreen = useIsSmallScreen();

  return (
    <Flex
      flexDir="column"
      minH="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Text>TestPage {isSmallScreen ? "Mobile" : "Desktop"}</Text>
      <Text>{calcDateIndo("2022/01/6", "2022/08/20").result}</Text>
      <Button
        onClick={() => play()}
        onMouseEnter={() => {
          console.log("hover");
          play();
        }}
      >
        Play
      </Button>
      <Button onClick={() => pause()}>Pause</Button>
      <Button onClick={() => stop()}>Stop</Button>
      <Text>Duration: {duration}</Text>
    </Flex>
  );
};

export default TestPage;

export async function getStaticProps() {
  return {
    props: {
      layoutType: "Auth",
    },
  };
}
