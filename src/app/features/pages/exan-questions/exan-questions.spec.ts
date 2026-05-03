import {ComponentFixture, TestBed} from "@angular/core/testing";

import {ExanQuestions} from "./exan-questions";

describe("ExanQuestions", () => {
    let component: ExanQuestions;
    let fixture: ComponentFixture<ExanQuestions>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ExanQuestions],
        }).compileComponents();

        fixture = TestBed.createComponent(ExanQuestions);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
