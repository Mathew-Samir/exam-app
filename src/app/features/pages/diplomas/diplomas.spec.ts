import {ComponentFixture, TestBed} from "@angular/core/testing";

import {Diplomas} from "./diplomas";

describe("Diplomas", () => {
    let component: Diplomas;
    let fixture: ComponentFixture<Diplomas>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Diplomas],
        }).compileComponents();

        fixture = TestBed.createComponent(Diplomas);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
