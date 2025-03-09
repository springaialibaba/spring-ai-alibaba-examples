package com.alibaba.example.sql;

public class SQLGenerationException extends RuntimeException {

	public SQLGenerationException(String response) {
		super(response);
	}
}
