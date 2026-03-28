import {HttpInterceptorFn, HttpResponse} from "@angular/common/http";
import {inject} from "@angular/core";
import {MessageService} from "primeng/api";
import {tap, catchError, throwError} from "rxjs";

/**
 * Interceptor to handle HTTP responses and show Toast messages using PrimeNG MessageService.
 */
export const httpResponseInterceptor: HttpInterceptorFn = (request, next) => {
    const messageService = inject(MessageService);

    return next(request).pipe(
        tap((event) => {
            if (event instanceof HttpResponse) {
                // Handle success response
                const body = event.body as any;
                if (
                    body?.message &&
                    (request.method === "POST" ||
                        request.method === "PUT" ||
                        request.method === "DELETE")
                ) {
                    messageService.add({
                        severity: "success",
                        summary: "Success",
                        detail: body.message,
                    });
                }
            }
        }),
        catchError((error) => {
            // Handle error response
            let errorMessage = "An unexpected error occurred";

            if (error.error?.message) {
                errorMessage = error.error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            messageService.add({
                severity: "error",
                summary: "Error",
                detail: errorMessage,
            });

            return throwError(() => error);
        })
    );
};
