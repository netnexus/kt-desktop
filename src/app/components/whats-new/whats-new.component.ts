import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../providers/electron.service';


@Component({
  selector: 'app-whats-new',
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.scss']
})
export class WhatsNewComponent implements OnInit {
  constructor(private electron: ElectronService) { }

  async ngOnInit() {
  }

  public close() {
    const tWin = this.electron.remote.getCurrentWindow();
    tWin.close();
  }

}
