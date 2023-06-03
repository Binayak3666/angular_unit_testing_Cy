import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";
import { MatTabsModule } from '@angular/material/tabs';

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourse =  setupCourses()
  .filter(course =>{ course.category == "BEGINNER"})

  const advancedCourse =  setupCourses()
  .filter(course =>{ course.category == "ADVANCED"})

  beforeEach(async () => {
    const coursesService = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);
    await TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule,MatTabsModule],
      providers: [{ provide: CoursesService, useValue: coursesService }],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    coursesService = TestBed.inject(CoursesService);
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", async () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourse))
    fixture.detectChanges();
    
    const tabs = el.queryAll(By.css(".mat-mdc-tab-labels"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourse))
    fixture.detectChanges();
    
       const tabs = el.queryAll(By.css(".mat-mdc-tab-labels"));
       expect(tabs.length).toBe(1,"unexpected number of tab found advance");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()))
    fixture.detectChanges();
    
       const tabs = el.queryAll(By.css(".mdc-tab"));
       console.log(tabs.length)
       expect(tabs.length).toBe(2,"Expect to find two tab");
  });

  it("should display advanced courses when tab clicked with fakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()))
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    // el.nativeElement.click(tabs[1])
    click(tabs[1]);
    fixture.detectChanges();// click is expecting this
    // flush();
    tick(16)
    const cardTitle = el.queryAll(By.css(".mat-mdc-tab-body-active .mat-mdc-card"));
    expect(cardTitle.length).toBeGreaterThan(0,"Could not find card title")
    expect(cardTitle[0].nativeElement.textContent).toContain("Angular Security Course")

    // setTimeout(()=>{
    //   const cardTitle = el.queryAll(By.css(".mat-mdc-tab-body-active .mat-mdc-card"));
    //   expect(cardTitle.length).toBeGreaterThan(0,"Could not find card title")
    //   expect(cardTitle[0].nativeElement.textContent).toContain("Angular Security Course")
    // },500)
  }));
  fit("should display advanced courses when tab with waitForAsync()", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()))
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    // el.nativeElement.click(tabs[1])
    click(tabs[1]);
    fixture.detectChanges();// click is expecting this
    // flush();
    fixture.whenStable().then(()=>{
      console.log("when stable called")
      const cardTitle = el.queryAll(By.css(".mat-mdc-tab-body-active .mat-mdc-card"));
      expect(cardTitle.length).toBeGreaterThan(0,"Could not find card title")
      expect(cardTitle[0].nativeElement.textContent).toContain("Angular Security Course")
    })

  }));


});
