import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core'

@Directive({
  selector: '[appCardHover]',
  standalone: true
})
export class CardHoverDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-2px)')
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 8px 20px rgba(0,0,0,0.08)')
    this.renderer.setStyle(this.el.nativeElement, 'transition', '0.2s')
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)')
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none')
  }
}