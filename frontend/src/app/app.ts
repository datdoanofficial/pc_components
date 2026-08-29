import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  message = 'Đang kết nối tới Spring Boot...';

  ngOnInit() {
    this.http.get<{ message: string }>('http://localhost:8080/api/hello')
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.cdr.detectChanges(); // Ép Angular re-render UI
        },
        error: (err) => {
          console.error(err);
          this.message = 'Lỗi kết nối Backend!';
          this.cdr.detectChanges();
        }
      });
  }
}