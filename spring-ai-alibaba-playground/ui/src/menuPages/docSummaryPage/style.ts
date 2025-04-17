import { createStyles } from "antd-style";

export const useStyle = createStyles(({ token }) => ({
  codeBlock: {
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    padding: token.padding,
    margin: token.margin,
  },
  docContainer: {
    padding: token.padding,
    display: "flex",
    flexDirection: "column",
    gap: token.marginSM,
  },
  uploadArea: {
    border: `1px dashed ${token.colorBorder}`,
    borderRadius: token.borderRadiusLG,
    backgroundColor: token.colorBgContainer,
    padding: token.paddingLG,
    textAlign: "center",
    cursor: "pointer",
    transition: `border-color ${token.motionDurationMid}`,
    "&:hover": {
      borderColor: token.colorPrimary,
    },
  },
  uploadIcon: {
    fontSize: 48,
    color: token.colorTextSecondary,
    marginBottom: token.marginMD,
  },
  uploadHint: {
    color: token.colorTextSecondary,
    marginTop: token.marginMD,
  },
  fileHistoryItem: {
    "&:hover": {
      backgroundColor: token.colorBgTextHover,
      transition: `all ${token.motionDurationMid}`,
      ".file-title": {
        color: token.colorPrimary,
      },
    },
  },
}));
