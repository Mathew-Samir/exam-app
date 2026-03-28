import {TestBed} from "@angular/core/testing";

import {MsrAuth} from "./msr-auth";

describe("MsrAuth", () => {
    let service: MsrAuth;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MsrAuth);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
