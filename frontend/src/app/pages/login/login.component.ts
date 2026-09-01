import {
  Component,
  ElementRef,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

type Step = 'sign-in' | 'sign-up' | 'forgot-password' | 'enter-code';

interface SignInValues {
  email: string;
  password: string;
}

interface RegisValues {
  fname: string;
  lname: string;
  email: string;
  pwd: string;
}

// Cấu hình API endpoint — thay bằng environment.apiUrl khi có file src/environments/environment.ts
const API_URL = '/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isSignIn = signal(true);
  showRegistrationForm = signal(false);
  showForgotPasswordForm = signal(false);
  showEnterCodeForm = signal(false);
  ready = signal(false);

  step = computed<Step>(() => {
    if (this.showEnterCodeForm()) return 'enter-code';
    if (this.showForgotPasswordForm()) return 'forgot-password';
    if (this.isSignIn()) return 'sign-in';
    return 'sign-up';
  });

  // ===== sign in form =====
  signInValues = signal<SignInValues>({ email: '', password: '' });
  isSignInFormValid = computed(() => {
    const { email, password } = this.signInValues();
    const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    return emailValid && password.length >= 8;
  });

  // ===== register form =====
  regisValues = signal<RegisValues>({ fname: '', lname: '', email: '', pwd: '' });
  isAgree = signal(false);
  isRegisFormValid = computed(() => {
    const { fname, lname, email, pwd } = this.regisValues();
    const nameValid = /^[a-zA-Z]+$/.test(fname) && /^[a-zA-Z]+$/.test(lname);
    const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    return nameValid && emailValid && pwd.length >= 8 && this.isAgree();
  });

  // ===== forgot password =====
  resetEmail = signal('');
  email = signal(''); // dùng để hiện masked email ở bước nhập mã
  isResetEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.resetEmail()));

  // ===== enter code (OTP) =====
  code = signal<string[]>(Array(6).fill(''));
  isResetCodeValid = computed(() => /^\d{6}$/.test(this.code().join('')));

  // ===== refs cho animation =====
  private codeInputs = viewChild.required<any>('codeInputsWrapper');
  private signInLine = viewChild<ElementRef<HTMLElement>>('signInLine');
  private signUpLine = viewChild<ElementRef<HTMLElement>>('signUpLine');
  private destroyRef = inject(DestroyRef);

  // cache module gsap sau khi import lần đầu, tránh import lại mỗi lần click
  private gsapModule: typeof import('gsap') | null = null;

  constructor() {
    afterNextRender(() => {
      this.ready.set(true);
      // preload gsap khi trình duyệt rảnh, tránh delay ở lần click đầu tiên
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => this.getGsap());
      } else {
        setTimeout(() => this.getGsap(), 1000);
      }
      requestAnimationFrame(() => requestAnimationFrame(() => this.ready.set(true)));
    });
  }

  // import động — chỉ tải gsap khi người dùng THỰC SỰ click đổi tab lần đầu tiên,
  // không tải lúc trang vừa load → giảm hẳn lag F5
  private async getGsap() {
    if (!this.gsapModule) {
      this.gsapModule = await import('gsap');
    }
    return this.gsapModule.gsap;
  }

  private async animateSidebarLine(toSignIn: boolean): Promise<void> {
    const lineEl = toSignIn ? this.signInLine()?.nativeElement : this.signUpLine()?.nativeElement;
    if (!lineEl) return;
    const gsap = await this.getGsap();
    gsap.killTweensOf(lineEl);
    gsap.fromTo(
      lineEl,
      { yPercent: toSignIn ? 100 : -100 },
      { yPercent: 0, duration: 0.5, ease: 'power2.out' },
    );
  }

  switchToSignIn(): void {
    const alreadyActive = this.isSignIn() && !this.showForgotPasswordForm();
    this.isSignIn.set(true);
    this.showRegistrationForm.set(false);
    this.showForgotPasswordForm.set(false);
    this.showEnterCodeForm.set(false);
    if (!alreadyActive) this.animateSidebarLine(true);
  }

  switchToSignUp(): void {
    const alreadyActive = !this.isSignIn() && !this.showForgotPasswordForm();
    this.toggleForm(false);
    if (!alreadyActive) this.animateSidebarLine(false);
  }

  // ===== handlers =====
  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const { email, password } = this.signInValues();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.customer));
        window.location.href = '/admin';
      } else {
        const error = await response.json();
        alert(error.message || 'Invalid email or password');
      }
    } catch {
      alert('Unable to connect to server. Please try again later.');
    }
  }

  toggleForm(isSignInForm: boolean): void {
    this.isSignIn.set(isSignInForm);
    this.showRegistrationForm.set(false);
    this.showForgotPasswordForm.set(false);
    this.showEnterCodeForm.set(false);
  }

  handleSignInInputChange(field: keyof SignInValues, value: string): void {
    this.signInValues.update((v) => ({ ...v, [field]: value }));
  }

  handleRegisInputChange(field: keyof RegisValues, value: string): void {
    this.regisValues.update((v) => ({ ...v, [field]: value }));
  }

  handleResetEmailChange(value: string): void {
    this.resetEmail.set(value);
    this.email.set(value);
  }

  handleEmailSignUpClick(event: Event): void {
    event.preventDefault();
    this.showRegistrationForm.set(true);
  }

  handleBackToMethodRegisClick(): void {
    this.showRegistrationForm.set(false);
  }

  handleContinueClick(event: Event): void {
    event.preventDefault();
    if (this.isResetEmailValid()) {
      this.showEnterCodeForm.set(true);
      this.showForgotPasswordForm.set(false);
      this.code.set(Array(6).fill(''));
    }
  }

  maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!domain || localPart.length <= 2) return email;
    const masked = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
    return `${masked}@${domain}`;
  }

  private getCodeInput(index: number): HTMLInputElement | null {
    const wrapper = this.codeInputs()?.nativeElement as HTMLElement | undefined;
    return wrapper?.querySelector<HTMLInputElement>(`[data-code-index="${index}"]`) ?? null;
  }

  handleCodeChange(rawValue: string, index: number): void {
    if (!/^\d?$/.test(rawValue)) return;
    this.code.update((c) => {
      const next = [...c];
      next[index] = rawValue;
      return next;
    });
    if (rawValue && index < 5) {
      this.getCodeInput(index + 1)?.focus();
    }
  }

  handleKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.code()[index] && index > 0) {
      const prev = this.getCodeInput(index - 1);
      prev?.focus();
      setTimeout(() => prev?.setSelectionRange(prev.value.length, prev.value.length), 0);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      const prev = this.getCodeInput(index - 1);
      prev?.focus();
      setTimeout(() => prev?.setSelectionRange(prev.value.length, prev.value.length), 0);
    } else if (event.key === 'ArrowRight' && index < 5) {
      const next = this.getCodeInput(index + 1);
      next?.focus();
      setTimeout(() => next?.setSelectionRange(next.value.length, next.value.length), 0);
    }
  }

  onFocusSelect(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }
}
