import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTypewriter]'
})
export class TypewriterDirective implements OnInit, OnDestroy {
  @Input('appTypewriter') fullText: string = '';
  @Input() speed: number = 100; // typing speed in ms
  
  private observer: IntersectionObserver | null = null;
  private animationStarted = false;
  
  constructor(private el: ElementRef) {}
  
  ngOnInit(): void {
    // Initially clear text content
    this.el.nativeElement.textContent = '';
    
    // Create and configure Intersection Observer
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      root: null, // Use viewport as root
      rootMargin: '0px', // No margin
      threshold: 0.1 // Trigger when at least 10% is visible
    });
    
    // Start observing the element
    this.observer.observe(this.el.nativeElement);
  }
  
  ngOnDestroy(): void {
    // Clean up observer when directive is destroyed
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
  
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    // Check if element is intersecting (visible) and animation hasn't started yet
    if (entries[0].isIntersecting && !this.animationStarted) {
      this.animationStarted = true;
      this.startTypewriterEffect();
      
      // Stop observing once animation starts
      this.observer?.unobserve(this.el.nativeElement);
    }
  }
  
  private startTypewriterEffect(): void {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.fullText.length) {
        this.el.nativeElement.textContent += this.fullText.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, this.speed);
  }
}