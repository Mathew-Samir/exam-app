import {Component} from "@angular/core";
import { Button } from "../../../../shared/components/ui/button/button";
import { InputComponent } from "../../../../shared/components/ui/input/input";
import { RouterLink } from "@angular/router";


@Component({
    selector: "app-sign-up",
    imports: [Button,InputComponent,RouterLink],
    templateUrl: "./sign-up.html",
    styleUrl: "./sign-up.scss",
})
export class SignUp {}
