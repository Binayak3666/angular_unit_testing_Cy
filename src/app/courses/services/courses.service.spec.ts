import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { Course } from "../model/course";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("Should retrive all cources", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      // console.log(courses)
      expect(courses).toBeTruthy("No course returned");
      expect(courses.length).toBe(12, "incorrect number of course");
      const course = courses.find((course) => course.id == 12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });
    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");
    req.flush({ payload: Object.values(COURSES) });
  });

  it("should retrive cources by Id", () => {
    const id = 12;
    coursesService.findCourseById(id).subscribe((course) => {
      expect(course).toBeTruthy("No course have WRT id");
      expect(course.id).toBe(12, "Id not found");
    });
    const req = httpTestingController.expectOne("/api/courses/" + id);
    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[id]);
  });

  it("Should save the cource data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };
    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });
    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );
    console.log({ ...changes })
    // req.flush({ ...COURSES[12], ...changes });
  });

  it("should give an error id save course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };
    coursesService.saveCourse(12, changes).subscribe(
      () => {
        fail("the save course method should have falied");
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );
    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    req.flush("Save course Falil", {
      status: 500,
      statusText: "Internal server error",
    });
  });

  it("should find a list of lession", () => {
    coursesService.findLessons(12).subscribe((lession) => {
      expect(lession).toBeTruthy();
      expect(lession.length).toBe(3);
    });
    const req = httpTestingController.expectOne(
      (req) => req.url == "/api/lessons"
    );
    expect(req.request.method).toEqual("GET");
    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");
    req.flush({
      payload: findLessonsForCourse(12).slice(0,3),
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
