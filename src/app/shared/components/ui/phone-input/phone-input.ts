import {
    Component,
    Input,
    Optional,
    Self,
    signal,
    booleanAttribute,
    ChangeDetectionStrategy,
} from "@angular/core";
import {
    ControlValueAccessor,
    NgControl,
    Validator,
    ValidationErrors,
    NG_VALIDATORS,
    AbstractControl,
} from "@angular/forms";
import {forwardRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SelectModule} from "primeng/select";
import {FormsModule} from "@angular/forms";
import {
    parsePhoneNumberFromString,
    isValidPhoneNumber,
    CountryCode,
    getCountries,
    getCountryCallingCode,
} from "libphonenumber-js";

export interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

@Component({
    selector: "app-phone-input",
    standalone: true,
    imports: [CommonModule, SelectModule, FormsModule],
    templateUrl: "./phone-input.html",
    styleUrl: "./phone-input.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => PhoneInputComponent),
            multi: true,
        },
    ],
})
export class PhoneInputComponent implements ControlValueAccessor, Validator {
    @Input() label = "Phone";
    @Input() placeholder = "1012345678";
    @Input({transform: booleanAttribute}) required = false;
    @Input({transform: booleanAttribute}) disabled = false;

    // Selected country
    selectedCountry = signal<Country>({
        name: "Egypt",
        code: "EG",
        dialCode: "+20",
        flag: "🇪🇬",
    });

    // Dynamically generate country list from libphonenumber-js
    countries: Country[] = getCountries()
        .map((code) => ({
            name: new Intl.DisplayNames(["en"], {type: "region"}).of(code) || code,
            code: code,
            dialCode: `+${getCountryCallingCode(code)}`,
            flag: this.getEmojiFlag(code),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    phoneNumber = signal<string>("");

    private getEmojiFlag(countryCode: string): string {
        return countryCode
            .toUpperCase()
            .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
    }

    // Full international phone number
    get fullPhoneNumber(): string {
        if (!this.phoneNumber()) return "";
        return `${this.selectedCountry().dialCode}${this.phoneNumber()}`;
    }

    // Cache for performance (Requirement 6)
    private lastValue: string | null = null;
    private lastCountry: string | null = null;
    private lastValidationResult: ValidationErrors | null = null;

    public onChange = (value: string) => {};
    public onTouched = () => {};
    private onValidatorChange = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    // ===== Helpers =====
    get control() {
        return this.ngControl?.control;
    }

    get hasError(): boolean {
        return !!(this.control?.invalid && (this.control?.touched || this.control?.dirty));
    }

    get errorMessage(): string {
        if (!this.control?.errors) return "";

        if (this.control.errors["required"]) return `${this.label || "Phone number"} is required`;

        if (this.control.errors["invalidPhone"])
            return "Invalid phone number for the selected country";

        return "Invalid phone number";
    }

    // ===== Events =====

    onNumberChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/\D/g, ""); // Numeric only
        this.phoneNumber.set(value);
        input.value = value;

        this.control?.markAsDirty();
        this.updateValue();
    }

    onCountryChange() {
        this.updateValue();
        this.onValidatorChange();
    }

    private updateValue() {
        const full = this.fullPhoneNumber;
        this.onChange(full);
    }

    // ===== Validator Implementation =====

    validate(control: AbstractControl): ValidationErrors | null {
        const full = this.fullPhoneNumber;
        const countryCode = this.selectedCountry().code as CountryCode;

        // Perf: Return cached result if same (Requirement 6)
        if (full === this.lastValue && countryCode === this.lastCountry) {
            return this.lastValidationResult;
        }

        this.lastValue = full;
        this.lastCountry = countryCode;

        if (!full) {
            this.lastValidationResult = null;
            return null;
        }

        const phoneNumber = parsePhoneNumberFromString(full, countryCode);

        if (!phoneNumber || !phoneNumber.isValid()) {
            this.lastValidationResult = {invalidPhone: true};
        } else {
            this.lastValidationResult = null;
        }

        return this.lastValidationResult;
    }

    onBlur() {
        this.onTouched();
    }

    // ===== CVA =====

    writeValue(value: string): void {
        if (!value) {
            this.phoneNumber.set("");
            return;
        }

        // Try to parse the incoming value
        const parsed = parsePhoneNumberFromString(value);
        if (parsed) {
            const country = this.countries.find((c) => c.code === parsed.country);
            if (country) {
                this.selectedCountry.set(country);
                this.phoneNumber.set(parsed.nationalNumber as string);
            } else {
                // Fallback if country not in list
                this.phoneNumber.set(value);
            }
        } else {
            this.phoneNumber.set(value);
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onValidatorChange = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
