import {TestBed} from "@angular/core/testing";
import {HttpInterceptorFn} from "@angular/common/http";

import {httpResponseInterceptor} from "./http-response-interceptor";

describe("httpResponseInterceptor", () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => httpResponseInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(interceptor).toBeTruthy();
    });
});
