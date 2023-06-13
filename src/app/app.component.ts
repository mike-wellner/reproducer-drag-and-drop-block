import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ipcRenderer } from 'electron';
import { join } from 'path';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  appPath = '';
  showImage = true;

  constructor(
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.appPath = await ipcRenderer.invoke('get-app-path') as string;

    ipcRenderer.on('toggle-image', () => {
      console.log(`Process.type: ${process.type}, ${this.showImage ? "Hide image" : "Show image"}`);
      this.showImage = !this.showImage; 
      this.changeDetector.detectChanges();
    });
  }

  async onDragStart() {
    ipcRenderer.invoke('on-drag-start', join(this.appPath, 'test.jpg'));
  }

  getSrc() {
    // Create url with custom protocol
    // Attach time to force reloading
    return this.sanitizer.bypassSecurityTrustUrl('test-protocol://' + join(this.appPath, 'test.jpg') + '?time=' + new Date().toLocaleTimeString().replace(':', '-'));
  }
}
