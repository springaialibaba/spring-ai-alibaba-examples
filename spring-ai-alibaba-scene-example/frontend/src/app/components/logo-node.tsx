const LogoNode = ({ showTitle }: { showTitle: boolean }) => {
	return (
		<div className="flex h-[72px] items-center justify-start px-6 box-border">
			<img
				src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
				draggable={false}
				alt="logo"
				className="w-6 h-6 inline-block"
			/>
			<span className="inline-block mx-2 font-bold text-[#000000E0] text-base text-ellipsis overflow-hidden whitespace-nowrap">
				{showTitle ? "Spring AI Alibaba" : null}
			</span>
		</div>
	);
};

export default LogoNode;
