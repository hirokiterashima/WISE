import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { defer, Observable } from "rxjs";
import { MomentModule } from 'ngx-moment';
import { TeacherRunListComponent } from './teacher-run-list.component';
import { TeacherService } from "../teacher.service";
import { Project } from "../../domain/project";
import { TeacherRun } from "../teacher-run";
import { NO_ERRORS_SCHEMA } from "@angular/core";

@Component({selector: 'app-teacher-run-list-item', template: ''})
class TeacherRunListItemStubComponent {
  @Input()
  run: TeacherRun = new TeacherRun();
}

export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export class MockTeacherService {
  getRuns(): Observable<TeacherRun[]> {
    const runs: TeacherRun[] = [];
    const run1 = new TeacherRun();
    run1.id = 1;
    run1.name = "Photosynthesis";
    run1.numStudents = 30;
    run1.periods = ["1","2"];
    const project1 = new Project();
    project1.id = 1;
    project1.name = "Photosynthesis";
    project1.projectThumb = "";
    run1.project = project1;
    const run2 = new TeacherRun();
    run2.id = 2;
    run2.name = "Plate Tectonics";
    run2.numStudents = 15;
    run2.periods = ["3","4"];
    const project2 = new Project();
    project2.id = 1;
    project2.name = "Plate Tectonics";
    project2.projectThumb = "";
    run2.project = project2;
    runs.push(run1);
    runs.push(run2);
    return Observable.create( observer => {
      observer.next(runs);
      observer.complete();
    });
  }
  getSharedRuns(): Observable<TeacherRun[]> {
    const runs: TeacherRun[] = [];
    return Observable.create(observer => {
        observer.next(runs);
        observer.complete();
      }
    );
  }
  newRunSource$ = fakeAsyncResponse(
    {
      id: 3,
      name: "Global Climate Change",
      periods: ["1", "2"]
    }
  );
}

describe('TeacherRunListComponent', () => {
  let component: TeacherRunListComponent;
  let fixture: ComponentFixture<TeacherRunListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherRunListComponent ],
      imports: [ MomentModule ],
      providers: [ { provide: TeacherService, useClass: MockTeacherService }],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherRunListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort runs by start date', () => {
    // expect(runs).toBeSorted();
  })

});
