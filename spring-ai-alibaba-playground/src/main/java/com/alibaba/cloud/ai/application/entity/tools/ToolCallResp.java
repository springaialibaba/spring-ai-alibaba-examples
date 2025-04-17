package com.alibaba.cloud.ai.application.entity.tools;

import java.time.LocalDateTime;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

public class ToolCallResp {

	/**
	 * Tool 的执行状态
	 */
	private ToolState status;

	/**
	 * Tool Name
	 */
	private String toolName;

	/**
	 * Tool 执行参数
	 */
	private String toolParameters;

	/**
	 * Tool 执行结果
	 */
	private String toolResult;

	/**
	 * 工具执行开始的时间戳
	 */
	private LocalDateTime toolStartTime;

	/**
	 * 工具执行完成的时间戳
	 */
	private LocalDateTime toolEndTime;

	/**
	 * 工具执行的错误信息
	 */
	private String errorMessage;

	/**
	 * 工具执行输入
	 */
	private String toolInput;

	/**
	 * 工具执行耗时
	 */
	private Long toolCostTime;
	/**
	 * Tool 记录tool返回的中间结果
	 */
	private String toolResponse;

	public enum ToolState {
		/**
		 * 工具执行成功
		 */
		SUCCESS,
		/**
		 * 工具执行失败
		 */
		FAILURE,
		/**
		 * 工具状态未知
		 */
		UNKNOWN,
		/**
		 * 工具执行中
		 */
		RUNNING,
	}

	public ToolState getStatus() {
		return status;
	}

	public void setStatus(ToolState status) {
		this.status = status;
	}

	public String getToolName() {
		return toolName;
	}

	public void setToolName(String toolName) {
		this.toolName = toolName;
	}

	public String getToolParameters() {
		return toolParameters;
	}

	public void setToolParameters(String toolParameters) {
		this.toolParameters = toolParameters;
	}

	public String getToolResult() {
		return toolResult;
	}

	public void setToolResult(String toolResult) {
		this.toolResult = toolResult;
	}

	public LocalDateTime getToolStartTime() {
		return toolStartTime;
	}

	public void setToolStartTime(LocalDateTime toolStartTime) {
		this.toolStartTime = toolStartTime;
	}

	public LocalDateTime getToolEndTime() {
		return toolEndTime;
	}

	public void setToolEndTime(LocalDateTime toolEndTime) {
		this.toolEndTime = toolEndTime;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public String getToolInput() {
		return toolInput;
	}

	public void setToolInput(String toolInput) {
		this.toolInput = toolInput;
	}

	public Long getToolCostTime() {
		return toolCostTime;
	}

	public void setToolCostTime(Long toolCostTime) {
		this.toolCostTime = toolCostTime;
	}

	public String getToolResponse() {
		return toolResponse;
	}

	public void setToolResponse(String toolResponse) {
		this.toolResponse = toolResponse;
	}

	@Override
	public String toString() {
		return "ToolCallResp{" +
				"status=" + status +
				", toolName='" + toolName + '\'' +
				", toolParameters='" + toolParameters + '\'' +
				", toolResult='" + toolResult + '\'' +
				", toolStartTime=" + toolStartTime +
				", toolEndTime=" + toolEndTime +
				", errorMessage='" + errorMessage + '\'' +
				", toolInput='" + toolInput + '\'' +
				", toolCostTime=" + toolCostTime +
				", toolResponse='" + toolResponse + '\'' +
				'}';
	}

	// return a null ToolCallResp
	public static ToolCallResp TCR() {

		return new ToolCallResp();
	}

	public static ToolCallResp startExecute(String toolInput, String toolName, String toolParameters) {

		var res = new ToolCallResp();

		res.setToolName(toolName);
		res.setToolParameters(toolParameters);
		res.setToolInput(toolInput);
		res.setToolStartTime(LocalDateTime.now());
		res.setStatus(ToolState.RUNNING);
		return res;
	}

	public static ToolCallResp endExecute(ToolState status, LocalDateTime toolStartTime, String toolResult) {

		var res = new ToolCallResp();
		res.setToolResult(toolResult);
		res.setToolEndTime(LocalDateTime.now());
		res.setStatus(status);
		res.setToolCostTime(
				(long) (res.getToolEndTime().getNano() - toolStartTime.getNano())
		);

		return res;
	}

}
