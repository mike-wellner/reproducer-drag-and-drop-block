import { Component, OnInit } from '@angular/core';
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

  constructor(private sanitizer: DomSanitizer) {}

  async ngOnInit() {
    this.appPath = await ipcRenderer.invoke('get-app-path') as string;
    setInterval( () => { 
        console.log(this.showImage ? "Hide image" : "Show image");
        this.showImage = !this.showImage; 
    }, 2000);
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
