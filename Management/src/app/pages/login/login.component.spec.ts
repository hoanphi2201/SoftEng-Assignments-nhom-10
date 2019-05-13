import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {AuthenticationService} from '../../shared/services/authentication.service';

class MockUserService {
    isLoggedIn = true;
    user = { name: 'Test User'};
};

describe('WelcomeComponent (class only)', () => {
    let comp: LoginComponent;
    let userService: AuthenticationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // provide the component-under-test and dependent service
            providers: [
                LoginComponent,
                { provide: AuthenticationService, useClass: MockUserService }
            ]
        });
        // inject both the component and the dependent service.
        comp = TestBed.get(LoginComponent);
        userService = TestBed.get(AuthenticationService);
    });

    it('should not have welcome message after construction', () => {
        expect(comp.welcome).toBeUndefined();
    });

    it('should welcome logged in user after Angular calls ngOnInit', () => {
        comp.ngOnInit();
        expect(comp.welcome).toContain(userService.user.name);
    });

    it('should ask user to log in if not logged in after ngOnInit', () => {
        userService.isLoggedIn = false;
        comp.ngOnInit();
        expect(comp.welcome).not.toContain(userService.user.name);
        expect(comp.welcome).toContain('log in');
    });
});

describe('WelcomeComponent', () => {

    let comp: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let componentUserService: AuthenticationService; // the actually injected service
    let userService: AuthenticationService; // the TestBed injected service
    let el: HTMLElement; // the DOM element with the welcome message

    let userServiceStub: Partial<AuthenticationService>;

    beforeEach(() => {
        // stub UserService for test purposes
        userServiceStub = {
            isLoggedIn: true,
            user: { name: 'Test User'}
        };

        TestBed.configureTestingModule({
            declarations: [ LoginComponent ],
            // providers:    [ UserService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers:    [ {provide: UserService, useValue: userServiceStub } ]
        });

        fixture = TestBed.createComponent(LoginComponent);
        comp    = fixture.componentInstance;

        // UserService actually injected into the component
        userService = fixture.debugElement.injector.get(UserService);
        componentUserService = userService;
        // UserService from the root injector
        userService = TestBed.get(UserService);

        //  get the "welcome" element by CSS selector (e.g., by class name)
        el = fixture.nativeElement.querySelector('.welcome');
    });

    it('should welcome the user', () => {
        fixture.detectChanges();
        const content = el.textContent;
        expect(content).toContain('Welcome', '"Welcome ..."');
        expect(content).toContain('Test User', 'expected name');
    });

    it('should welcome "Bubba"', () => {
        userService.user.name = 'Bubba'; // welcome message hasn't been shown yet
        fixture.detectChanges();
        expect(el.textContent).toContain('Bubba');
    });

    it('should request login if not logged in', () => {
        userService.isLoggedIn = false; // welcome message hasn't been shown yet
        fixture.detectChanges();
        const content = el.textContent;
        expect(content).not.toContain('Welcome', 'not welcomed');
        expect(content).toMatch(/log in/i, '"log in"');
    });

    it('should inject the component\'s UserService instance',
        inject([UserService], (service: AuthenticationService) => {
            expect(service).toBe(componentUserService);
        }));

    it('TestBed and Component UserService should be the same', () => {
        expect(userService === componentUserService).toBe(true);
    });

    it('stub object and injected UserService should not be the same', () => {
        expect(userServiceStub === userService).toBe(false);
        // Changing the stub object has no effect on the injected service
        userServiceStub.isLoggedIn = false;
        expect(userService.isLoggedIn).toBe(true);
    });
});

