import { createStyles } from "antd-style";

export const useStyle = createStyles(({ token, css }) => {
  return {
    topLinkWrapper: css`
      position: absolute;
      right: 30px;
      top: 10px;
      z-index: 10;
    `,
    bottomLinkWrapper: css`
      position: absolute;
      left: 20px;
      bottom: 8px;
      z-index: 10;
    `,
    layout: css`
      width: 100%;
      min-width: 1000px;
      height: calc(100vh - 56px);
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
      overflow-x: hidden;
      position: relative;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      min-width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 16px;
      box-sizing: border-box;
      transition: all 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);
      transform-origin: left center;
      overflow-y: auto;
      overflow-x: hidden;
    `,
    menuCollapsed: css`
      width: 0;
      min-width: 0;
      padding: 0;
      opacity: 0;
      transform: translateX(-100%);
    `,
    chooseModel: css`
      display: flex;
      flex-direction: column;
      color: rgba(0, 0, 0, 0.88);
      margin: 16px 0;
      gap: 8px;
    `,
    conversations: css`
      width: 100%;
      padding: 0;
      margin-top: 2px;
      overflow-y: auto;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingLG}px;
      padding-bottom: 0;
      gap: 16px;
      transition: all 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);
      position: relative;
    `,
    chatFullWidth: css`
      max-width: 900px;
    `,
    messages: css`
      flex: 1;
      margin-bottom: 16px;
      padding-bottom: 40px;
      overflow-y: auto;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    sender: css`
      box-shadow: ${token.boxShadow};
      margin-bottom: 50px;
      position: relative;
      border-radius: 12px;

      .ant-sender-textarea {
        transition: height 0.3s ease, max-height 0.3s ease;
        min-height: 56px;
      }
    `,
    senderExpanded: css`
      .ant-sender-textarea {
        height: 300px !important;
        max-height: 300px !important;
      }
    `,
    expandToggle: css`
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 10;
      opacity: 0.7;
      transition: opacity 0.2s;
      background-color: ${token.colorBgElevated};
      border-radius: 4px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;

      &:hover {
        opacity: 1;
        background-color: ${token.colorBgContainer};
      }
    `,
    actionButtons: css`
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    `,
    actionButton: css`
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 14px;
      border-radius: ${token.borderRadius}px;
      font-size: 14px;
      transition: all 0.2s;
      cursor: pointer;

      .anticon {
        font-size: 14px;
      }

      &:hover {
        background-color: ${token.colorPrimaryBg};
      }
    `,
    searchButton: css`
      color: #1677ff;
      border: 1px solid #1677ff30;
      background-color: #1677ff08;

      &:hover {
        background-color: #1677ff15;
      }

      &.active {
        outline: 2px solid #1677ff;
        outline-offset: -1px;
        border-color: transparent;
        background-color: #1677ff12;
      }
    `,
    thinkButton: css`
      color: #722ed1;
      border: 1px solid #722ed130;
      background-color: #722ed108;

      &:hover {
        background-color: #722ed115;
      }

      &.active {
        outline: 2px solid #722ed1;
        outline-offset: -1px;
        border-color: transparent;
        background-color: #722ed112;
      }
    `,
    activeButton: css`
      font-weight: 500;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    `,
    footer: css`
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      padding: 16px 50px;
      color: rgba(0, 0, 0, 0.45);
      background-color: rgba(0, 0, 0, 0.02);
      border-top: 1px solid rgba(0, 0, 0, 0.06);
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
    userProfile: css`
      display: flex;
      height: 60px;
      width: 100%;
      justify-content: flex-end;
      gap: 12px;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid ${token.colorBorderSecondary};
      margin-bottom: 16px;
      img {
        padding-top: 4px;
        height: 30px;
      }
    `,
    newChatBtn: css`
      margin-bottom: 16px;
      height: 40px;
      font-size: 15px;
    `,
    functionMenu: css`
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 8px;
      margin-bottom: 16px;
      padding: 4px 0;
      border-bottom: 1px solid ${token.colorBorderSecondary};
    `,
    functionMenuItem: css`
      padding: 10px 16px;
      cursor: pointer;
      border-radius: ${token.borderRadius}px;
      transition: all 0.3s;

      &:hover {
        background-color: ${token.colorBgTextHover};
      }

      .anticon {
        font-size: 18px;
        margin-right: 8px;
      }

      span {
        font-size: 15px;
      }
    `,
    conversationsContainer: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      overflow: hidden;
    `,
    collapsedMenuBtn: css`
      position: fixed;
      top: 12px;
      left: 12px;
      z-index: 1000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: ${token.boxShadowSecondary};
      cursor: pointer;
      opacity: 0;
      transform: scale(0.8);
      animation: fadeIn 0.3s cubic-bezier(0.34, 0.69, 0.1, 1) forwards;

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      &:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease;
      }
    `,
    pageContainer: css`
      flex: 1;
      display: none;
      opacity: 0;
      transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);

      &.active {
        display: flex;
        flex-direction: column;
        opacity: 1;
      }
    `,
    menuPagesContainer: css`
      flex: 1;
      position: relative;
      overflow: hidden;
    `,
    menuPage: css`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      opacity: 0;
      transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      background-color: ${token.colorBgContainer};
      overflow-y: auto;

      &.active {
        display: block;
        opacity: 1;
      }
    `,
  };
});
