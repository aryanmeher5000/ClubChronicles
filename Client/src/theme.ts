import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const theme: ThemeConfig = extendTheme({
  withDefaultColorScheme: "system",
  components: {
    Button: {
      baseStyle: {
        borderRadius: 15,
      },
      defaultProps: {
        variant: "solid",
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: 15,
          fontWeight: 500,
        },
      },
      defaultProps: { variant: "filled" },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 15,
        },
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Skeleton: {
      fadeduration: 5,
    },
  },
  styles: {
    global: (props) => {
      return {
        "html body": {
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          bg: props.colorMode === "dark" ? "blackAlpha.900" : "whiteAlpha.900",
        },
        ".card": {
          bg: props.colorMode === "dark" ? "whiteAlpha.100" : "gray.100",
          _hover: { bg: props.colorMode === "dark" ? "whiteAlpha.200" : "gray.200" },
          borderRadius: 15,
          padding: 4,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        ".selectedForm": {
          width: "100%",
        },

        ".linkClass": {
          fontWeight: 700,
          fontSize: "2xl",
          marginBottom: "12px",
          marginTop: "20px",
          cursor: "pointer",
          width: "fit-content",
        },

        ".colorClass": {
          color: "#f04d50",
        },

        ".idStyle": {
          fontSize: "small",
          fontStyle: "italic",
          textAlign: "center",
          padding: "1px",
        },
      };
    },
  },
});

export default theme;
