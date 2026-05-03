import {ComponentFixture, TestBed} from "@angular/core/testing";

import {DialogVerifyEmail} from "./dialog-verify-email";

describe("DialogVerifyEmail", () => {
    let component: DialogVerifyEmail;
    let fixture: ComponentFixture<DialogVerifyEmail>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DialogVerifyEmail],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogVerifyEmail);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
