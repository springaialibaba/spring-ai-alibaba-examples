import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  `,
  inputArea: css`
    position: sticky;
    top: 0;
    z-index: 100;
    background: ${token.colorBgContainer};
    padding: 16px 0;
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
  sender: css`
    width: 100%;
  `,
  masonryGrid: css`
    display: flex;
    margin-left: -16px;
    width: auto;
  `,
  masonryColumn: css`
    padding-left: 16px;
    background-clip: padding-box;
  `,
  imageCard: css`
    margin-bottom: 16px;
    break-inside: avoid;
    border-radius: ${token.borderRadius}px;
    overflow: hidden;
    background: ${token.colorBgContainer};
    box-shadow: ${token.boxShadowTertiary};
    transition: all 0.2s ease;
    position: relative;
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
    }

    &:hover .overlay {
      opacity: 1;
      visibility: visible;
    }

    img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
  `,
  overlay: css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.7)
    );
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  `,
  prompt: css`
    color: ${token.colorWhite};
    margin: 0 0 16px 0;
    font-size: ${token.fontSizeSM}px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  useButton: css`
    align-self: flex-start;
    background: ${token.colorPrimary};
    border: none;
    z-index: 3;

    &:hover {
      background: ${token.colorPrimaryHover} !important;
    }
  `,
}));
