import { Component, OnInit } from '@angular/core';
import { ProjectOneService } from 'src/app/services/project-one.service';
import { ProjectTwoService } from 'src/app/services/project-two.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly oneCoreService: ProjectOneService,
    private readonly twoCoreService: ProjectTwoService
  ) {}

  async ngOnInit(): Promise<void> {
    const responseOne = await this.oneCoreService.getAllDataFromCollection(
      'productivity'
    );
    const responseTwo = await this.twoCoreService.getAllDataFromCollection(
      'waiting-time'
    );

    console.log(responseOne);
    console.log(responseTwo);
  }
}
