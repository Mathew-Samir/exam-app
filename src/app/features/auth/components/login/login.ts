import {Component} from "@angular/core";
import { Button } from "../../../../shared/components/ui/button/button";
import { InputComponent } from "../../../../shared/components/ui/input/input";
import { RouterLink } from "@angular/router";


@Component({
    selector: "app-login",
    imports: [Button,InputComponent,RouterLink],
    templateUrl: "./login.html",
    styleUrl: "./login.scss",
})
export class Login {}
