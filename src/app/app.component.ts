import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ipcRenderer } from 'electron';
import { join } from 'path';
import { URL } from 'url';

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
    // Create url with custom protocol and attach date to force reloading
    const url = new URL(join('file://', this.appPath, 'test.jpg'));
    const customUrl = new URL(url.toString().replace(/^file:/, 'test-protocol:'));
    customUrl.searchParams.set('t', Date.now().toString());
    return this.sanitizer.bypassSecurityTrustUrl(customUrl.href);
  }
}
