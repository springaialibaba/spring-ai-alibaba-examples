import { GithubOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";

const linkIconBtns = [
	{
		tooltip_title: "spring-ai-alibaba-docs link",
		href: "https://sca.aliyun.com/en/ai/",
		target: "_blank",
		rel: "noopener noreferrer",
		icon: <LinkOutlined />,
	},
	{
		tooltip_title: "spring-ai-alibaba link",
		href: "https://github.com/alibaba/spring-ai-alibaba",
		target: "_blank",
		rel: "noopener noreferrer",
		icon: <GithubOutlined />,
	},

	{
		tooltip_title: "spring-ai-alibaba-examples link",
		href: "https://github.com/springaialibaba/spring-ai-alibaba-examples",
		target: "_blank",
		rel: "noopener noreferrer",
		icon: <GithubOutlined />,
	},
];

const FriendlyLinkBar = () => {
	return (
		<Space className="flex-row-reverse right-[30px] top-[20px]">
			{linkIconBtns.map((linkIconBtn, index) => (
				<Tooltip title={linkIconBtn.tooltip_title} key={index}>
					<a
						href={linkIconBtn.href}
						target={linkIconBtn.target}
						rel={linkIconBtn.rel}>
						<Button icon={linkIconBtn.icon} />
					</a>
				</Tooltip>
			))}
		</Space>
	);
};

export default FriendlyLinkBar;
