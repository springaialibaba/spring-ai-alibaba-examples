package com.alibaba.example.sql;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class SQLGenerationExceptionHandler {

	@ExceptionHandler(SQLGenerationException.class)
	public ProblemDetail handle(SQLGenerationException ex) {

		return ProblemDetail.forStatusAndDetail(
				HttpStatus.EXPECTATION_FAILED,
				ex.getMessage()
		);
	}

}
