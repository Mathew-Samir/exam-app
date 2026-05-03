import {ComponentFixture, TestBed} from "@angular/core/testing";

import {UserSidbar} from "./user-sidbar";

describe("UserSidbar", () => {
    let component: UserSidbar;
    let fixture: ComponentFixture<UserSidbar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserSidbar],
        }).compileComponents();

        fixture = TestBed.createComponent(UserSidbar);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
