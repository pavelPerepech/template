package org.example.zev.rest;

import org.example.zev.dto.ErrorDto;
import org.example.zev.util.BusinessException;
import org.example.zev.util.InternalError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestErrorHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(InternalError.class)
    protected ResponseEntity<ErrorDto> handleBusinessError(Exception e, WebRequest request) {
        if (e instanceof  BusinessException) {
            return new ResponseEntity<>(new ErrorDto(e.getMessage(), true), HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(new ErrorDto(e.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
