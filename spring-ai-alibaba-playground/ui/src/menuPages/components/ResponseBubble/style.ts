import { createStyles } from "antd-style";

export const useStyle = createStyles(({ token }) => ({
  botMessage: {
    display: "flex",
    flexDirection: "column",
    padding: token.padding,
    marginBottom: token.margin,
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadius,
    maxWidth: "80%",
    alignSelf: "flex-start",
    marginRight: "auto",
    willChange: "transform, opacity",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
  },
  messageSender: {
    fontWeight: "bold",
    marginBottom: token.marginXXS,
  },
  messageText: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",

    pre: {
      background: token.colorBgContainer,
      borderRadius: token.borderRadius,
      padding: token.padding,
      margin: `${token.marginXS}px 0`,
      maxHeight: "300px",
      overflow: "auto",

      "&::-webkit-scrollbar": {
        width: "6px",
        height: "6px",
      },

      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },

      "&::-webkit-scrollbar-thumb": {
        background: token.colorTextTertiary,
        borderRadius: "3px",
      },

      "&::-webkit-scrollbar-thumb:hover": {
        background: token.colorTextSecondary,
      },
    },

    code: {
      fontFamily: token.fontFamilyCode,
      background: token.colorBgContainer,
      padding: "2px 4px",
      borderRadius: token.borderRadiusSM,
    },
  },
  messageTime: {
    fontSize: token.fontSizeSM,
    color: token.colorTextSecondary,
    marginTop: token.marginXXS,
    alignSelf: "flex-end",
  },
  thinkBlock: {
    borderLeft: `4px solid ${token.colorPrimary}`,
    paddingLeft: token.padding,
    margin: `${token.marginXS}px 0`,
    color: token.colorTextSecondary,
    fontStyle: "italic",
  },
  codeBlock: {
    "&::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: token.colorTextTertiary,
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: token.colorTextSecondary,
    },
  },
  codeInline: {},
}));
