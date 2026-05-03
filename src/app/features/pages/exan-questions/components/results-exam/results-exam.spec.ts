import {ComponentFixture, TestBed} from "@angular/core/testing";

import {ResultsExam} from "./results-exam";

describe("ResultsExam", () => {
    let component: ResultsExam;
    let fixture: ComponentFixture<ResultsExam>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ResultsExam],
        }).compileComponents();

        fixture = TestBed.createComponent(ResultsExam);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
