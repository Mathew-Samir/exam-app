import {ComponentFixture, TestBed} from "@angular/core/testing";

import {RowExam} from "./row-exam";

describe("RowExam", () => {
    let component: RowExam;
    let fixture: ComponentFixture<RowExam>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RowExam],
        }).compileComponents();

        fixture = TestBed.createComponent(RowExam);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
