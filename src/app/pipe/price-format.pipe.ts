import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
  standalone: true
})
export class PriceFormatPipe implements PipeTransform {
  transform(value: number | string, currencySymbol: string = '₹'): string {
    if (!value) return `${currencySymbol}0`;
    
    // Convert to number if string
    const price = typeof value === 'string' ? parseFloat(value) : value;
    
    // Format with thousand separators
    const formattedPrice = price.toLocaleString('en-IN');
    
    return `${currencySymbol}${formattedPrice}`;
  }
}