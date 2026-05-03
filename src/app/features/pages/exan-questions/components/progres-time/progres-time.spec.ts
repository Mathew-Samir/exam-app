import {ComponentFixture, TestBed} from "@angular/core/testing";

import {ProgresTime} from "./progres-time";

describe("ProgresTime", () => {
    let component: ProgresTime;
    let fixture: ComponentFixture<ProgresTime>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProgresTime],
        }).compileComponents();

        fixture = TestBed.createComponent(ProgresTime);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
