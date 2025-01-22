import React from "react";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

const FormLoadingSkeleton = () => {
  const arr = [1, 2, 3, 4];

  // Common skeleton colors
  const skeletonColors = {
    startColor: "#222",
    endColor: "#333",
  };

  return (
    <Flex w="100%" h="100%" align="center" direction="column">
      {/* Title Skeleton */}
      <Skeleton
        height="30px"
        width="40%"
        borderRadius={5}
        my={2}
        {...skeletonColors}
      />
      <Divider mb={4} />

      {/* Form Fields Skeleton */}
      {arr.map((k) => (
        <React.Fragment key={k}>
          <SkeletonText
            noOfLines={1}
            width={["100%", "100%", "70%", "60%"]}
            mb={2}
            {...skeletonColors}
          />
          <Skeleton
            width={["100%", "100%", "70%", "60%"]}
            height="30px"
            mb={8}
            {...skeletonColors}
          />
        </React.Fragment>
      ))}

      {/* Buttons Skeleton */}
      <HStack
        width={["100%", "100%", "60%", "50%"]}
        justifyContent="center"
        gap="5%"
      >
        {[1, 2].map((_, index) => (
          <Skeleton
            key={`button-skeleton-${index}`}
            width="30%"
            height="30px"
            mb={8}
            {...skeletonColors}
          >
            <Box />
          </Skeleton>
        ))}
      </HStack>
    </Flex>
  );
};

export default FormLoadingSkeleton;
