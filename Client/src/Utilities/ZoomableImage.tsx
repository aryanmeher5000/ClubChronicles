import { Image, Box } from "@chakra-ui/react";
import { useState } from "react";
import { createImageUrlFromId } from "./utilFxns";

interface ZoomableImageProps {
  imgSource?: string;
  width?: string | string[];
  height?: string | string[];
  zoomedWidth?: string | string[];
  zoomedHeight?: string | string[];
  borderRadius?: number;
}

const ZoomableImage = ({ imgSource, width, height, zoomedWidth, zoomedHeight, borderRadius }: ZoomableImageProps) => {
  const [zoomed, setZoomed] = useState<boolean>(false);
  return (
    <Box>
      <Image
        src={createImageUrlFromId(imgSource)}
        alt="image"
        objectFit="cover"
        borderRadius={borderRadius || "full"}
        fallbackSrc={createImageUrlFromId()}
        loading="lazy"
        cursor={imgSource && "zoom-in"}
        onClick={() => imgSource && setZoomed((prev) => !prev)}
        w={width || 250}
        h={height || 250}
      />

      {zoomed && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.8)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
          onClick={() => setZoomed(false)}
          cursor="zoom-out"
        >
          <Image
            src={createImageUrlFromId(imgSource)}
            alt="image"
            objectFit="cover"
            w={zoomedWidth || ["50vh", "50vh", "70vh"]}
            h={zoomedHeight || ["50vh", "50vh", "70vh"]}
            borderRadius={borderRadius || "full"}
            loading="lazy"
            transition="all 0.3s "
          />
        </Box>
      )}
    </Box>
  );
};

export default ZoomableImage;
