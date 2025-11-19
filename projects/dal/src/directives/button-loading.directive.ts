import { booleanAttribute, ComponentRef, Directive, effect, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { Renderer2, ViewContainerRef } from '@angular/core';

@Directive({
  selector: 'button[loading]',
  standalone: true,
})
export class ButtonLoadingDirective {
  loading = input(false);
  disabled = input(false, { transform: booleanAttribute });

  private _spinner: ComponentRef<MatProgressSpinner> | null | undefined;

  get nativeElement(): HTMLElement {
    return this._matButton._elementRef.nativeElement;
  }

  constructor(private readonly _viewContainerRef: ViewContainerRef, private readonly _renderer: Renderer2, private readonly _matButton: MatButton) {
    effect(() => {
      if (this.loading()) {
        this._renderer.addClass(this.nativeElement, 'mdc-button-loading');
        this._matButton.disabled = true;

        return this._createSpinner();
      }

      this._renderer.removeClass(this.nativeElement, 'mdc-button-loading');
      this._matButton.disabled = this.disabled();

      return this._destroySpinner();
    });
  }

  private _createSpinner() {
    if (this._spinner) return;

    this._spinner = this._viewContainerRef.createComponent(MatProgressSpinner);
    this._spinner.instance.diameter = 16;
    this._spinner.instance.mode = 'indeterminate';

    const spinnerEl = this._spinner.instance._elementRef.nativeElement;
    this._renderer.addClass(spinnerEl, 'btn-spinner');

    const label = this.nativeElement.querySelector('.btn-label');

    if (label) {
      // Insert spinner after the text label
      this._renderer.insertBefore(this.nativeElement, spinnerEl, label.nextSibling);
    }
  }

  private _destroySpinner() {
    if (!this._spinner) return;

    this._spinner.destroy();
    this._spinner = null;
  }
}
