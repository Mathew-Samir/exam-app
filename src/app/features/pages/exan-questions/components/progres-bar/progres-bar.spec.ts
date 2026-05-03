import {ComponentFixture, TestBed} from "@angular/core/testing";

import {ProgresBar} from "./progres-bar";

describe("ProgresBar", () => {
    let component: ProgresBar;
    let fixture: ComponentFixture<ProgresBar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProgresBar],
        }).compileComponents();

        fixture = TestBed.createComponent(ProgresBar);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
